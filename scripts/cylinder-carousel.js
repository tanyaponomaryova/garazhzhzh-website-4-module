document.addEventListener('DOMContentLoaded', () => {
  // ─── НАСТРОЙКИ ──────────────────────────────────────────────────────────

  // Радиус воображаемого цилиндра в пикселях.
  // Чем больше — тем дальше плашки расходятся вверх и вниз.
  const scene = document.querySelector('.scene');
  // Собираем все плашки из HTML
  const slabElements = Array.from(document.querySelectorAll('.slab'));
  const totalSlabs = slabElements.length;

  let CYLINDER_RADIUS = scene.clientWidth * 0.1;
  slabElements.forEach((slab) => {
    slab.style.height = scene.clientWidth * 0.1 + 'px';
    slab.style.fontSize = scene.clientWidth * 0.14 + 'px';
  });

  // АДАПТИВНОСТЬ
  if (window.innerWidth < 768) {
    scene.style.height = '60vh';
    CYLINDER_RADIUS = scene.clientWidth * 0.25;
    slabElements.forEach((slab) => {
      slab.style.height = scene.clientWidth * 0.13 + 'px';
      slab.style.fontSize = scene.clientWidth * 0.18 + 'px';
    });
  }

  // При каждой резайзе заново персчитываем все размеры
  window.addEventListener('resize', () => {
    CYLINDER_RADIUS = scene.clientWidth * 0.1;
    slabElements.forEach((slab) => {
      slab.style.height = scene.clientWidth * 0.1 + 'px';
      slab.style.fontSize = scene.clientWidth * 0.14 + 'px';
    });

    // АДАПТИВНОСТЬ
    if (window.innerWidth < 768) {
      scene.style.height = '60vh';
      CYLINDER_RADIUS = scene.clientWidth * 0.25;
      slabElements.forEach((slab) => {
        slab.style.height = scene.clientWidth * 0.13 + 'px';
        slab.style.fontSize = scene.clientWidth * 0.18 + 'px';
      });
    }
  });

  // Максимальная скорость вращения в радианах в секунду.
  // Достигается когда курсор у правого края экрана.
  // У левого края скорость будет -MAX_SPEED (обратное вращение).
  // 2 * Math.PI ≈ 6.28 = один полный оборот за секунду.
  const MAX_SPEED = 1.5;

  // Мёртвая зона в центре экрана — задаётся как доля от ширины экрана (0..1).
  // В этой зоне карусель стоит на месте.
  // 0.1 = центральные 10% ширины экрана = зона покоя.
  const DEAD_ZONE = 0.01;

  // Насколько сильно плашки уменьшаются когда уходят за цилиндр.
  // 1.0 — нет уменьшения, 0.5 — дальние плашки в два раза меньше.
  const MIN_SCALE = 0.3;

  // ────────────────────────────────────────────────────────────────────────

  // Текущий угол вращения цилиндра (в радианах).
  // Увеличивается каждый кадр — именно это и крутит карусель.
  let currentAngle = 0;

  // Время предыдущего кадра — нужно чтобы скорость не зависела от FPS.
  let previousFrameTime = null;

  // Текущая скорость вращения — обновляется при движении мыши.
  // Положительная = вращение вперёд, отрицательная = назад.
  let currentSpeed = 0;

  // Слушаем движение мыши по всему окну
  window.addEventListener('mousemove', (event) => {
    // Позиция курсора от 0.0 (левый край) до 1.0 (правый край)
    const cursorPosition = event.clientX / window.innerWidth;

    // Переводим в диапазон от -1.0 до +1.0
    // где -1 = крайний левый, 0 = центр, +1 = крайний правый
    const normalizedPosition = cursorPosition * 2 - 1;

    // Половина мёртвой зоны в каждую сторону от центра
    const halfDeadZone = DEAD_ZONE / 2;

    if (Math.abs(normalizedPosition) < halfDeadZone) {
      // Курсор в мёртвой зоне — карусель останавливается
      currentSpeed = 0;
    } else {
      // Определяем направление: +1 если курсор правее центра, -1 если левее
      const direction = normalizedPosition > 0 ? 1 : -1;

      // Убираем мёртвую зону из расчёта чтобы скорость нарастала плавно
      // от 0 на границе мёртвой зоны до MAX_SPEED у края экрана.
      // (Math.abs - берём абсолютное значение, то есть без знака минус)
      const positionBeyondDeadZone =
        (Math.abs(normalizedPosition) - halfDeadZone) / (1 - halfDeadZone);

      currentSpeed = direction * positionBeyondDeadZone * MAX_SPEED;
    }
  });

  function animate(currentTime) {
    // Считаем сколько секунд прошло с прошлого кадра
    const deltaSeconds = previousFrameTime
      ? (currentTime - previousFrameTime) / 1000
      : 0;
    previousFrameTime = currentTime;

    // Продвигаем угол вращения на величину текущей скорости
    currentAngle += currentSpeed * deltaSeconds;

    // Для правильного перекрытия нужно знать z каждой плашки
    // (кто спереди, кто сзади), поэтому собираем данные перед рендером
    const slabData = slabElements.map((element, index) => {
      // Угол этой конкретной плашки на цилиндре.
      // Плашки равномерно распределены: каждая смещена на (1/N) часть окружности.
      const angle = currentAngle + (index / totalSlabs) * Math.PI * 2;

      // sin(angle) даёт значение от -1 до +1 — это вертикальное смещение.
      // Умножаем на радиус чтобы перевести в пиксели.
      const yPosition = CYLINDER_RADIUS * Math.sin(angle);

      // cos(angle) даёт значение от -1 до +1 — это "глубина".
      // +1 = плашка спереди, -1 = плашка сзади.
      const depth = Math.cos(angle);

      // Масштаб: когда плашка спереди (depth=+1) — scale=1 (полный размер),
      // когда сзади (depth=-1) — scale=MIN_SCALE (уменьшенная).
      // Формула переводит диапазон [-1..+1] в [MIN_SCALE..1].
      const scale = MIN_SCALE + ((1 - MIN_SCALE) * (depth + 1)) / 2;

      return { element, yPosition, depth, scale };
    });

    // Сортируем по глубине чтобы назначить z-index:
    // самые задние получают маленький z-index, передние — большой.
    // Так передние плашки перекрывают задние.
    const sortedByDepth = [...slabData].sort((a, b) => a.depth - b.depth);
    sortedByDepth.forEach((slab, rank) => {
      slab.zIndex = rank;
    });

    // Применяем все вычисленные значения к DOM-элементам
    slabData.forEach((slab) => {
      slab.element.style.transform = `translateY(${slab.yPosition.toFixed(2)}px) scale(${slab.scale.toFixed(4)})`;
      slab.element.style.zIndex = slab.zIndex;
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
});
