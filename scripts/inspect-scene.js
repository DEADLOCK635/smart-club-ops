const fs = require('fs');

const html = fs.readFileSync('public/nexbot.html', 'utf8');
const startIdx = html.indexOf('app.start([');
if (startIdx !== -1) {
  const endIdx = html.indexOf(']).then', startIdx);
  const arrStr = html.slice(startIdx + 11, endIdx);
  const bytes = Buffer.from(arrStr.split(',').map(Number));
  const text = bytes.toString('latin1');
  
  // Search for interesting keys like 'name', 'Plane', 'Floor', 'Ground', 'Grid', 'Box', etc.
  const matches = text.match(/[A-Za-z0-9_\-\. ]{4,40}/g) || [];
  const unique = Array.from(new Set(matches));
  
  const relevant = unique.filter(w => /floor|grid|plane|box|ground|camera|light|base|stage|cube|background/i.test(w));
  console.log('Relevant scene words:', relevant);
}
