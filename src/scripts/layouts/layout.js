import '../utils/RebuyHelpers.js';
import lazyload from '../utils/lazyload.js';
import { setupScrollTos } from '../utils/Helpers.js';

import SwiperSlider from '../components/SwiperSlider';
import Cookie from '../components/Cookie';
import CollapsableNav from '../components/CollapsableNav.js';
import FooterSignup from '../components/FooterSignup.js';
import SiteHeader from '../components/SiteHeader.js';
import InlineCart from '../components/InlineCart.js';
import BuyBox from '../components/BuyBox.js';
import FeaturedIcons from '../components/FeaturedIcons';
import SearchResults from '../components/SearchResults.js';
import Quickshop from '../components/Quickshop.js';
import Parallax from '../components/Parallax.js';
import ViewMoreContent from '../components/ViewMoreContent.js';

document.addEventListener('DOMContentLoaded', () => {
  // Utils
  lazyload.setupObservers();
  setupScrollTos();
  // Components
  Cookie.setup();
  SwiperSlider.setup();
  Parallax.setup();
  FeaturedIcons.setup();
  CollapsableNav.setup();
  FooterSignup.setup();
  SiteHeader.setup();
  Quickshop.setup();
  InlineCart.setup();
  BuyBox.setup();
  SearchResults.setup();
  ViewMoreContent.setup();
});
