import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import type { Archetype, Cat } from "./types";
import { RARITY_META } from "./rarity";

// Run on the Node runtime so we can read the vendored font files from disk.
const fontDir = join(process.cwd(), "assets", "fonts");
let cachedFonts: { name: string; data: Buffer; weight: 400 | 500 | 600 | 700; style: "normal" | "italic" }[] | null = null;

function cardFonts() {
  if (!cachedFonts) {
    cachedFonts = [
      { name: "Fraunces", data: readFileSync(join(fontDir, "fraunces-600.woff")), weight: 600, style: "normal" },
      { name: "Fraunces", data: readFileSync(join(fontDir, "fraunces-700.woff")), weight: 700, style: "normal" },
      { name: "Fraunces", data: readFileSync(join(fontDir, "fraunces-600-italic.woff")), weight: 600, style: "italic" },
      { name: "Geist", data: readFileSync(join(fontDir, "geist-500.woff")), weight: 500, style: "normal" },
      { name: "Geist", data: readFileSync(join(fontDir, "geist-400.woff")), weight: 400, style: "normal" },
    ];
  }
  return cachedFonts;
}

const CREAM = "#F8F4ED";
const PAPER = "#FDFAF3";
const INK = "#3A3A4A";
const INK_SOFT = "#6B6B7A";
const INK_WHISPER = "#9A9AA8";
const FOIL =
  "linear-gradient(110deg,#c9a24b 0%,#ecdca8 18%,#c8b6e2 40%,#b8d4e3 58%,#b5ddc4 74%,#ecdca8 88%,#c9a24b 100%)";

const SIZES = {
  portrait: { width: 1080, height: 1350 },
  landscape: { width: 1200, height: 630 },
};

interface CardArgs {
  archetype: Archetype;
  cat: Cat;
  format: "portrait" | "landscape";
}

function label(s: string) {
  return s.toUpperCase();
}

// Embed the watercolor portrait straight from disk (no network dependency, so
// it renders identically at build time and runtime), downscaled to card size
// so satori stays fast and the embedded data URI stays small.
async function portraitDataUri(cat: Cat) {
  const buf = readFileSync(join(process.cwd(), "public", cat.image));
  const resized = await sharp(buf)
    .resize(800, 800, { fit: "cover" })
    .png({ quality: 82 })
    .toBuffer();
  return `data:image/png;base64,${resized.toString("base64")}`;
}

export async function buildCardResponse({ archetype, cat, format }: CardArgs) {
  const meta = RARITY_META[cat.rarity];
  const size = SIZES[format];
  const imgSrc = await portraitDataUri(cat);
  const originLabel = cat.origin === "wild" ? "Wild species" : "Domestic breed";
  const frameStyle = meta.foil
    ? { backgroundImage: FOIL }
    : { backgroundColor: meta.accent };
  const nameColor = meta.foil ? "#9A7320" : INK;

  // Tier seal — a rounded medallion with a small diamond bullet.
  const seal = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: format === "portrait" ? "14px 30px" : "10px 22px",
        borderRadius: 999,
        border: `3px solid ${meta.foil ? "#C9A24B" : meta.accent}`,
        ...(meta.foil ? { backgroundImage: FOIL } : { backgroundColor: PAPER }),
        color: meta.foil ? "#5a4410" : meta.ink,
        fontFamily: "Geist",
        fontWeight: 500,
        fontSize: format === "portrait" ? 30 : 22,
        letterSpacing: 4,
      }}
    >
      <div
        style={{
          width: format === "portrait" ? 16 : 12,
          height: format === "portrait" ? 16 : 12,
          transform: "rotate(45deg)",
          backgroundColor: meta.foil ? "#7a5d12" : meta.ink,
        }}
      />
      {label(meta.label)}
    </div>
  );

  const element =
    format === "portrait" ? (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: `radial-gradient(120% 80% at 50% 8%, ${meta.tint} 0%, ${CREAM} 60%)`,
          padding: 64,
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontFamily: "Fraunces", fontWeight: 700, fontSize: 34, color: INK }}>
            My Inner Cat
          </div>
          <div style={{ display: "flex", color: INK_WHISPER, letterSpacing: 3, fontSize: 24 }}>
            {label(`No. ${cat.number} / 89`)}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 18 }}>
          <div style={{ display: "flex", color: INK_WHISPER, letterSpacing: 6, fontSize: 24 }}>
            {label("You are")}
          </div>
          <div style={{ display: "flex", fontFamily: "Fraunces", fontWeight: 700, fontSize: 60, color: INK, marginTop: 6 }}>
            {archetype.name}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
          <div style={{ display: "flex", ...frameStyle, padding: 8, borderRadius: 36 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imgSrc} width={760} height={760} style={{ borderRadius: 28, objectFit: "cover" }} alt="" />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: -28 }}>{seal}</div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 16 }}>
          <div style={{ display: "flex", fontFamily: "Fraunces", fontWeight: 700, fontSize: 78, color: nameColor }}>
            {cat.name}
          </div>
          <div style={{ display: "flex", color: INK_SOFT, letterSpacing: 5, fontSize: 24, marginTop: 12 }}>
            {label(`${originLabel} · ${archetype.tagline}`)}
          </div>
        </div>
      </div>
    ) : (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          background: `radial-gradient(120% 120% at 85% 50%, ${meta.tint} 0%, ${CREAM} 55%)`,
          padding: 64,
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", ...frameStyle, padding: 7, borderRadius: 28 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imgSrc} width={440} height={440} style={{ borderRadius: 22, objectFit: "cover" }} alt="" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginLeft: 56, maxWidth: 560 }}>
          <div style={{ display: "flex", color: INK_WHISPER, letterSpacing: 6, fontSize: 24 }}>
            {label("You are")}
          </div>
          <div style={{ display: "flex", fontFamily: "Fraunces", fontWeight: 700, fontSize: 64, color: INK, marginTop: 6 }}>
            {archetype.name}
          </div>
          <div style={{ display: "flex", marginTop: 22 }}>{seal}</div>
          <div style={{ display: "flex", fontFamily: "Fraunces", fontWeight: 700, fontSize: 44, color: nameColor, marginTop: 22 }}>
            {cat.name}
          </div>
          <div style={{ display: "flex", color: INK_WHISPER, fontSize: 24, marginTop: 26, letterSpacing: 3 }}>
            {label("myinnercat.com")}
          </div>
        </div>
      </div>
    );

  return new ImageResponse(element, {
    width: size.width,
    height: size.height,
    fonts: cardFonts(),
  });
}
