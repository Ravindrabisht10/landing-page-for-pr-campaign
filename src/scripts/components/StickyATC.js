import LazyLoad from '../utils/lazyload.js';

const dom = {
  buybox: 'data-product-buybox',
  breadcrumbs: 'data-product-breadcrumbs',
  stickyWrap: 'data-sticky-atc-wrapper',
  stickyATC: 'data-sticky-atc',
  header: 'data-header-sticky',
  variants: 'data-variant-sku',
};

const scrollToBuybox = (event) => {
  const buybox = document.querySelector(`[${dom.buybox}]`);
  const header = document.querySelector(`[${dom.header}]`);
  const scrollTo = buybox.offsetTop - header.offsetHeight;

  window.scrollTo({
    top: scrollTo,
    behavior: 'smooth',
  });
};

const checkInStock = () => {
  const variants = document.querySelectorAll(`[${dom.variants}]`);
  if (variants.length === 0) return false;
  return [...variants].reduce((inStock, variant) => {
    return inStock && !variant.hasAttribute('disabled');
  }, true);
};

const setStickyVisibility = (entry, observer, isIntersecting) => {
  const header = document.querySelector(`[${dom.header}]`);
  const stickyWrap = document.querySelector(`[${dom.stickyWrap}]`);
  const inStock = checkInStock();

  if (!inStock || isIntersecting) {
    header.classList.remove('replaced');
    stickyWrap.classList.remove('visible');
  } else {
    header.classList.add('replaced');
    stickyWrap.classList.add('visible');
  }
};

const setup = () => {
  LazyLoad.setupObservers({
    queryString: `[${dom.buybox}]`,
    callback: setStickyVisibility,
  });

  const atcButtons = document.querySelectorAll(`[${dom.stickyATC}]`);
  atcButtons.forEach((atcButton) => atcButton.addEventListener('click', scrollToBuybox));
};

export default {
  setup,
};
