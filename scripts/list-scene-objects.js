const fs = require('fs');

const html = fs.readFileSync('public/nexbot.html', 'utf8');
const startIdx = html.indexOf('app.start([');
if (startIdx !== -1) {
  const endIdx = html.indexOf(']).then', startIdx);
  const arrStr = html.slice(startIdx + 11, endIdx);
  const bytes = Buffer.from(arrStr.split(',').map(Number));
  const text = bytes.toString('latin1');
  
  // Find all occurrences of "name" followed by string
  // Spline JSON or MessagePack stores strings
  const regex = /name[\x00-\x20\xa0-\xbf]*([A-Za-z0-9_\- ]{2,30})/g;
  const found = new Set();
  let m;
  while ((m = regex.exec(text)) !== null) {
    found.add(m[1]);
  }
  console.log('Total names found:', found.size);
  console.log('List of names:', Array.from(found).slice(0, 100));
}
