// @TODO: Make this work properly with data-options
 // import Swiper JS
 import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.esm.browser.min.js';

// // core version + navigation, pagination modules:
// import SwiperCore, { Navigation, Pagination, Scrollbar } from 'swiper/core';

// // configure Swiper to use modules
// SwiperCore.use([Navigation, Pagination, Scrollbar, Mousewheel]);

const dom = {
  select: '[data-swiper-slider]',
};

const initSwiper = (slider) => {

  const { swiperDestroy, slidesPerView, slidesPerViewTablet, slidesPerViewMobile, slidesGroup, slidesSpeed, slidesSpeedMobile, slidesLoop, sliderThumbs, allowTouchMove, paginationType , initialSlide, centeredSlides, arrows, paginationText} = slider.dataset;
  const pagination = slider.querySelector('.swiper-pagination');
  let nextBtn = slider.querySelector('.swiper-button-next');
  let prevBtn = slider.querySelector('.swiper-button-prev');
  let paginationArray = [];

  if(arrows == "false"){
    prevBtn = undefined;
    nextBtn = undefined;
  }

  if(paginationText){
    paginationArray = paginationText.split('/')
  }


  //parent slider
  const parentSlider = sliderThumbs && document.querySelector("["+sliderThumbs+"]")

  //initialize swiper slider
  const newSlider = new Swiper(slider, {
    // Optional parameters
    speed: parseInt(slidesSpeed) || 300,
    loop: slidesLoop == 'true' ? true : false,
    spaceBetween: 16,
    slidesPerView: slidesPerViewMobile || 1,
    breakpoints: {
      280: {
        allowTouchMove: allowTouchMove == "false" ? false : true,
        speed: parseInt(slidesSpeedMobile) || 300,
        slidesPerGroup: slidesGroup == 'true' ? slidesPerViewMobile : 1,
        slidesPerView: slidesPerViewMobile,
        initialSlide: initialSlide ? initialSlide : 0,
        centeredSlides: centeredSlides == "true" ? true : false,
      },
      // when window width is >= 750px
      750: {
        allowTouchMove: allowTouchMove == "false" ? false : true,
        speed: parseInt(slidesSpeed) || 300,
        slidesPerView: slidesPerViewTablet,
        slidesPerGroup: slidesGroup == 'true' ? slidesPerViewTablet : 1,
        initialSlide: initialSlide ? initialSlide : 0,
        centeredSlides: centeredSlides == "true" ? true : false,
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
      el: pagination,
      type: paginationType ? paginationType  : 'fraction',
      clickable: true,
      renderBullet: paginationArray.length > 0 ? function (index, className) {
        let paginationConent = '<span class="' + className + '">' + (paginationArray[index]) + '</span>';
        if(index > 0){
          paginationConent = '/<span class="' + className + '">' + (paginationArray[index]) + '</span>';
        }
        return paginationConent;
      }: ""
    },

    // Navigation arrows
    navigation: {
      nextEl: nextBtn,
      prevEl: prevBtn,
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

  newSlider.controller.control = parentSlider && parentSlider.swiper;
  parentSlider && (parentSlider.swiper.controller.control = newSlider);

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

setup()
// export default {
//   setup,
// };
