const { execSync } = require('child_process');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

try {
  // Capture without virtual-time-budget, letting real time elapse
  const out = execSync(`"${chromePath}" --headless=new --enable-webgl --use-gl=angle --disable-web-security --user-data-dir="%TEMP%\\chrome_test_profile" --dump-dom "http://localhost:3000/spline-robot.html"`, { encoding: 'utf8' });
  const startIdx = out.indexOf('id="debug-log"');
  if (startIdx !== -1) {
    const endIdx = out.indexOf('</div>', startIdx);
    console.log('REAL TIME DOM LOG:\n', out.substring(startIdx, endIdx));
  }
} catch (e) {
  console.error('Error:', e.message);
}
