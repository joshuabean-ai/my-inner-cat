// Builds data/{archetypes,cats,questions}.json from the three source markdown
// files, validates referential integrity, and copies/renames the cat images
// into public/cats/ using the project's naming convention.
//
// Re-run any time the source markdown changes:  node scripts/build-data.mjs
//
// Parsing the markdown (rather than hand-transcribing) keeps the JSON a
// faithful, regenerable projection of the designed source content.

import { readFileSync, writeFileSync, readdirSync, rmSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const p = (...s) => resolve(ROOT, ...s);
const read = (f) => readFileSync(p(f), "utf8");

const ARROW = "→"; // →

// ---- helpers ---------------------------------------------------------------

const stripAccents = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");

// Display name -> normalized key for matching archetype references across files.
const normName = (s) =>
  stripAccents(s).toLowerCase().replace(/^the\s+/, "").replace(/[.]/g, "").replace(/\s+/g, " ").trim();

// Cat display name -> snake_case id. Drops possessive "'s", then apostrophes.
const catId = (name) =>
  stripAccents(name)
    .toLowerCase()
    .replace(/'s\b/g, "")
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const hyph = (id) => id.replace(/_/g, "-");

// Cat display name -> source image basename (apostrophes dropped, not "'s").
const sourceSlug = (name) =>
  stripAccents(name)
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// A couple of source images were saved with typo'd filenames.
const SOURCE_OVERRIDES = {
  "Maine Coon": "main-coone",
  LaPerm: "lapirm",
};

// Wild species (everything else is a domestic breed). Used for the field-guide
// "ORIGIN" eyebrow on the result card. Keyed by generated cat id.
const WILD_SPECIES = new Set([
  "caracal", "serval", "cheetah", "clouded_leopard", "snow_leopard", "andean_cat",
  "siberian_tiger", "lion", "jaguar", "puma", "leopard", "guina", "asiatic_wildcat",
  "chinese_mountain_cat", "bobcat", "bornean_bay_cat", "ocelot", "colocolo",
  "fishing_cat", "flat_headed_cat", "jaguarundi", "rusty_spotted_cat", "pallas_cat",
  "sand_cat", "asian_golden_cat", "black_footed_cat", "eurasian_lynx", "marbled_cat",
  "iberian_lynx", "african_wildcat", "margay", "geoffroy_cat", "iriomote_cat",
  "jungle_cat", "pampas_cat", "asian_leopard_cat", "african_golden_cat",
]);

// ---- 1. archetypes ---------------------------------------------------------

function parseArchetypes() {
  const lines = read("archetype_data.md").split("\n");
  const out = [];
  let cur = null;
  let collectingDesc = false;

  const flush = () => {
    if (cur) {
      cur.description = cur.descLines.join(" ").replace(/\s+/g, " ").trim();
      delete cur.descLines;
      out.push(cur);
    }
  };

  for (const line of lines) {
    const h = line.match(/^##\s+(.+?)\s*$/);
    if (h) {
      if (h[1].startsWith("Naming Conventions")) {
        flush();
        cur = null;
        break;
      }
      flush();
      cur = { id: "", name: h[1].trim(), description: "", tagline: "", descLines: [] };
      collectingDesc = false;
      continue;
    }
    if (!cur) continue;

    const id = line.match(/^- \*\*ID:\*\*\s*`([^`]+)`/);
    if (id) {
      cur.id = id[1].trim();
      continue;
    }
    const tag = line.match(/^- \*\*Tagline:\*\*\s*(.+?)\s*$/);
    if (tag) {
      cur.tagline = tag[1].trim();
      collectingDesc = true;
      continue;
    }
    if (collectingDesc) {
      if (line.trim() === "---") {
        collectingDesc = false;
        continue;
      }
      if (line.trim() === "" || line.startsWith("#") || line.startsWith("- ")) continue;
      cur.descLines.push(line.trim());
    }
  }
  return out;
}

// ---- 2. cats ---------------------------------------------------------------

function parseCats(nameToId) {
  const lines = read("cat_profiles_and_trivia.md").split("\n");
  const out = [];
  let archId = null;
  let cur = null;

  const flush = () => {
    if (cur) {
      cur.blurb = cur.blurbLines.join(" ").replace(/\s+/g, " ").trim();
      delete cur.blurbLines;
      out.push(cur);
    }
    cur = null;
  };

  for (const line of lines) {
    const h = line.match(/^##\s+(.+?)\s*$/);
    if (h) {
      flush();
      const key = normName(h[1]);
      if (h[1].startsWith("Roster Summary") || h[1].startsWith("Notes for Build")) {
        archId = null;
        break;
      }
      archId = nameToId.get(key) ?? null;
      continue;
    }
    if (!archId) continue;

    const cat = line.match(/^\*\*(.+?)\*\*\s*\*\((common|uncommon|rare|legendary)\)\*/);
    if (cat) {
      flush();
      const name = cat[1].trim();
      const id = catId(name);
      cur = {
        id,
        name,
        archetype: archId,
        rarity: cat[2],
        origin: WILD_SPECIES.has(id) ? "wild" : "domestic",
        number: 0, // assigned after the full roster is parsed
        blurb: "",
        trivia: "",
        image: `/cats/${hyph(archId)}-${hyph(id)}-${cat[2]}.webp`,
        blurbLines: [],
      };
      continue;
    }
    if (!cur) continue;

    const trivia = line.match(/^\*Trivia:\s*(.+?)\*\s*$/);
    if (trivia) {
      cur.trivia = trivia[1].trim();
      continue;
    }
    if (line.trim() === "---" || line.trim() === "") continue;
    cur.blurbLines.push(line.trim());
  }
  return out;
}

// ---- 3. questions ----------------------------------------------------------

function parseQuestions(nameToId) {
  const lines = read("cat_quiz_scoring_tags.md").split("\n");
  const out = [];
  let cur = null;
  let inQuestions = false;
  const unknownTags = new Set();

  const flush = () => {
    if (cur) out.push(cur);
    cur = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const h = line.match(/^###\s+Q(\d+)\.\s*(.+?)\.?\s*$/);
    if (h) {
      inQuestions = true;
      flush();
      cur = { id: `q${h[1]}`, title: h[2].trim(), setup: "", answers: [] };
      continue;
    }
    if (!inQuestions) continue;
    if (line.startsWith("## ")) {
      // Left the question section (e.g. Notes for Playtesting).
      flush();
      inQuestions = false;
      continue;
    }
    if (!cur) continue;

    if (!cur.setup) {
      const s = line.match(/^\*(.+)\*\s*$/);
      if (s) {
        cur.setup = s[1].trim();
        continue;
      }
    }

    const a = line.match(/^- \*\*([A-E])\.\*\*\s*(.+?)\s*$/);
    if (a) {
      const letter = a[1].toLowerCase();
      // The next non-empty line holds the archetype tags (→ A, B, C).
      let tags = [];
      for (let j = i + 1; j < lines.length; j++) {
        const t = lines[j].match(/^\s*→\s*(.+?)\s*$/);
        if (t) {
          tags = t[1].split(",").map((x) => {
            const id = nameToId.get(normName(x));
            if (!id) unknownTags.add(x.trim());
            return id;
          });
          break;
        }
        if (lines[j].trim() !== "") break;
      }
      cur.answers.push({
        id: `${cur.id}${letter}`,
        text: a[2].trim(),
        tags: tags.filter(Boolean),
      });
    }
  }
  flush();
  if (unknownTags.size) {
    throw new Error(`Unknown archetype tags: ${[...unknownTags].join(", ")}`);
  }
  return out;
}

// ---- build -----------------------------------------------------------------

const archetypes = parseArchetypes();
const nameToId = new Map(archetypes.map((a) => [normName(a.name), a.id]));
const cats = parseCats(nameToId);
cats.forEach((c, i) => (c.number = i + 1)); // stable 1-based collection number
const questions = parseQuestions(nameToId);

// ---- validate --------------------------------------------------------------

const errors = [];
const warnings = [];
const archIds = new Set(archetypes.map((a) => a.id));

if (archetypes.length !== 20) errors.push(`expected 20 archetypes, got ${archetypes.length}`);
if (cats.length !== 89) errors.push(`expected 89 cats, got ${cats.length}`);
if (questions.length !== 27) errors.push(`expected 27 questions, got ${questions.length}`);

for (const a of archetypes) {
  if (!a.id || !a.name || !a.tagline || !a.description)
    errors.push(`archetype "${a.name}" missing a field`);
}

const catIds = new Set();
for (const c of cats) {
  if (catIds.has(c.id)) errors.push(`duplicate cat id: ${c.id}`);
  catIds.add(c.id);
  if (!archIds.has(c.archetype)) errors.push(`cat ${c.id} references unknown archetype ${c.archetype}`);
  if (!c.blurb || !c.trivia) errors.push(`cat ${c.id} missing blurb/trivia`);
}

// Every archetype must have at least one cat (so selectVariant never throws).
for (const id of archIds) {
  if (!cats.some((c) => c.archetype === id)) errors.push(`archetype ${id} has no cats`);
}

// Catch typos in the WILD_SPECIES set (an id that matches no cat).
for (const id of WILD_SPECIES) {
  if (!catIds.has(id)) errors.push(`WILD_SPECIES has unknown cat id: ${id}`);
}

const qIds = new Set();
for (const q of questions) {
  if (qIds.has(q.id)) errors.push(`duplicate question id: ${q.id}`);
  qIds.add(q.id);
  if (!q.setup) errors.push(`question ${q.id} missing setup`);
  if (q.answers.length < 2) errors.push(`question ${q.id} has < 2 answers`);
  for (const ans of q.answers) {
    if (!ans.text) errors.push(`answer ${ans.id} missing text`);
    // 3-5 tags is the design norm; 2 is intentional in a few source answers and
    // the engine handles it fine. Fewer than 2 (or none) is a real problem.
    if (ans.tags.length < 2) errors.push(`answer ${ans.id} has ${ans.tags.length} tags`);
    else if (ans.tags.length < 3)
      warnings.push(`answer ${ans.id} has only ${ans.tags.length} tags (source has 3-5 for most)`);
    for (const tag of ans.tags) {
      if (!archIds.has(tag)) errors.push(`answer ${ans.id} has unknown tag ${tag}`);
    }
  }
}

if (errors.length) {
  console.error("VALIDATION FAILED:");
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}

// ---- write JSON ------------------------------------------------------------

const write = (f, obj) => writeFileSync(p("data", f), JSON.stringify(obj, null, 2) + "\n");
write("archetypes.json", { archetypes });
write("cats.json", { cats });
write("questions.json", { questions });

// ---- images: optimize from originals into public/cats ----------------------
//
// Originals in images/ are ~2.5 MB PNGs. We downscale to 1024 px and re-encode
// as WebP (~120 KB) for the shipped public/cats/ — keeps the repo light while
// next/image still serves per-device derivatives to users. Originals are never
// modified, so this is fully reversible by re-running the script.

const available = new Set(readdirSync(p("images")).filter((f) => f.endsWith(".png")));
const imageErrors = [];
const checklist = [];

// Start from a clean output dir so renamed/removed cats don't leave orphans.
rmSync(p("public/cats"), { recursive: true, force: true });
mkdirSync(p("public/cats"), { recursive: true });

for (const c of cats) {
  const srcBase = SOURCE_OVERRIDES[c.name] ?? sourceSlug(c.name);
  const srcFile = `${srcBase}.png`;
  const targetFile = c.image.replace("/cats/", "");
  if (!available.has(srcFile)) {
    imageErrors.push(`${c.name}: source image not found (looked for images/${srcFile})`);
    continue;
  }
  await sharp(p("images", srcFile))
    .resize(1024, 1024, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(p("public/cats", targetFile));
  checklist.push(`  ${srcFile.padEnd(28)} -> public/cats/${targetFile}`);
}

if (imageErrors.length) {
  console.error("IMAGE MAPPING FAILED:");
  for (const e of imageErrors) console.error("  - " + e);
  process.exit(1);
}

// ---- report ----------------------------------------------------------------

const byArch = {};
for (const c of cats) (byArch[c.archetype] ??= []).push(c.rarity);
const byRarity = cats.reduce((m, c) => ((m[c.rarity] = (m[c.rarity] ?? 0) + 1), m), {});
const wild = cats.filter((c) => c.origin === "wild").length;

console.log(`archetypes: ${archetypes.length}`);
console.log(`cats:       ${cats.length}  (${JSON.stringify(byRarity)})`);
console.log(`origin:     ${cats.length - wild} domestic / ${wild} wild`);
console.log(`questions:  ${questions.length}`);
console.log(`images copied: ${checklist.length}/89`);
console.log("\nImage rename checklist (source -> target):");
console.log(checklist.join("\n"));
if (warnings.length) {
  console.log("\nWarnings (non-fatal):");
  for (const w of warnings) console.log("  - " + w);
}
console.log("\nAll integrity checks passed.");
