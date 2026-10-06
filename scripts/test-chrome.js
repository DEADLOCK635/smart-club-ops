const { execSync } = require('child_process');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
try {
  const cmd = `"${chromePath}" --headless --dump-dom "http://localhost:3000/nexbot.html"`;
  const out = execSync(cmd, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  console.log('DOM length:', out.length);
  console.log('Includes canvas:', out.includes('<canvas'));
} catch (e) {
  console.error(e.message);
}
