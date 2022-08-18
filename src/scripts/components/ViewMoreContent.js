const setup = () => {
  const viewMoreContent = document.querySelectorAll('.js-view-more-content') || [];
  viewMoreContent.forEach((item) => {
    item.classList.add('view-more-maxed--open');
    // item.addEventListener('click', () => item.classList.add('view-more-maxed--open'));
  });
};

export default {
  setup,
};
