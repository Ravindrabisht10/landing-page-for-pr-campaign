import lazyload from '../utils/lazyload.js';

const setupHerbsCarousel = () => {
  const sliderElements = document.querySelectorAll('[data-swiper-slider]') || [];
  sliderElements.forEach((sliderElement) => {
    const slider = sliderElement.swiper || false;
    slider && slider.slideNext(0);
    slider && slider.slidePrev(0);
  });
};

const setNewImage = (entry, observer, isIntersecting, extra) => {
  if(isIntersecting) {
    const content = document.querySelectorAll(`[data-highlight-content]`);
    const imageEl = document.querySelector(`[data-image-sources]`);
    const imgSource = entry.getAttribute('data-img-to-use') || false;
    imgSource && imageEl.setAttribute('src', imgSource);
  }
};

const setup = () => {
  lazyload.setupObservers({
    queryString: `[data-highlight-content]`,
    callback: setNewImage,
    threshold: 0.6,
    rootMargin: '0px',
  });

  setupHerbsCarousel();
};

export default {
  setup,
};