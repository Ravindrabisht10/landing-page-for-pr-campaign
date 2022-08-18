const dom = {
  herbClear: 'data-clear-search',
  herbSearch: 'data-search-input',
}

const setup = () => {
  const clears = document.querySelectorAll(`[${dom.herbClear}]`);
  const inputs = document.querySelectorAll(`[${dom.herbSearch}]`);

  clears.forEach((clear) => {
    clear.addEventListener('click', (event) => {
      event.preventDefault();
      inputs.forEach((input) => {
        input.value = '';
      });
    });
  });
  // const trigger = document.querySelector(`[${dom.trigger}]`) || false;
  // if (!trigger) return;

  // if (trigger.hasAttribute(dom.allowLight)) {
  //   document.body.classList.add('has-sticky-nav');
  // }

  // lazyload.setupObservers({
  //   queryString: `[${dom.trigger}]`,
  //   callback: toggleNav,
  // });
};

export default {
  setup
};
