const { execSync } = require('child_process');
const path = require('path');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const out = path.resolve(__dirname, 'nexbot-test.png');
execSync(`"${chromePath}" --headless --enable-webgl --use-gl=angle --virtual-time-budget=4000 --screenshot="${out}" --window-size=1000,800 "http://localhost:3000/nexbot.html"`, { stdio: 'inherit' });
console.log('Saved nexbot-test.png to', out);
