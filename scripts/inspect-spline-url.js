async function run() {
  const url = 'https://my.spline.design/nexbotbyaximoriscopycopy-zphTJVa0kcNAxnI3BRfa29eE/';
  const res = await fetch(url);
  const text = await res.text();
  console.log('Status:', res.status, 'Length:', text.length);
  
  // Look for spline scene url
  const regex = /https?:\/\/[^"'\s]+\.splinecode/g;
  const matches = text.match(regex);
  console.log('Splinecode matches:', matches);

  // Look for app.start or app.load
  const startIdx = text.indexOf('app.start');
  const loadIdx = text.indexOf('app.load');
  console.log('app.start index:', startIdx, 'app.load index:', loadIdx);
  if (startIdx !== -1) {
    console.log('app.start snippet:', text.slice(startIdx, startIdx + 80));
  }
  if (loadIdx !== -1) {
    console.log('app.load snippet:', text.slice(loadIdx, loadIdx + 80));
  }
}
run();
