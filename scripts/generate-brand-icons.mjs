import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import encodeIco from "to-ico";
import { BRAND } from "../src/lib/admin/brandPalette.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const sourceLogo = path.join(root, "public/images/yvity-logo.png");

const [creamR, creamG, creamB] = [
  parseInt(BRAND.cream.slice(1, 3), 16),
  parseInt(BRAND.cream.slice(3, 5), 16),
  parseInt(BRAND.cream.slice(5, 7), 16),
];

const ICON_BG = { r: creamR, g: creamG, b: creamB, alpha: 1 };
const BLACK_THRESHOLD = 40;

async function makeLogoOnCream(size) {
  const padding = Math.max(2, Math.round(size * 0.08));
  const inner = size - padding * 2;

  const { data, info } = await sharp(sourceLogo)
    .resize(inner, inner, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r <= BLACK_THRESHOLD && g <= BLACK_THRESHOLD && b <= BLACK_THRESHOLD) {
      data[i + 3] = 0;
    }
  }

  const logoOnly = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: ICON_BG,
    },
  })
    .composite([{ input: logoOnly, gravity: "center" }])
    .png()
    .toBuffer();
}

async function writePng(buffer, target) {
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, buffer);
}

async function generateSet(outDir) {
  const icon32 = await makeLogoOnCream(32);
  const icon180 = await makeLogoOnCream(180);
  const icon16 = await makeLogoOnCream(16);
  const icon48 = await makeLogoOnCream(48);

  await writePng(icon32, path.join(outDir, "icon.png"));
  await writePng(icon180, path.join(outDir, "apple-icon.png"));

  const favicon = await encodeIco([icon16, icon32, icon48]);
  await fs.writeFile(path.join(outDir, "favicon.ico"), favicon);
}

const adminAppDir = path.join(root, "src/app");
const usersAppDir = path.resolve(root, "../Yvity_Users/src/app");
const usersBrandDir = path.resolve(root, "../Yvity_Users/public/brand");

await fs.copyFile(sourceLogo, path.join(usersBrandDir, "yvity-logo.png"));

await generateSet(adminAppDir);
await generateSet(usersAppDir);

console.log(`Generated brand icons on ${BRAND.cream} for Yvity_Admin and Yvity_Users`);
