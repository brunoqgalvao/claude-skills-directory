#!/usr/bin/env node
/**
 * Generate all brand assets from logomark.png
 * - Resized favicons (16, 32, 180, 192, 512)
 * - OG image (1200x630 with logo + text)
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'packages/web/public');
const logomark = path.join(publicDir, 'logomark.png');

async function generateFavicons() {
  console.log('Generating favicon variants...\n');

  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 },
  ];

  for (const { name, size } of sizes) {
    await sharp(logomark)
      .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.join(publicDir, name));
    console.log(`  ✓ ${name} (${size}x${size})`);
  }

  // Copy 32x32 as favicon.ico (browsers accept PNG)
  fs.copyFileSync(path.join(publicDir, 'favicon-32x32.png'), path.join(publicDir, 'favicon.ico'));
  console.log('  ✓ favicon.ico');
}

async function generateOgImage() {
  console.log('\nGenerating OG image (1200x630)...\n');

  const width = 1200;
  const height = 630;
  const logoSize = 260;
  const logoX = 100;
  const logoY = Math.floor((height - logoSize) / 2);

  // Resize logo
  const resizedLogo = await sharp(logomark)
    .resize(logoSize, logoSize, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .toBuffer();

  // Create SVG with text
  const textSvg = `
    <svg width="${width}" height="${height}">
      <style>
        .title { font: bold 64px system-ui, sans-serif; fill: #111111; }
        .subtitle { font: 28px system-ui, sans-serif; fill: #6b7280; }
      </style>
      <text x="420" y="290" class="title">Agent Skills</text>
      <text x="420" y="350" class="subtitle">Open Source Claude Skills Directory</text>
    </svg>
  `;

  // Composite everything
  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    .composite([
      { input: resizedLogo, left: logoX, top: logoY },
      { input: Buffer.from(textSvg), left: 0, top: 0 }
    ])
    .png()
    .toFile(path.join(publicDir, 'og-image.png'));

  console.log('  ✓ og-image.png (1200x630)');
}

async function main() {
  console.log('🎨 Generating brand assets from logomark.png\n');

  if (!fs.existsSync(logomark)) {
    console.error('Error: logomark.png not found');
    process.exit(1);
  }

  await generateFavicons();
  await generateOgImage();

  console.log('\n✅ All assets generated!');
}

main().catch(console.error);
