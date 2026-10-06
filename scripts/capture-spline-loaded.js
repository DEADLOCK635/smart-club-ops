const { execSync } = require('child_process');
const path = require('path');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const out = path.resolve(__dirname, 'spline-online-loaded.png');
execSync(`"${chromePath}" --headless --enable-webgl --use-gl=angle --virtual-time-budget=15000 --screenshot="${out}" --window-size=1200,900 "https://my.spline.design/nexbotbyaximoriscopycopy-zphTJVa0kcNAxnI3BRfa29eE/"`, { stdio: 'inherit' });
console.log('Saved loaded view to', out);
