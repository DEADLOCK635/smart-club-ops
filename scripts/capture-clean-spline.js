const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputPath = path.resolve('scripts/clean-spline-check.png');

try {
  // Wait 18 seconds
  execSync(`"${chromePath}" --headless=new --enable-webgl --use-gl=angle --disable-web-security --user-data-dir="%TEMP%\\chrome_test_profile" --virtual-time-budget=18000 --screenshot="${outputPath}" --window-size=1000,800 "http://localhost:3000/spline-robot.html"`, { stdio: 'inherit' });
  console.log('Saved screenshot to:', outputPath, 'Exists:', fs.existsSync(outputPath), 'Size:', fs.statSync(outputPath).size);
} catch (e) {
  console.error('Error running chrome:', e.message);
}
