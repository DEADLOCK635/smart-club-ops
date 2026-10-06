const fs = require('fs');

let html = fs.readFileSync('public/spline-robot-raw.html', 'utf8');

// 1. Hide watermark and blurhash
html = html.replace('.spline-watermark {', '.spline-watermark { display: none !important; ');
html = html.replace('#blurhash {', '#blurhash { display: none !important; ');

// 2. Set background to pure black
html = html.replace('background: rgba(226.74188410194176,226.74188410194176,226.74188410194176, 1);', 'background: #000000 !important; background-color: #000000 !important;');

const darkCss = `
<style>
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    height: 100% !important;
    overflow: hidden !important;
    background: #000000 !important;
    background-color: #000000 !important;
  }
  #canvas3d, canvas {
    width: 100% !important;
    height: 100% !important;
    outline: none !important;
    display: block !important;
    background: #000000 !important;
    background-color: #000000 !important;
  }
</style>
`;
html = html.replace('</head>', darkCss + '</head>');

// 3. Custom onLoad hook
const targetOnLoad = `const onLoad = () => {\n\t\t\t\tif (blurhash) blurhash.style.display = 'none';\n\t\t\t\t\n\t\t\t\t\n\t\t\t}`;

const customHook = `const onLoad = () => {
				if (blurhash) blurhash.style.display = 'none';
				try {
					console.log('Spline raw onLoad executed');
					if (typeof app.setBackgroundColor === 'function') {
						try { app.setBackgroundColor('#000000'); } catch(e){}
					}
					if (app._renderer) {
						try { app._renderer.setClearColor(0x000000, 1); } catch(e){}
					}
					const bottom = app.findObjectByName('Bottom');
					if (bottom) bottom.visible = false;

					const all = (typeof app.getAllObjects === 'function') ? app.getAllObjects() : [];
					all.forEach(obj => {
						const n = (obj.name || '').toLowerCase();
						if (n.includes('grid') || n.includes('floor') || n.includes('stage') || n.includes('ground') || n.startsWith('leg') || n === 'pelvic') {
							obj.visible = false;
						}
					});
				} catch(e) {
					console.error('onLoad err:', e);
				}
			}`;

if (html.includes(targetOnLoad)) {
  html = html.replace(targetOnLoad, customHook);
} else {
  const startIdx = html.indexOf('const onLoad = () =>');
  const endIdx = html.indexOf('app.start(', startIdx);
  html = html.substring(0, startIdx) + customHook + '\n\n\t\t\t' + html.substring(endIdx);
}

fs.writeFileSync('public/spline-robot.html', html, 'utf8');
console.log('Saved public/spline-robot.html successfully');
