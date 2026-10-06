const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputPath = path.resolve('scripts/seamless-check.png');

try {
  execSync(`"${chromePath}" --headless=new --enable-webgl --use-gl=angle --virtual-time-budget=3000 --screenshot="${outputPath}" --window-size=1280,950 "http://localhost:3000"`, { stdio: 'inherit' });
  console.log('Saved screenshot to:', outputPath, 'Exists:', fs.existsSync(outputPath), 'Size:', fs.statSync(outputPath).size);
} catch (e) {
  console.error('Error running chrome:', e.message);
}
