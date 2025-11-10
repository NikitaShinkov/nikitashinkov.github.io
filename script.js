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



// Массив с путями к изображениям
// const images_1 = [
//   "img/img_example_1_v.png",
//   "img/img_example_2_v.png",
//   "img/img_example_3_v.png"
// ];

// let currentIndex = 0;           // текущий индекс изображения
// const slider = document.getElementById("slider_1"); 

// // функция для смены изображения
// function changeImage() {
//   currentIndex++; 
//   if (currentIndex >= images_1.length) {
//     currentIndex = 0;           // возвращаемся к первому изображению
//   }
//   slider.src = images_1[currentIndex];
// }

// // меняем изображение каждые 500 мс
// setInterval(changeImage, 500);



// Настройки слайдеров. Добавить для нужной картинки id="slider1" (slider2, slider3 и т.д.)
const sliders = [
  {
    elementId: "slider1",
    images: ["img/img_example_2_v.png","img/img_example_3_v.png","img/img_example_4_v.png"],
    displayDuration: 1000
  },
  {
    elementId: "slider2",
    images: ["img/img_example_3_v.png","img/img_example_2_v.png","img/img_example_1_v.png"],
    displayDuration: 1500
  },
  {
    elementId: "slider3",
    images: ["img/img_example_4.png","img/img_example_3.png","img/img_example_2.png"],
    displayDuration: 2000
  }
];

// Создаём слайдеры
sliders.forEach(slider => {
  const imgElement = document.getElementById(slider.elementId);
  let currentIndex = 0;

  setInterval(() => {
    // Выбираем следующую картинку циклично
    currentIndex = (currentIndex + 1) % slider.images.length;
    imgElement.src = slider.images[currentIndex];
  }, slider.displayDuration);
});
