document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('.parallax-hero-section');
  const layers = document.querySelectorAll('.layer');

  //   меняем размер букв в плашках в хиро
  layers.forEach((layer) => {
    const h = layer.clientHeight;
    // число -- высота строки
    layer.style.fontSize = h * 0.65 + 'px';

    // отдельно меняем размер букв маленькой надписи "2026"
    const p = layer.querySelector('p');
    if (p) {
      p.style.fontSize = h * 0.09 + 'px';
    }
  });

  //   если меняется размер окна, то опять подстраиваем размер букв под плашки хиро
  window.addEventListener('resize', () => {
    layers.forEach((layer) => {
      const h = layer.clientHeight;
      // число -- высота строки
      layer.style.fontSize = h * 0.65 + 'px';
    });
  });

  // Текущая цель курсора (относительно центра)
  let cx = 0,
    cy = 0;

  // Текущие позиции каждой плашки (с инерцией)
  const tx = Array(layers.length).fill(0);
  const ty = Array(layers.length).fill(0);

  section.addEventListener('mousemove', (e) => {
    const r = section.getBoundingClientRect();
    cx = e.clientX - r.left - r.width / 2;
    cy = e.clientY - r.top - r.height / 2;
  });

  function tick() {
    layers.forEach((layer, i) => {
      const factor = parseFloat(layer.dataset.factor);

      // Плавная интерполяция к цели (lerp)
      //   число -- насколько быстро меняется позиция
      tx[i] += (cx * factor - tx[i]) * 0.3;
      ty[i] += (cy * factor - ty[i]) * 0.3;

      layer.style.transform = `translate(${tx[i].toFixed(2)}px, ${ty[i].toFixed(2)}px) skewX(-10deg)`;
    });
    requestAnimationFrame(tick);
  }
  tick();
});
