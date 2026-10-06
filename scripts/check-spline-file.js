async function run() {
  const fileId = '788429f4-e986-46d7-a6de-be112f656387';
  
  // Try Spline API endpoints
  const urls = [
    `https://app.spline.design/api/files/${fileId}`,
    `https://my.spline.design/api/files/${fileId}`,
    `https://prod.spline.design/${fileId}/scene.splinecode`,
    `https://draft.spline.design/${fileId}/scene.splinecode`,
    `https://app.spline.design/file/${fileId}`
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url);
      console.log(url, '->', res.status, res.headers.get('content-type'), res.headers.get('content-length'));
      if (res.status === 200) {
        const text = await res.text();
        console.log('Sample:', text.slice(0, 200));
      }
    } catch (e) {
      console.log(url, 'error:', e.message);
    }
  }
}
run();
