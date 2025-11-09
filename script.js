let lastScroll = 0;
const header = document.querySelector('.profile');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll <= 0) {
    // в начале страницы показываем шапку
    header.style.transform = 'translateY(0)';
    return;
  }

  if (currentScroll > lastScroll) {
    // скролл вниз → скрываем шапку
    header.style.transform = 'translateY(-100%)';
  } else {
    // скролл вверх → показываем шапку
    header.style.transform = 'translateY(0)';
  }

  lastScroll = currentScroll;
});


const block = document.querySelector('.profile_info');
  block.addEventListener('click', () => {
    window.location.href = '/'; // переход на главную страницу
});



function adjustMainMargin() {
  const header = document.querySelector('.profile');
  const main = document.querySelector('main');

  if (header && main) {
    const headerHeight = header.offsetHeight; // получаем реальную высоту шапки
    main.style.marginTop = headerHeight + 'px'; // добавляем margin-top
  }
}

// вызываем при загрузке страницы
window.addEventListener('load', adjustMainMargin);

// вызываем при изменении размера окна, если шапка адаптивная
window.addEventListener('resize', adjustMainMargin)

