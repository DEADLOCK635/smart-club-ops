const fs = require('fs');

async function main() {
  console.log('Fetching Spline scene from public URL...');
  const res = await fetch('https://my.spline.design/nexbotbyaximoriscopycopy-zphTJVa0kcNAxnI3BRfa29eE/');
  const html = await res.text();

  let modified = html.replace(
    /background:\s*rgba\([^)]+\);/g,
    'background: transparent !important; background-color: transparent !important;'
  );

  modified = modified.replace(
    '.spline-watermark {',
    '.spline-watermark { display: none !important; '
  );

  // Force pure transparent background across all elements
  const extraStyles = `
    html, body {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background: transparent !important;
      background-color: transparent !important;
    }
    #canvas3d {
      width: 100% !important;
      height: 100% !important;
      outline: none;
      display: block;
      background: transparent !important;
      background-color: transparent !important;
    }
  `;
  modified = modified.replace('canvas {', extraStyles + 'canvas {');

  const onLoadHook = `const onLoad = () => {
    try {
      if (app) {
        if (typeof app.setBackgroundColor === 'function') {
          try { app.setBackgroundColor('transparent'); } catch(e){}
        }
        if (app._renderer) {
          try {
            app._renderer.setClearColor(0x000000, 0);
          } catch(e){}
        }
        if (app._scene) {
          app._scene.background = null;
          app._scene.traverse(child => {
            const n = (child.name || '').toLowerCase();
            if (
              n.includes('grid') || 
              n.includes('floor') || 
              n.includes('plane') || 
              n.includes('cube') || 
              n.includes('box') || 
              n.includes('stage') || 
              n.includes('ground') || 
              n.includes('tesla') || 
              n.includes('base') || 
              n.includes('wall') || 
              n.includes('platform') ||
              child.isGridHelper ||
              child.type === 'GridHelper'
            ) {
              child.visible = false;
            }
          });
        }

        const allObjects = (typeof app.getAllObjects === 'function') ? app.getAllObjects() : [];
        console.log('Total scene objects:', allObjects.length);

        // Send objects to logger
        try {
          const list = allObjects.map(o => ({ name: o.name, id: o.id, type: o.type }));
          fetch('/api/log-objects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(list)
          }).catch(() => {});
        } catch(e){}

        // Hide floor/cubes/grid/text and legs if named
        allObjects.forEach(obj => {
          const n = (obj.name || '').toLowerCase();
          if (
            n.includes('grid') || 
            n.includes('floor') || 
            n.includes('plane') || 
            n.includes('cube') || 
            n.includes('box') || 
            n.includes('stage') || 
            n.includes('ground') || 
            n.includes('tesla') || 
            n.includes('base') || 
            n.includes('wall') || 
            n.includes('platform') ||
            n.includes('leg') ||
            n.includes('foot') ||
            n.includes('feet') ||
            n.includes('thigh') ||
            n.includes('calf') ||
            n.includes('knee') ||
            n.includes('shin') ||
            n.includes('boot') ||
            n.includes('shoe')
          ) {
            obj.visible = false;
          }
        });

        // Set camera framing for Head to Torso only
        // Head at top with breathing room, torso at bottom, legs completely off-screen
        if (app._camera) {
          try {
            if (app._camera.zoom) {
              app._camera.zoom = 2.1;
              app._camera.updateProjectionMatrix();
            }
            if (app._camera.position) {
              // Frame the bust: raise focus to upper torso/head
              app._camera.position.y = 80;
            }
          } catch(e){}
        }
        if (typeof app.setZoom === 'function') {
          try { app.setZoom(2.1); } catch(e){}
        }
      }
    } catch (err) {
      console.warn('onLoad styling hook error:', err);
    }
  };`;

  modified = modified.replace(/const onLoad = \(\) =>\s*\{[\s\S]*?\}/, onLoadHook);

  fs.writeFileSync('public/nexbot.html', modified, 'utf8');
  console.log('Successfully generated public/nexbot.html! Size:', fs.statSync('public/nexbot.html').size);
}

main().catch(console.error);
