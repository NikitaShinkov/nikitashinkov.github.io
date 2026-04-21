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
  transform: 'translate3d(0,-110%,0)',
  transition: 'none',
  willChange: 'transform',
  pointerEvents: 'auto'
});

document.body.appendChild(floatingHeader);

// ======================
// CONFIG
// ======================
const SHOW_AFTER_HEIGHTS = 4;
const SHOW_TRIGGER = 20;
const ANIMATION_SPEED = 0.25;
const EASING = 'ease-out';
const EXTRA_HIDE_OFFSET = 4;

const TEXT_COLLAPSE_HEIGHTS = 2;

const TEXT_ZONE_BUFFER = 60; // 🔥 стабилизация зоны (ВАЖНО)
const TEXT_DEBOUNCE = 90;    // 🔥 защита от дёрганья

// ======================
// STATE
// ======================
let headerHeight = 0;

let hiddenOffset = 0;
let upScrollAccumulated = 0;
let isVisible = false;

let textCollapsed = false;
let lastTextAction = 0;

// ======================
// ELEMENTS
// ======================
const textBlocks = document.querySelectorAll('.hide_text_on_scroll');

const headerBlocks = document.querySelectorAll('.profile_main');
const contactsBlocks = document.querySelectorAll('.profile_text_contacts');
const rowMainBlocks = document.querySelectorAll('.profile_row_main');

// ======================
// HEADER HELPERS
// ======================
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

function syncOffsets() {
  const s = getComputedStyle(body);

  floatingHeader.style.top =
    (parseFloat(s.paddingTop) || 0) +
    (parseFloat(s.marginTop) || 0) + 'px';

  floatingHeader.style.left =
    (parseFloat(s.paddingLeft) || 0) +
    (parseFloat(s.marginLeft) || 0) + 'px';

  floatingHeader.style.right =
    (parseFloat(s.paddingRight) || 0) +
    (parseFloat(s.marginRight) || 0) + 'px';
}

function hideInstant() {
  hiddenOffset = maxOffset();
  floatingHeader.style.transition = 'none';
  applyTransform();
  isVisible = false;
}

// ======================
// TEXT + HEADER ANIMATION
// ======================
function collapseText() {
  const now = performance.now();
  if (textCollapsed || now - lastTextAction < TEXT_DEBOUNCE) return;
  lastTextAction = now;

  textCollapsed = true;

  textBlocks.forEach(el => {
    if (el.style.display === 'none') return;

    el.classList.add('collapsed');

    const onEnd = (e) => {
      if (e.propertyName !== 'grid-template-rows') return;

      if (textCollapsed) {
        el.style.display = 'none';
      }

      el.removeEventListener('transitionend', onEnd);
    };

    el.addEventListener('transitionend', onEnd);
  });

  headerBlocks.forEach(el => {
    el.style.transition = `padding ${ANIMATION_SPEED}s ${EASING}`;
    el.style.padding = '6px 0';
  });

  contactsBlocks.forEach(el => {
    el.style.transition = `gap ${ANIMATION_SPEED}s ${EASING}`;
    el.style.gap = '6px';
  });

  rowMainBlocks.forEach(el => {
    el.style.transition = `align-items ${ANIMATION_SPEED}s ${EASING}`;
    el.style.alignItems = 'center';
  });
}

function expandText() {
  const now = performance.now();
  if (!textCollapsed || now - lastTextAction < TEXT_DEBOUNCE) return;
  lastTextAction = now;

  textCollapsed = false;

  textBlocks.forEach(el => {
    if (el.style.display !== 'none') return;

    el.style.display = 'grid';

    requestAnimationFrame(() => {
      el.classList.remove('collapsed');
    });
  });

  headerBlocks.forEach(el => {
    el.style.transition = `padding ${ANIMATION_SPEED}s ${EASING}`;
    el.style.padding = '16px 0 12px';
  });

  contactsBlocks.forEach(el => {
    el.style.transition = `gap ${ANIMATION_SPEED}s ${EASING}`;
    el.style.gap = '10px';
  });

  rowMainBlocks.forEach(el => {
    el.style.alignItems = 'flex-start';
  });
}

// ======================
// MAIN LOOP
// ======================
function update() {
  const y = window.pageYOffset;
  const delta = y - lastScroll;

  updateHeaderHeight();

  const max = maxOffset();
  const showLimit = SHOW_AFTER_HEIGHTS * headerHeight;
  const textZone = headerHeight * TEXT_COLLAPSE_HEIGHTS;

  // ======================
  // TOP RESET
  // ======================
  if (y <= 0) {
    hiddenOffset = 0;
    upScrollAccumulated = 0;
    isVisible = false;

    floatingHeader.style.transition = 'none';
    floatingHeader.style.transform = 'translate3d(0,-110%,0)';

    expandText();

    lastScroll = y;
    return;
  }

  // ======================
  // HEADER
  // ======================
  if (delta > 0) {
    upScrollAccumulated = 0;

    hiddenOffset = Math.min(hiddenOffset + delta, max);
    applyTransform();

    isVisible = hiddenOffset < max;

  } else if (delta < 0) {

    if (hiddenOffset > 0) {
      hiddenOffset = Math.max(0, hiddenOffset + delta);
      applyTransform();
    }

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

  // ======================
  // TEXT ZONE LOGIC (FIXED)
  // ======================
  const inTextZone = Math.abs(y - textZone) < TEXT_ZONE_BUFFER;

  if (!inTextZone) {
    if (y < textZone) {
      if (delta > 0) collapseText();
      else if (delta < 0) expandText();
    } else {
      collapseText();
    }
  }

  lastScroll = y;
}

// ======================
// RAF SCROLL
// ======================
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      update();
    });
  }
}, { passive: true });

// ======================
// INIT
// ======================
function init() {
  updateHeaderHeight();
  syncOffsets();
  hideInstant();

  lastScroll = window.pageYOffset;
  update();
}

document.addEventListener('DOMContentLoaded', init);
window.addEventListener('load', init);

window.addEventListener('resize', () => {
  updateHeaderHeight();
  syncOffsets();
  update();
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