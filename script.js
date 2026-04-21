let lastScroll = window.pageYOffset;

const staticHeader = document.querySelector('header');
const body = document.body;

// ======================
// CLONE HEADER
// ======================
const floatingHeader = staticHeader.cloneNode(true);

floatingHeader.querySelectorAll('[id]').forEach(el =>
  el.removeAttribute('id')
);

Object.assign(floatingHeader.style, {
  position: 'fixed',
  zIndex: '9999',
  left: '0',
  right: '0',
  top: '0',
  transform: 'translate3d(0,-100%,0)',
  transition: 'none',
  willChange: 'transform',
  pointerEvents: 'auto'
});

document.body.appendChild(floatingHeader);

// ======================
const SHOW_AFTER_HEIGHTS = 4;
const SHOW_TRIGGER = 20;
const ANIMATION_SPEED = 0.25;
const EASING = 'ease-out';
const EXTRA_HIDE_OFFSET = 4;

// ======================
let headerHeight = staticHeader.getBoundingClientRect().height;

let hiddenOffset = 0;
let upScrollAccumulated = 0;
let isVisible = false;

// ======================
function syncFloatingHeaderOffsets() {
  const s = getComputedStyle(body);

  floatingHeader.style.top =
    (parseFloat(s.paddingTop) || 0) + (parseFloat(s.marginTop) || 0) + 'px';

  floatingHeader.style.left =
    (parseFloat(s.paddingLeft) || 0) + (parseFloat(s.marginLeft) || 0) + 'px';

  floatingHeader.style.right =
    (parseFloat(s.paddingRight) || 0) + (parseFloat(s.marginRight) || 0) + 'px';
}

function updateHeaderHeight() {
  headerHeight = staticHeader.getBoundingClientRect().height;
}

function maxOffset() {
  return headerHeight + EXTRA_HIDE_OFFSET;
}

function applyTransform() {
  floatingHeader.style.transform =
    `translate3d(0,-${hiddenOffset}px,0)`;
}

function hideInstant() {
  hiddenOffset = maxOffset();
  floatingHeader.style.transition = 'none';
  applyTransform();
  isVisible = false;
}

// ======================
// MAIN SCROLL
// ======================
window.addEventListener('scroll', () => {
  const y = window.pageYOffset;
  const delta = y - lastScroll;

  const showLimit = SHOW_AFTER_HEIGHTS * headerHeight;

  // ======================
  // TOP RESET
  // ======================
  if (y <= 0) {
    hiddenOffset = 0;
    upScrollAccumulated = 0;
    isVisible = false;

    floatingHeader.style.transition = 'none';
    floatingHeader.style.transform = 'translate3d(0,-100%,0)';

    lastScroll = y;
    return;
  }

  const max = maxOffset();

  // ======================
  // SCROLL DOWN → ALWAYS COLLAPSE
  // ======================
  if (delta > 0) {
    upScrollAccumulated = 0;

    // ключевое исправление:
    // ВСЕГДА увеличиваем hiddenOffset при scroll down
    hiddenOffset = Math.min(hiddenOffset + delta, max);

    floatingHeader.style.transition = 'none';
    applyTransform();

    if (hiddenOffset >= max) {
      isVisible = false;
    }

    lastScroll = y;
    return;
  }

  // ======================
  // SCROLL UP → REVEAL
  // ======================
  if (delta < 0) {

    // если header частично скрыт — продолжаем движение
    if (hiddenOffset > 0) {
      hiddenOffset = Math.max(0, hiddenOffset + delta);

      floatingHeader.style.transition = 'none';
      applyTransform();

      lastScroll = y;
      return;
    }

    // обычное появление
    if (y > showLimit) {
      upScrollAccumulated += Math.abs(delta);

      if (!isVisible && upScrollAccumulated >= SHOW_TRIGGER) {
        isVisible = true;
        hiddenOffset = 0;

        floatingHeader.style.transition =
          `transform ${ANIMATION_SPEED}s ${EASING}`;

        floatingHeader.style.transform = 'translate3d(0,0,0)';
      }
    }
  }

  lastScroll = y;
});

// ======================
// INIT
// ======================
function init() {
  updateHeaderHeight();
  syncFloatingHeaderOffsets();
  hideInstant();
  lastScroll = window.pageYOffset;
}

document.addEventListener('DOMContentLoaded', init);
window.addEventListener('load', init);

window.addEventListener('resize', () => {
  updateHeaderHeight();
  syncFloatingHeaderOffsets();
});

// ======================
// TEXT COLLAPSE SYSTEM
// ======================
const TEXT_COLLAPSE_HEIGHTS = 2;
const textBlocks = document.querySelectorAll('.hide_text_on_scroll');

let textCollapsed = false;
let lastScrollText = window.pageYOffset;

// ======================
// COLLAPSE
// ======================
function collapseHeaderText() {
  if (textCollapsed) return;
  textCollapsed = true;

  textBlocks.forEach(el => {
    el.classList.add('collapsed');
  });
}

// ======================
// EXPAND
// ======================
function expandHeaderText() {
  if (!textCollapsed) return;
  textCollapsed = false;

  textBlocks.forEach(el => {
    el.classList.remove('collapsed');
  });
}

// ======================
// SCROLL LOGIC (ZONE = 2 HEADER HEIGHTS)
// ======================
function handleTextScroll() {
  const y = window.pageYOffset;
  const delta = y - lastScrollText;

  const zone = headerHeight * TEXT_COLLAPSE_HEIGHTS;

  // TOP → always expanded
  if (y <= 0) {
    expandHeaderText();
    lastScrollText = y;
    return;
  }

  // INSIDE ZONE → reactive
  if (y < zone) {
    if (delta > 0) collapseHeaderText();
    else if (delta < 0) expandHeaderText();

    lastScrollText = y;
    return;
  }

  // BELOW ZONE → always collapsed
  collapseHeaderText();

  lastScrollText = y;
}

// ======================
// INIT HOOKS (ВСТАВЬ В ОБЩИЙ INIT)
// ======================
window.addEventListener('scroll', handleTextScroll, { passive: true });

window.addEventListener('load', handleTextScroll);

window.addEventListener('resize', () => {
  handleTextScroll();
});

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