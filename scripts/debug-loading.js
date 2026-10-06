const { execSync } = require('child_process');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

try {
  const out = execSync(`"${chromePath}" --headless=new --enable-webgl --use-gl=angle --disable-web-security --user-data-dir="%TEMP%\\chrome_test_profile" --virtual-time-budget=20000 --dump-dom "http://localhost:3000/spline-robot.html"`, { encoding: 'utf8' });
  const startIdx = out.indexOf('id="debug-log"');
  if (startIdx !== -1) {
    const endIdx = out.indexOf('</div>', startIdx);
    console.log('DEBUG LOG CONTENTS:\n', out.substring(startIdx, endIdx));
  } else {
    console.log('debug-log not found in DOM');
  }
} catch (e) {
  console.error('Error:', e.message);
}
