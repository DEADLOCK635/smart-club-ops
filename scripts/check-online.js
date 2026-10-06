const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputPath = path.resolve('scripts/spline-online-check.png');

try {
  execSync(`"${chromePath}" --headless --enable-webgl --use-gl=angle --virtual-time-budget=7000 --screenshot="${outputPath}" --window-size=1280,950 "https://my.spline.design/nexbotbyaximoriscopycopy-zphTJVa0kcNAxnI3BRfa29eE/"`, { stdio: 'inherit' });
  console.log('Saved screenshot to:', outputPath, 'Exists:', fs.existsSync(outputPath), 'Size:', fs.statSync(outputPath).size);
} catch (e) {
  console.error('Error running chrome:', e.message);
}
