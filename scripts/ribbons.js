document.addEventListener('DOMContentLoaded', () => {
  const ribbons = document.querySelectorAll('.ribbon-wrap');

  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / innerWidth - 0.5) * 2;
    const y = (e.clientY / innerHeight - 0.5) * 2;

    ribbons.forEach((ribbon) => {
      const depth = Number(ribbon.dataset.depth);

      const moveX = x * depth;
      const moveY = y * depth * 0.5;

      const rotateZ = Number(ribbon.dataset.rotate);

      ribbon.style.transform = `
        translateX(${moveX}px)
        translateY(${moveY}px)
        translateZ(${depth * 4}px)
        rotateZ(${rotateZ}deg)
        rotateY(${x * 10}deg)
        rotateX(${-y * 5}deg)
        `;
    });
  });
});
