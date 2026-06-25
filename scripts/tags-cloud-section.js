document.addEventListener('DOMContentLoaded', () => {
  const CONFIG = {
    repelRadius: 130,
    repelForce: 0.65,
    friction: 0.88,
    minSpeed: 0.18,
    jitter: 0.09,
  };

  const section = document.getElementById('flying-tags-section');

  let W = section.offsetWidth;
  let H = section.offsetHeight;

  const mouse = { x: -9999, y: -9999 };

  /* Берём уже существующие DOM-плашки */
  const cards = Array.from(section.querySelectorAll('.tag')).map((el) => {
    const rect = el.getBoundingClientRect();

    return {
      el,
      w: rect.width,
      h: rect.height,
      x: Math.random() * (W - rect.width) + rect.width / 2,
      y: Math.random() * (H - rect.height) + rect.height / 2,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
    };
  });

  /* Главный цикл */
  function tick() {
    const { repelRadius, repelForce, friction, minSpeed, jitter } = CONFIG;

    for (const c of cards) {
      /* Отталкивание от курсора */
      const dx = c.x - mouse.x;
      const dy = c.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < repelRadius && dist > 0) {
        const force = ((repelRadius - dist) / repelRadius) * repelForce;
        c.vx += (dx / dist) * force;
        c.vy += (dy / dist) * force;
      }

      /* Трение + случайный дрейф */
      c.vx = (c.vx + (Math.random() - 0.5) * jitter) * friction;
      c.vy = (c.vy + (Math.random() - 0.5) * jitter) * friction;

      /* Минимальная скорость */
      const speed = Math.hypot(c.vx, c.vy);
      if (speed > 0 && speed < minSpeed) {
        c.vx = (c.vx / speed) * minSpeed;
        c.vy = (c.vy / speed) * minSpeed;
      }

      c.x += c.vx;
      c.y += c.vy;

      /* Отскок от стенок */
      const hw = c.w / 2,
        hh = c.h / 2;
      if (c.x - hw < 0) {
        c.x = hw;
        c.vx = Math.abs(c.vx) * 0.6;
      }
      if (c.x + hw > W) {
        c.x = W - hw;
        c.vx = -Math.abs(c.vx) * 0.6;
      }
      if (c.y - hh < 0) {
        c.y = hh;
        c.vy = Math.abs(c.vy) * 0.6;
      }
      if (c.y + hh > H) {
        c.y = H - hh;
        c.vy = -Math.abs(c.vy) * 0.6;
      }

      /* Позиционируем элемент:
       transform не вызывает reflow — это самый быстрый способ двигать DOM */
      c.el.style.transform = `translate(${c.x - hw}px, ${c.y - hh}px)`;
    }

    requestAnimationFrame(tick);
  }

  /* Ресайз */
  function onResize() {
    W = section.offsetWidth;
    H = section.offsetHeight;
  }

  /* Мышь / тач */
  section.addEventListener('mousemove', (e) => {
    const r = section.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  section.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });
  section.addEventListener(
    'touchmove',
    (e) => {
      e.preventDefault();
      const r = section.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - r.left;
      mouse.y = e.touches[0].clientY - r.top;
    },
    { passive: false }
  );
  section.addEventListener('touchend', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });
  window.addEventListener('resize', onResize);

  tick();
});
