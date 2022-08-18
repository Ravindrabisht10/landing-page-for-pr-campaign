import SimpleParallax from 'simple-parallax-js';

const dom = {
  select: '[data-js-parallax-element]',
};

const setupParallax = (element) => {
  new SimpleParallax(element, {
    scale: 1.3
  })
}

const setup = () => {
  const parallaxElements = document.querySelectorAll(dom.select);
  parallaxElements.forEach((element) => setupParallax(element));
};

export default {
  setup,
};
