const dom = {
  select: '[data-featured-icons]',
  viewAll: '[data-featured-icons-toggle]',
  iconsGrid: '.featured-icons__grid',
  iconsGridContainer: '.featured-icons',
  featuredIcon: '.featured-icon',
};

const strings = {
  hideAll: 'View Less',
  viewAll: 'View All'
}

const setup = () => {
  const featuredIcons = document.querySelector(dom.select) || false;
  if (!featuredIcons) return;
  const iconsGrid = featuredIcons.querySelector(dom.iconsGrid);
  const viewAllButton = featuredIcons.querySelector(dom.viewAll);

  viewAllButton.addEventListener('click', (e) => {
    const icons = [].slice.call(featuredIcons.querySelectorAll(dom.featuredIcon));
    icons.forEach((icon) => {
      icon.classList.toggle('active')
    })

    iconsGrid.classList.toggle('active')
    if (iconsGrid.classList.contains('active')) {
      e.target.textContent = strings.hideAll
    } else {
      e.target.textContent = strings.viewAll
      document.querySelector(dom.iconsGridContainer).scrollIntoView();
    }
  })
};

export default {
  setup,
};
