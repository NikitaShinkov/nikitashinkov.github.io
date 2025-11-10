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


function adjustMainMargin() {
  const header = document.querySelector('.profile');
  const main = document.querySelector('main');

  if (header && main) {
    const headerHeight = header.offsetHeight; // получаем реальную высоту шапки
    main.style.marginTop = headerHeight + 'px'; // добавляем margin-top
  }
  console.log("добавление margin");
  
}

// вызываем при загрузке страницы
window.addEventListener('load', adjustMainMargin);

// вызываем при изменении размера окна, если шапка адаптивная
window.addEventListener('resize', adjustMainMargin)



// Настройки слайдеров. Добавить для нужной картинки id="slider1" (slider2, slider3 и т.д.)
const sliders = [
  {
    elementId: "slider1",
    images: ["img/digest_4_1.png","img/digest_4_2.png","img/digest_4_3.png"],
    displayDuration: 1500
  },
  {
    elementId: "slider2",
    images: ["img/digest_5_1.png","img/digest_5_2.png","img/digest_5_3.png"],
    displayDuration: 1500
  },
  {
    elementId: "slider3",
    images: ["img/siedle_cover_1.png","img/siedle_cover_2.png","img/siedle_cover_3.png","img/siedle_cover_4.png","img/siedle_cover_5.png","img/siedle_cover_6.png","img/siedle_cover_7.png","img/siedle_cover_8.png","img/siedle_cover_9.png","img/siedle_cover_10.png","img/siedle_cover_11.png","img/siedle_cover_12.png"],
    displayDuration: 200
  },
  {
    elementId: "slider4",
    images: ["img/siedle_1_1.png","img/siedle_1_2.png","img/siedle_1_3.png","img/siedle_1_4.png","img/siedle_1_5.png","img/siedle_1_6.png","img/siedle_1_7.png","img/siedle_1_8.png"],
    displayDuration: 1000
  },
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


document.querySelector('.profile_info').addEventListener('click', () => {
    window.location.href = 'index.html'; // переход на главную страницу
});

// переходы на страницы проектов
document.querySelector('.link_digest').addEventListener('click', () => {
    window.location.href = 'digest.html'; 
});
document.querySelector('.link_airport').addEventListener('click', () => {
    window.location.href = 'airport.html'; 
});
document.querySelector('.link_siedle').addEventListener('click', () => {
    window.location.href = 'siedle.html'; 
});
document.querySelector('.link_smarthome').addEventListener('click', () => {
    window.location.href = 'smarthome.html'; 
});