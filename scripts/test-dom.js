const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputPath = path.resolve('scripts/site-check.png');

try {
  execSync(`"${chromePath}" --headless --enable-webgl --use-gl=angle --virtual-time-budget=15000 --dump-dom --screenshot="${outputPath}" --window-size=1280,950 "http://localhost:3000/spline-robot.html"`, { stdio: 'inherit' });
  console.log('Saved screenshot to:', outputPath, 'Exists:', fs.existsSync(outputPath), 'Size:', fs.statSync(outputPath).size);
} catch (e) {
  console.error('Error running chrome:', e.message);
}
