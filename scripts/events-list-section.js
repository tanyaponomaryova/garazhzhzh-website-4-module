document.addEventListener('DOMContentLoaded', () => {
  let eventList = document.querySelector('#events-list-section');
  let events = eventList.querySelectorAll('.event');
  let preview = document.querySelector('.poster-preview');
  let previewImage = preview.querySelector('img');

  events.forEach((event) => {
    event.addEventListener('mouseenter', () => {
      previewImage.src = event.dataset.image;
      preview.classList.add('active');
    });

    event.addEventListener('mouseleave', () => {
      preview.classList.remove('active');
    });

    event.addEventListener('mousemove', (e) => {
      const offsetX = 30;
      const offsetY = 30;

      preview.style.left = e.clientX + offsetX + 'px';
      preview.style.top = e.clientY + offsetY + 'px';
    });
  });

  // ДЛЯ МОБИЛОК
  eventList = document.querySelector('#events-list-section-mobile');
  events = eventList.querySelectorAll('.event');

  events.forEach((event) => {
    event.addEventListener('click', () => {
      poster = event.querySelector('.mobile-poster');
      title = event.querySelector('.event-title');
      btn = event.querySelector('.register-btn-wrap');
      poster.classList.toggle('active');
      title.classList.toggle('active');
      btn.classList.toggle('active');
      event.classList.toggle('active');

      console.log('клик событие ' + title.innerHTML);
    });
  });
});
