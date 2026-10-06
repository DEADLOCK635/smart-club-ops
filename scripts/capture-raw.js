const { execSync } = require('child_process');
const path = require('path');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const out = path.resolve(__dirname, 'spline-online-view.png');
execSync(`"${chromePath}" --headless --enable-webgl --use-gl=angle --virtual-time-budget=8000 --screenshot="${out}" --window-size=1200,800 "https://my.spline.design/nexbotbyaximoriscopycopy-zphTJVa0kcNAxnI3BRfa29eE/"`, { stdio: 'inherit' });
console.log('Saved online view to', out);
