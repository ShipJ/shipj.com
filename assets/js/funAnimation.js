export function funAnimation() {
    const canvas = document.getElementById('funAnimation');
    if (!canvas) return;
  
    const ctx = canvas.getContext('2d');
    const w = 16, h = 16;
    let t = 0;
  
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const value = Math.sin(t + x * x + y * y); 
          const size = Math.max(1, value * 4);
          ctx.beginPath();
          ctx.arc(x * 6 + 3, y * 6 + 3, size, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
      t += 0.05;
      requestAnimationFrame(draw);
    }
  
    draw();
  }