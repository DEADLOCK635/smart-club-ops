const sharp = require('sharp');
const fs = require('fs');

async function process() {
  const { data, info } = await sharp('public/robot-hero.jpg')
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;

  // 1. Black-level crush: Map the background rgb(21, 26, 30) down to pure rgb(0,0,0)
  // while preserving the brilliant specular reflections and chrome rims
  const blackData = Buffer.alloc(width * height * 3);
  
  // Background reference color
  const bgR = 21.5, bgG = 26.5, bgB = 30.5;

  for (let i = 0; i < data.length; i += 3) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Distance from background color
    const dR = r - bgR;
    const dG = g - bgG;
    const dB = b - bgB;
    const dist = Math.sqrt(dR * dR + dG * dG + dB * dB);

    // If it's pure background (within radius 8 of background color), set to pure black (0,0,0)
    if (dist < 10) {
      blackData[i] = 0;
      blackData[i + 1] = 0;
      blackData[i + 2] = 0;
    } else {
      // Smooth transition
      const factor = Math.min(1, Math.max(0, (dist - 10) / 25));
      blackData[i] = Math.round(r * factor);
      blackData[i + 1] = Math.round(g * factor);
      blackData[i + 2] = Math.round(b * factor);
    }
  }

  // Also apply a subtle radial falloff so any distant edges fade cleanly into pure black
  const centerX = width * 0.48;
  const centerY = height * 0.52;
  const maxRadius = width * 0.46;

  const rgbaData = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 3;
      const rgbaIdx = (y * width + x) * 4;

      const r = blackData[idx];
      const g = blackData[idx + 1];
      const b = blackData[idx + 2];

      const dx = x - centerX;
      const dy = y - centerY;
      const distFromCenter = Math.sqrt(dx * dx + dy * dy);

      // Edge fade factor
      let edgeFade = 1;
      if (distFromCenter > maxRadius * 0.8) {
        edgeFade = Math.max(0, 1 - (distFromCenter - maxRadius * 0.8) / (maxRadius * 0.2));
      }

      // Check if pixel is black
      const brightness = (r + g + b) / 3;
      let alpha = 255;
      if (brightness < 2) {
        alpha = 0;
      } else {
        alpha = Math.round(Math.min(255, (brightness / 20) * 255) * edgeFade);
      }

      rgbaData[rgbaIdx] = r;
      rgbaData[rgbaIdx + 1] = g;
      rgbaData[rgbaIdx + 2] = b;
      rgbaData[rgbaIdx + 3] = alpha;
    }
  }

  // Save the pure-black background PNG
  await sharp(blackData, { raw: { width, height, channels: 3 } })
    .png()
    .toFile('public/robot-hero-black.png');

  // Save the transparent cutout PNG
  await sharp(rgbaData, { raw: { width, height, channels: 4 } })
    .png()
    .toFile('public/robot-hero-transparent.png');

  console.log('Successfully generated public/robot-hero-black.png and public/robot-hero-transparent.png!');
}

process().catch(console.error);
