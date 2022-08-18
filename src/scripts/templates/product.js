import ProductGallery from '../components/ProductGallery.js';
import ProductPage from '../components/ProductPage.js';
import StickyATC from '../components/StickyATC.js';
import ProductScroller from '../components/product-scoller.js';

document.addEventListener("DOMContentLoaded", () => {
  ProductGallery.setup();
  ProductGallery.setupZoom();
  StickyATC.setup();
  ProductPage.setup();
  ProductScroller.setup();
});