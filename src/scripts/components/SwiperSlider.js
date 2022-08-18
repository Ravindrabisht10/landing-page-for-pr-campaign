// @TODO: Make this work properly with data-options
 // import Swiper JS
 import Swiper, { Mousewheel } from 'swiper';

// core version + navigation, pagination modules:
import SwiperCore, { Navigation, Pagination, Scrollbar } from 'swiper/core';

// configure Swiper to use modules
SwiperCore.use([Navigation, Pagination, Scrollbar, Mousewheel]);

const dom = {
  select: '[data-swiper-slider]',
};

const initSwiper = (slider) => {

  const { swiperDestroy, slidesPerView, slidesPerViewTablet, slidesPerViewMobile, slidesGroup, slidesSpeed, slidesSpeedMobile, slidesLoop } = slider.dataset;
  const newSlider = new Swiper(slider, {
    // Optional parameters
    speed: parseInt(slidesSpeed) || 300,
    loop: slidesLoop == 'true' ? true : false,
    spaceBetween: 16,
    slidesPerView: slidesPerViewMobile || 1,
    breakpoints: {
      320: {
        allowTouchMove: true,
        speed: parseInt(slidesSpeedMobile) || 300,
        slidesPerGroup: slidesGroup == 'true' ? slidesPerViewMobile : 1,
        slidesPerView: 1
      },
      // when window width is >= 750px
      750: {
        allowTouchMove: true,
        speed: parseInt(slidesSpeed) || 300,
        slidesPerView: slidesPerViewTablet,
        slidesPerGroup: slidesGroup == 'true' ? slidesPerViewTablet : 1,
      },
      1038: {
        allowTouchMove: false,
        freeModeMinimumVelocity: 0.4,
        preventClicks: false,
        slidesPerView: slidesPerView,
        slidesPerGroup: slidesGroup == 'true' ? slidesPerView : 1,
      }
    },
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction'
    },

    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    // And if we need scrollbar
    scrollbar: {
      el: '.swiper-scrollbar',
      draggable: true,
    },

    mousewheel: {
      forceToAxis: true
    },
  });

  return newSlider;
}

const setupSwiper = (slider) => {
  const { swiperDestroy } = slider.dataset;

  let swiperInstance = null;
  if (typeof swiperDestroy === 'undefined' || (swiperDestroy === 'mobile-down' && window.innerWidth >= 750) || (swiperDestroy === 'mobile-up' && window.innerWidth < 750)) {
    swiperInstance = initSwiper(slider)
    window.addEventListener('resize', () => {
      if (swiperDestroy == 'mobile-down' && window.innerWidth < 750 && typeof swiperInstance !== 'undefined') {
        swiperInstance.destroy()
      } else {
        if (typeof swiperInstance === 'undefined' || swiperInstance === null || swiperInstance.destroyed) {
          swiperInstance = initSwiper(slider)
        }
      }

      // setTimeout(() => {
      //   window.resetAllCarousels()
      // }, 500)
    });
  }
}

window.resetAllCarousels = () => {
  const swiperSliders = document.querySelectorAll(dom.select);
  swiperSliders.forEach((slider) => setupSwiper(slider));
}

const setup = () => {
  const swiperSliders = document.querySelectorAll(dom.select);
  swiperSliders.forEach((slider) => setupSwiper(slider))
};

export default {
  setup,
};
