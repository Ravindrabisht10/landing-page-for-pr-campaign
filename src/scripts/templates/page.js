import NavSelect from '../components/NavSelect.js';
import ProductScroller from '../components/product-scoller.js';
import HerbResults from '../components/HerbResults.js';
import HerbReference from '../components/HerbReference.js';
import People from '../components/People.js';
import Contact from '../components/Contact.js';

document.addEventListener('DOMContentLoaded', () => {
  NavSelect.setup();
  HerbResults.setup();
  HerbReference.setup();
  People.setup();
  ProductScroller.setup();
  Contact.setup();
});
