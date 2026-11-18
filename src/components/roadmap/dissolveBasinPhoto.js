const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const CELL = 5;
const TILE = CELL * 4;
let masks;

export default function dissolveBasinPhoto(media, image) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let frame, deadline;
  function finish() {
    cancelAnimationFrame(frame);
    clearTimeout(deadline);
    media.style.removeProperty('--cs5-mask');
  }
  function start() {
    if (!image.naturalWidth) return;
    if (!masks) {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = TILE;
      const context = canvas.getContext('2d');
      if (!context) return;
      masks = Array.from({ length: 16 }, (_, level) => {
        context.clearRect(0, 0, TILE, TILE);
        BAYER.forEach((threshold, i) => {
          if (threshold < level) context.fillRect((i % 4) * CELL, Math.floor(i / 4) * CELL, CELL, CELL);
        });
        return `url("${canvas.toDataURL()}")`;
      });
    }
    const began = performance.now();
    let previous = 0;
    media.style.setProperty('--cs5-mask', masks[0]);
    function tick(now) {
      const level = Math.max(0, Math.floor((now - began) * 16 / 1000));
      if (level >= 16) return finish();
      if (level !== previous) media.style.setProperty('--cs5-mask', masks[level]);
      previous = level;
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    deadline = setTimeout(finish, 1800);
  }
  if (image.complete) start();
  else image.addEventListener('load', start, { once: true });
  return () => { image.removeEventListener('load', start); finish(); };
}