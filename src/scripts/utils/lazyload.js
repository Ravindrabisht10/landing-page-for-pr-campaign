/**
 * Set the background image as a media query on an element
 *
 * @param: {Node} tile: the element to add the CSS background image srcset to
 */
const setTileMediaQueries = (tile) => {
  const tileIdentifier = tile.getAttribute('data-io-id');
  const tileImagesRaw = tile.getAttribute('io-bg-srcset');
  const tileImages = tileImagesRaw.split(',');
  const stylesElement = document.createElement('style');
  tileImages.forEach((tileImage) => {
    const imageParts = tileImage.trim().split(' ');
    stylesElement.innerHTML += `@media screen and (min-width: ${imageParts[1]}) {
      [data-io-id="${tileIdentifier}"] {
        background-image: url('${imageParts[0]}');
      }
    }`;
  });
  document.body.appendChild(stylesElement);
};

/**
 * Default callback for the lazyloader. Will load in image sources and then unobserve the element
 *
 * @param: {Node} tile: the element just loaded into the viewport
 * @param: {Object} observer: the observer that is watching/notifiying the tile element
 * @param: {boolean} isIntersecting: whether the tile is in the viewport or if it just left the viewport
 */
const setTileBackground = (tile, observer, isIntersecting) => {
  // only set img sources if the tile is in the viewport
  if (!isIntersecting) {
    return;
  }
  // check if the element has a CSS background to be set
  if (tile.hasAttribute('io-bg-src')) {
    const backgroundURL = tile.getAttribute('io-bg-src');
    tile.style.backgroundImage = `url('${backgroundURL}')`;
  }
  // check if there is a sourceset for setting backgrounds via CSS
  if (tile.hasAttribute('io-bg-srcset')) {
    setTileMediaQueries(tile);
  }
  // check if there is a src to set on an image tag
  if (tile.hasAttribute('io-img-src')) {
    const src = tile.getAttribute('io-img-src');
    tile.setAttribute('src', src);
    // also check if the img tag has a srcset attribute to set
    if (tile.hasAttribute('io-img-srcset')) {
      const srcset = tile.getAttribute('io-img-srcset');
      tile.setAttribute('srcset', srcset);
    }
  }
  // unobserve the tile
  if (observer) {
    observer.unobserve(tile);
  }
  // need to notify of the image loading in
  const imageEvent = new CustomEvent('ioSourceSet', {
    detail: { target: tile },
  });
  document.dispatchEvent(imageEvent);
};

/**
 * Binds an observer to given elements if IOs exist in the browser
 *
 * @param: {NodeList} toObserve: list of elements that will be observed by the single observer
 * @param: {Function} successCallback: the callback for when an element is lazyloaded / enters/exits the viewport
 * @param: {Function} errorCallback: callback called on a per element basis if the browser doesn't support intersection observers
 * @param: {String} margins: string with the margins for when an element counts as being in the viewport
 */
const createObservers = ({ toObserve, successCallback, errorCallback, margins, threshold }) => {
  // check if IOs are available or not
  if ('IntersectionObserver' in window) {
    // define everything we need to pass to the callback
    const rootMargin = { rootMargin: margins, threshold };
    const callback = (entries, observer) => {
      entries.forEach((entry) => {
        successCallback(entry.target, observer, entry.isIntersecting, entry);
      });
    };
    // our actual observer
    const observer = new IntersectionObserver(callback, rootMargin);
    // have to bind to each individual tile
    toObserve.forEach((tile) => {
      observer.observe(tile);
    });
  } else {
    // If there is an error callback defined, use it. Otherwise, fallback to default success callback
    const callback = errorCallback !== false ? errorCallback : successCallback;
    toObserve.forEach((tile) => {
      callback(tile, false, true);
    });
  }
};

/**
 * Setup observers for a group of elements on the page
 *
 * @param: {String} queryString: a query query for grabbing all elements to observe
 * @param: {Function} callback: the callback function for when the elements enter/exit the view
 * @param: {Function} errorCallback: the callback function for if Intersection Observers are not available in the current browser.
 * @param: {String} margins: string representing the bounds for when the tiles load
 */
const setupObservers = ({ queryString = '[io-img-src], [io-img-srcset], [io-bg-src], [io-bg-srcset]', callback = setTileBackground, errorCallback = false, margins = '0% 0% 0% 0%', threshold = 0 } = {}) => {
  const toObserve = document.querySelectorAll(queryString);
  createObservers({
    toObserve: toObserve,
    successCallback: callback,
    errorCallback: errorCallback,
    margins,
    threshold,
  });
};

export default {
  setupObservers,
};
