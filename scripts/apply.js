let bodies;
let tabs;

document.addEventListener('DOMContentLoaded', () => {
  tabs = document.querySelectorAll('.tab');
  bodies = document.querySelectorAll('.form-body');
  let currentTab = 'participant';

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      bodies.forEach((b) => b.classList.remove('active'));
      tab.classList.add('active');
      currentTab = tab.dataset.tab;
      document.getElementById('tab-' + currentTab).classList.add('active');
      document.getElementById('successState').classList.remove('visible');
    });
  });

  // добавляем каждой кнопке событие на клик
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      submitForm(type);
    });
  });

  // кнопка "ПОДАТЬ ЕЩЁ ОДНУ ЗАЯВКУ" -- очищает форму
  document.querySelectorAll('.reset-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      resetForm();
    });
  });
});

const labels = {
  participant: 'УЧАСТНИК',
  spectator: 'ЗРИТЕЛЬ',
  volunteer: 'ВОЛОНТЁР',
};

const subs = {
  participant:
    'Мы получили вашу заявку на участие и свяжемся с вами по email в течение 2–3 рабочих дней.  Следите за новостями BUG RUSH 2026!',
  spectator:
    'Ваш билет оформлен! Подтверждение и инструкции придут на указанную почту. <br>До встречи на трибунах!',
  volunteer:
    'Спасибо за желание помочь! Координатор свяжется с вами по электронной почте для уточнения деталей.',
};

const titles = {
  participant: 'Заявка принята!',
  spectator: 'Билет оформлен!',
  volunteer: 'Спасибо, волонтёр!',
};

function submitForm(type) {
  const agreeBox = document.getElementById(type + '-agree');
  console.log(agreeBox);
  // если чекбокс не отмечен
  if (!agreeBox.checked) {
    console.log('чекбокс не отмечен');

    agreeBox.closest('.checkbox-row').style.background = 'var(--pink)';
    agreeBox.closest('.checkbox-row').style.borderRadius = '4px';
    setTimeout(
      () => (agreeBox.closest('.checkbox-row').style.outline = ''),
      1500
    );
    return;
  }

  bodies.forEach((b) => b.classList.remove('active'));
  tabs.forEach((t) => (t.style.display = 'none'));
  const ss = document.getElementById('successState');
  document.getElementById('successTitle').textContent = titles[type];
  document.getElementById('successSub').textContent = subs[type];
  ss.classList.add('visible');
}

function resetForm() {
  document.getElementById('successState').classList.remove('visible');
  //   возвращаем вкладки обратно
  tabs.forEach((t) => (t.style.display = 'flex'));
  tabs.forEach((t) => t.classList.remove('active'));
  tabs[0].classList.add('active');
  bodies.forEach((b) => b.classList.remove('active'));
  currentTab = 'participant';
  document.getElementById('tab-participant').classList.add('active');
  document
    .querySelectorAll(
      'input[type=text], input[type=email], input[type=tel], input[type=number]'
    )
    .forEach((i) => (i.value = ''));
  document.querySelectorAll('select').forEach((s) => {
    s.value = '';
    s.classList.remove('filled');
  });
  document
    .querySelectorAll('input[type=checkbox]')
    .forEach((c) => (c.checked = false));
}
