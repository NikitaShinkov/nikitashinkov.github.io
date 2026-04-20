let lastScroll = window.pageYOffset;

const staticHeader = document.querySelector('header');
const body = document.body;

// ======================
// СОЗДАЁМ ДУБЛИКАТ
// ======================
const floatingHeader = staticHeader.cloneNode(true);

// важно: убираем повторяющиеся id внутри клона
floatingHeader.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));

floatingHeader.style.position = 'fixed';
floatingHeader.style.zIndex = '9999';
floatingHeader.style.transition = 'none';
floatingHeader.style.transform = 'translateY(-100%)';
floatingHeader.style.pointerEvents = 'auto'; // теперь кликабельно

/* отладка */
// floatingHeader.style.background = 'rgba(255, 0, 0, 0.5)'; // красный 50%
// floatingHeader.style.opacity = '1';
// floatingHeader.querySelectorAll('*').forEach(el => {
//   el.style.backgroundColor = 'transparent';
// });
/* конец отладки */

document.body.appendChild(floatingHeader);

// ======================
const SHOW_AFTER_HEIGHTS = 4;
const SHOW_TRIGGER = 20;

const ANIMATION_SPEED = 0.25;
const EASING = 'ease-out';

// запас чтобы тень не торчала
const EXTRA_HIDE_OFFSET = 4;

// ======================
let headerHeight = staticHeader.getBoundingClientRect().height;

let hiddenOffset = 0;
let upScrollAccumulated = 0;
let isVisible = false;
let isDragging = false;

// ======================
// КОПИРУЕМ ОТСТУПЫ BODY
// ======================
function syncFloatingHeaderOffsets() {
  const bodyStyle = getComputedStyle(body);

  const padTop = parseFloat(bodyStyle.paddingTop) || 0;
  const padLeft = parseFloat(bodyStyle.paddingLeft) || 0;
  const padRight = parseFloat(bodyStyle.paddingRight) || 0;

  const marTop = parseFloat(bodyStyle.marginTop) || 0;
  const marLeft = parseFloat(bodyStyle.marginLeft) || 0;
  const marRight = parseFloat(bodyStyle.marginRight) || 0;

  floatingHeader.style.top = `${padTop + marTop}px`;
  floatingHeader.style.left = `${padLeft + marLeft}px`;
  floatingHeader.style.right = `${padRight + marRight}px`;
}

// ======================
function updateHeaderHeight() {
  headerHeight = staticHeader.getBoundingClientRect().height;
}

// ======================
function hideHeaderInstant() {
  floatingHeader.style.transition = 'none';
  floatingHeader.style.transform =
    `translateY(-${headerHeight + EXTRA_HIDE_OFFSET}px)`;
}

// ======================
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  const delta = currentScroll - lastScroll;

  const showLimit = SHOW_AFTER_HEIGHTS * headerHeight;

  // ======================
  // ВВЕРХУ СТРАНИЦЫ
  // ======================
  if (currentScroll <= 0) {
    hiddenOffset = 0;
    upScrollAccumulated = 0;
    isVisible = false;

    hideHeaderInstant();

    lastScroll = currentScroll;
    return;
  }

  // ======================
  // СКРОЛЛ ВНИЗ
  // ======================
  if (delta > 0) {
    upScrollAccumulated = 0;

    const maxOffset = headerHeight + EXTRA_HIDE_OFFSET;

    // если дубликат уже открыт или частично открыт — просто двигаем вверх
    if (hiddenOffset < maxOffset) {
      isDragging = true;

      hiddenOffset += delta;

      if (hiddenOffset > maxOffset) {
        hiddenOffset = maxOffset;
        isVisible = false;
        isDragging = false;
      }

      floatingHeader.style.transition = 'none';
      floatingHeader.style.transform =
        `translateY(-${hiddenOffset}px)`;
    }

    lastScroll = currentScroll;
    return;
  }

  // ======================
  // СКРОЛЛ ВВЕРХ
  // ======================
  else if (delta < 0) {
    const maxOffset = headerHeight + EXTRA_HIDE_OFFSET;

    // если мы частично скрываем header (он "едет") — продолжаем движение вниз
    if (hiddenOffset > 0 && hiddenOffset < maxOffset) {
      isDragging = true;

      hiddenOffset += delta; // delta отрицательный → вниз

      if (hiddenOffset < 0) {
        hiddenOffset = 0;
      }

      floatingHeader.style.transition = 'none';
      floatingHeader.style.transform =
        `translateY(-${hiddenOffset}px)`;

      lastScroll = currentScroll;
      return;
    }

    // обычное появление
    if (currentScroll > showLimit) {
      upScrollAccumulated += Math.abs(delta);

      if (!isVisible && upScrollAccumulated >= SHOW_TRIGGER) {
        isVisible = true;
        hiddenOffset = 0;

        floatingHeader.style.transition =
          `transform ${ANIMATION_SPEED}s ${EASING}`;

        floatingHeader.style.transform = 'translateY(0)';
      }
    }

    lastScroll = currentScroll;
  }

  lastScroll = currentScroll;
});

// ======================
// ИНИЦИАЛИЗАЦИЯ
// ======================
document.addEventListener('DOMContentLoaded', () => {
  updateHeaderHeight();
  syncFloatingHeaderOffsets();
  hideHeaderInstant();
});

window.addEventListener('load', () => {
  updateHeaderHeight();
  syncFloatingHeaderOffsets();
});

window.addEventListener('resize', () => {
  updateHeaderHeight();
  syncFloatingHeaderOffsets();
});


// ======================
// СХЛОПЫВАНИЕ ТЕКСТА В HEADER
// ======================

const TEXT_COLLAPSE_DISTANCE = 120;

const textBlocks = document.querySelectorAll('.hide_text_on_scroll');

function updateHeaderTextCollapse() {
  const y = window.pageYOffset;

  const progress = Math.min(y / TEXT_COLLAPSE_DISTANCE, 1);

  textBlocks.forEach(el => {
    const fullHeight = el.scrollHeight;

    if (progress >= 1) {
      el.classList.add('collapsed');
      el.style.maxHeight = '0px';
      el.style.opacity = '0';
    } else {
      el.classList.remove('collapsed');
      el.style.maxHeight = `${fullHeight * (1 - progress)}px`;
      el.style.opacity = `${1 - progress}`;
    }
  });

  updateHeaderHeight();

  const maxOffset = headerHeight + EXTRA_HIDE_OFFSET;

  if (hiddenOffset > maxOffset) {
    hiddenOffset = maxOffset;
  }

  if (!isVisible) {
    floatingHeader.style.transform =
      `translateY(-${hiddenOffset}px)`;
  }

  syncFloatingHeaderOffsets();
}


window.addEventListener('scroll', updateHeaderTextCollapse, { passive: true });
window.addEventListener('load', updateHeaderTextCollapse);
window.addEventListener('resize', updateHeaderTextCollapse);


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