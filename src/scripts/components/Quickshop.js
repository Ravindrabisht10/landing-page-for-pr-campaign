import BuyBox from './BuyBox.js';
import ProductGallery from '../components/ProductGallery.js';

const dom = {
  quickshop: 'data-quickshop',
  quickshopContents: 'data-quickshop-content',
  trigger: 'data-quickbuy-trigger',
  close: 'data-close-quickshop',
};

const setBodyScroll = () => {
  const quickshop = document.querySelector(`[${dom.quickshop}]`) || false;
  const inlineCart = document.querySelector(`.inline-cart`) || false;
  if ((quickshop && quickshop.classList.contains('open')) || inlineCart.classList.contains('open')) {
    document.body.classList.add('no-scroll');
  } else {
    document.body.classList.remove('no-scroll');
  }
};

const closeQuickshop = () => {
  const quickshop = document.querySelector(`[${dom.quickshop}]`) || false;
  quickshop && quickshop.classList.remove('open');
  setBodyScroll();
};

const loadQuickshop = (productHandle) => {
  fetch(`/products/${productHandle}?view=quickshop`)
    .then((blob) => blob.text())
    .then((response) => {
      const quickshop = document.querySelector(`[${dom.quickshop}]`);
      const contents = document.querySelector(`[${dom.quickshopContents}]`);
      contents.innerHTML = response;
      quickshop.classList.add('open');
      BuyBox.setup();
      // refresh yotpo widgets
      const api = new Yotpo.API(yotpo);
      api.refreshWidgets();
      // setup PDP gallery
      ProductGallery.setup();
      setBodyScroll()
    });
};

const setup = () => {
  document.addEventListener('click', (event) => {
    const quickshop = document.querySelector(`[${dom.quickshop}]`) || false;
    if (quickshop === false) return;

    if (event.target.hasAttribute(dom.trigger)) {
      const productHandle = event.target.getAttribute(dom.trigger);
      loadQuickshop(productHandle);
    }
    else if (event.target.hasAttribute(dom.close)) {
      closeQuickshop();
    }
    // check if clicking outside the quickshop cart and close if so
    else if (quickshop != event.target && !quickshop.contains(event.target)) {
      closeQuickshop();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.keyCode == 27) closeQuickshop();
  });

  window.setBodyScroll = setBodyScroll;
  window.closeQuickshop = closeQuickshop;
};

export default {
  setup,
};