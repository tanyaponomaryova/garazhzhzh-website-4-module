document.addEventListener('DOMContentLoaded', () => {
  const TILT = 60;
  const ROTATE_MAX = 30;

  // FALLOFF[0] = передняя, FALLOFF[3] = самая задняя
  const FALLOFF = [1, 0.55, 0.28, 0.1];

  function initShopHeader() {
    const header = document.getElementById('shop-header');
    const letterScenes = [...header.children];
    letterScenes.forEach((letterScene) => {
      const trigger = letterScene.querySelector('.letter-trigger');
      const stack = letterScene.querySelector('.letter-stack');
      attachStack(trigger, stack);
    });
  }

  //   вычисляет положение курсора относительно триггера
  function getCursorState(e, el) {
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const cx = r.width / 2;
    const nx = Math.max(-1, Math.min(1, (x - cx) / cx));
    const ny = Math.max(-1, Math.min(1, (y - 50) / 50));
    return {
      nx,
      ny,
      fromLeft: x < r.width * 0.35, // курсор в левой трети
      fromRight: x > r.width * 0.65, // курсор в правой трети
      fromTop: y < 30, // курсор у верхнего края
      fromBot: y > 90, // курсор у нижнего края
    };
  }

  function applyAll(glyphs, rx, ry, rz, speed) {
    // glyphs: [back-3, back-2, back-1, front]
    // front = index 3 → FALLOFF[0] = 1
    // back-3 = index 0 → FALLOFF[3] = 0.1
    glyphs.forEach((g, i) => {
      const f = FALLOFF[glyphs.length - 1 - i];
      g.style.transition = `transform ${speed}`;
      g.style.transform = `rotateX(${rx * f}deg) rotateY(${ry * f}deg) rotate(${rz * f}deg)`;
    });
  }

  function resetAll(glyphs, rx, ry, rz) {
    applyAll(glyphs, rx, ry, rz, '0.1s ease-out');
    setTimeout(() => {
      glyphs.forEach((g) => {
        g.style.transition = 'transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)';
        g.style.transform = 'rotateX(0deg) rotateY(0deg) rotate(0deg)';
      });
    }, 105);
  }

  function attachStack(trigger, stack) {
    // достаём каждый span с каждой отдельной буквой
    const glyphs = [...stack.querySelectorAll('.letter')];

    trigger.addEventListener('mouseenter', (e) => {
      // узнаём положение курсора
      const { nx, ny, fromLeft, fromRight, fromTop, fromBot } = getCursorState(
        e,
        trigger
      );

      let rx = 0,
        ry = 0;
      if (fromLeft) ry = -TILT;
      else if (fromRight) ry = TILT;
      if (fromTop) rx = TILT;
      else if (fromBot) rx = -TILT;
      if (!fromLeft && !fromRight && !fromTop && !fromBot) {
        ry = nx * TILT;
        rx = -(ny * TILT);
      }
      const rz = nx * ROTATE_MAX;
      applyAll(glyphs, rx, ry, rz, '0.13s ease-out');
      setTimeout(
        () =>
          applyAll(glyphs, 0, 0, 0, '0.7s cubic-bezier(0.25,0.46,0.45,0.94)'),
        140
      );
    });

    trigger.addEventListener('mousemove', (e) => {
      const { nx, ny } = getCursorState(e, trigger);
      applyAll(
        glyphs,
        -(ny * TILT * 0.5),
        nx * TILT * 0.5,
        nx * ROTATE_MAX,
        '0.06s linear'
      );
    });

    trigger.addEventListener('mouseleave', (e) => {
      const r = trigger.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      let rx = 0,
        ry = 0,
        rz = 0;
      if (x < 0) {
        ry = -TILT * 0.65;
        rz = -ROTATE_MAX * 0.65;
      }
      if (x > r.width) {
        ry = TILT * 0.65;
        rz = ROTATE_MAX * 0.65;
      }
      if (y < 0) rx = TILT * 0.65;
      if (y > r.height) rx = -TILT * 0.65;
      resetAll(glyphs, rx, ry, rz);
    });
  }

  initShopHeader();
});
