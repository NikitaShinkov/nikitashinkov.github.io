let lastScroll = window.pageYOffset;
const header = document.querySelector('.profile, .profile_main');

const SHOW_TRIGGER = 20; // сколько px вверх нужно проскроллить для показа

let headerHeight = header.offsetHeight;
let hiddenOffset = 0;
let upScrollAccumulated = 0; // накопленный скролл вверх

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  const delta = currentScroll - lastScroll;

  // в самом верху страницы
  if (currentScroll <= 0) {
    hiddenOffset = 0;
    upScrollAccumulated = 0;
    header.style.transition = 'transform 0.2s ease';
    header.style.transform = 'translateY(0)';
    lastScroll = currentScroll;
    return;
  }

  // ======================
  // Скролл вниз
  // ======================
  if (delta > 0) {
    upScrollAccumulated = 0;

    hiddenOffset += delta;

    if (hiddenOffset > headerHeight) {
      hiddenOffset = headerHeight;
    }

    header.style.transition = 'none';
    header.style.transform = `translateY(-${hiddenOffset}px)`;
  }

  // ======================
  // Скролл вверх
  // ======================
  else if (delta < 0) {

    // если шапка скрыта частично — возвращаем по пикселям
    if (hiddenOffset > 0 && hiddenOffset < headerHeight) {
      hiddenOffset += delta; // delta отрицательный

      if (hiddenOffset < 0) hiddenOffset = 0;

      header.style.transition = 'none';
      header.style.transform = `translateY(-${hiddenOffset}px)`;
    }

    // если скрыта полностью — ждём порог
    else if (hiddenOffset >= headerHeight) {
      upScrollAccumulated += Math.abs(delta);

      if (upScrollAccumulated >= SHOW_TRIGGER) {
        hiddenOffset = 0;
        upScrollAccumulated = 0;

        header.style.transition = 'transform 0.35s ease';
        header.style.transform = 'translateY(0)';
      }
    }
  }

  lastScroll = currentScroll;
});

function adjustMainMargin() {
  const header = document.querySelector('.profile, .profile_main');
  const main = document.querySelector('main');

  if (header && main) {
    headerHeight = header.offsetHeight;
    main.style.marginTop = headerHeight + 'px';
  }
}

// загрузка
document.addEventListener('DOMContentLoaded', adjustMainMargin);

// после полной загрузки страницы (шрифты, картинки и т.д.)
window.addEventListener('load', adjustMainMargin);

// ресайз
window.addEventListener('resize', adjustMainMargin);



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
  if (!imgElement) return;
  let currentIndex = 0;

  setInterval(() => {
    // Выбираем следующую картинку циклично
    currentIndex = (currentIndex + 1) % slider.images.length;
    imgElement.src = slider.images[currentIndex];
  }, slider.displayDuration);
});


// переходы на страницы проектов
const links = [
  { selector: '.link_digest', url: 'digest.html' },
  { selector: '.link_airport', url: 'airport.html' },
  { selector: '.link_siedle', url: 'siedle.html' },
  { selector: '.link_smarthome', url: 'smarthome.html' },
  { selector: '.link_wedding', url: 'wedding.html' },
  { selector: '.link_restaurant', url: 'restaurant.html' },
  { selector: '.link_smartservice', url: 'smartservice.html' },
];

links.forEach(link => {
  const element = document.querySelector(link.selector);
  if (!element) return;

  element.addEventListener('click', () => {
    window.location.href = link.url;
  });
});