const fs = require('fs');

let html = fs.readFileSync('public/spline-robot-raw.html', 'utf8');

// 1. Clean CSS and force pure black
html = html.replace(/background:\s*rgba\([^)]+\);/, 'background: #000000 !important; background-color: #000000 !important;');
html = html.replace('.spline-watermark {', '.spline-watermark { display: none !important; ');
html = html.replace('#blurhash {', '#blurhash { display: none !important; ');

const extraCss = `
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
html = html.replace('</head>', extraCss + '</head>');

// 2. Custom clean onLoad hook
const targetOnLoad = `const onLoad = () => {\n\t\t\t\tif (blurhash) blurhash.style.display = 'none';\n\t\t\t\t\n\t\t\t\t\n\t\t\t}`;

const customHook = `const onLoad = () => {
				if (blurhash) blurhash.style.display = 'none';
				try {
					console.log('Spline onLoad executed!');
					window.__app = app;
					if (typeof app.setBackgroundColor === 'function') {
						try { app.setBackgroundColor('#000000'); } catch(e){}
					}
					if (app._renderer) {
						try { app._renderer.setClearColor(0x000000, 1); } catch(e){}
					}
					if (app._scene) {
						try { app._scene.background = null; } catch(e){}
					}
					const all = (typeof app.getAllObjects === 'function') ? app.getAllObjects() : [];
					console.log('Total Spline objects:', all.length);
					all.forEach(obj => {
						const n = (obj.name || '').toLowerCase();
						if (
							n === 'bottom' || 
							n === 'pelvic' || 
							n.includes('floor') || 
							n.includes('grid') || 
							n.includes('stage') || 
							n.includes('ground') || 
							n.startsWith('leg')
						) {
							obj.visible = false;
						}
					});
				} catch(e) {
					console.error('onLoad error:', e);
				}
			}`;

if (html.includes(targetOnLoad)) {
  html = html.replace(targetOnLoad, customHook);
  console.log('Successfully replaced onLoad target!');
} else {
  console.warn('targetOnLoad exact string NOT found, using substring replacement');
  const startIdx = html.indexOf('const onLoad = () =>');
  const endIdx = html.indexOf('app.start(', startIdx);
  if (startIdx !== -1 && endIdx !== -1) {
    html = html.substring(0, startIdx) + customHook + '\n\n\t\t\t' + html.substring(endIdx);
    console.log('Successfully replaced onLoad via index range!');
  }
}

fs.writeFileSync('public/spline-robot.html', html, 'utf8');
console.log('Saved public/spline-robot.html successfully');
