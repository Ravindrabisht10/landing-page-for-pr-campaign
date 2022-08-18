const dom = {
  count: 'data-product-count',
  sorting: 'data-sorting',
  sortList: '.boost-pfs-filter-filter-dropdown',
  toggle: 'data-filter-nav-toggle',
  nav: 'data-filter-nav',
  filterItem: '.boost-pfs-filter-option-value',
  filterMobileTrigger: 'data-mobile-filter-trigger',
  filters: 'data-filters',
};

const toggleSortMenu = (event) => {
  const lists = document.querySelectorAll(dom.sortList);
  const sortingButtons = document.querySelectorAll(`[${dom.sorting}] button`);

  lists.forEach((list) => list.classList.toggle('open'));
  sortingButtons.forEach((sortingButton) => sortingButton.classList.toggle('open'));
};

const closeSelect = () => {
  const lists = document.querySelectorAll(dom.sortList);
  const sortingButtons = document.querySelectorAll(`[${dom.sorting}] button`);

  sortingButtons.forEach((sortingButton) => sortingButton.classList.remove('open'));
  lists.forEach((list) => list.classList.remove('open'));
};

const setupNavToggle = () => {
  const navToggle = document.querySelector(`[${dom.toggle}]`) || false;
  const navigation = document.querySelector(`[${dom.nav}]`) || false;
  navToggle && navToggle.addEventListener('click', () => {
    navigation && navigation.classList.toggle('closed');
    navToggle.classList.toggle('closed');
  });
};

const setupFilters = () => {
  const items = document.querySelectorAll(dom.filterItem) || [];
  items.forEach((item) => {
    item.innerHTML = item.innerHTML.replaceAll('-', ' ');
  });

  const filterMenus = document.querySelectorAll('.boost-pfs-filter-button.boost-pfs-filter-option-title-heading');
  /* filterMenus.forEach((menu) => {
    if (window.haveClosedFilters && window.haveClosedFilters === true) {
      return;
    } else {
      menu.click()
    }
  });
  window.haveClosedFilters = true; */

  const mobileFilter = document.querySelector('#boost-pfs-filter-tree');
  mobileFilter.classList.remove('boost-pfs-filter-tree-mobile-style3', 'boost-pfs-filter-tree-mobile-sticky');
};

const setup = () => {
  const countEl = document.querySelector(`[${dom.count}]`);
  const sortingEls = document.querySelectorAll(`[${dom.sorting}]`);
  const sortItems = document.querySelectorAll(`[${dom.sorting}] li`);
  const filterMobileTriggers = document.querySelectorAll(`[${dom.filterMobileTrigger}]`);
  const filters = document.querySelector(`[${dom.filters}]`);

  sortingEls.forEach((sortingEl) => sortingEl.addEventListener('click', toggleSortMenu));
  sortItems.forEach((item) => {
    item.addEventListener('click', closeSelect);
  });

  filterMobileTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      filters.classList.toggle('open');
    });
  });

  ProductList.prototype.afterRender = function() {
    const articles = document.querySelectorAll('.product-tile');
    countEl.innerHTML = `${articles.length} products`;
  }

  ProductSorting.prototype.render = function () {
    closeSelect();

    const selectedOption = Globals.queryParams.sort;
    const selectedItem = document.querySelectorAll(`[data-sort="${selectedOption}"]`);
    const allListItems = document.querySelectorAll(`[data-sort]`);
    allListItems.forEach((listItem) => {
      if (listItem.getAttribute('data-sort') == selectedOption) {
        listItem.parentNode.classList.add('active');
      } else {
        listItem.parentNode.classList.remove('active');
      }
    });

    sortingEls.forEach((sortingEl) => {
      const sortButton = sortingEl.querySelector('button') || false;
      const mobileControls = document.querySelector('[data-mobile-controls]') || false;
      if (mobileControls == false || sortButton == false) return;
      if (selectedItem[0] == null) return;

      if (selectedItem[0].innerHTML.length > 9 && mobileControls.contains(sortButton) && window.innerWidth < 525) {
        sortButton.innerHTML = `${selectedItem[0].innerHTML.substring(0, 9)}...`;
      } else {
        sortButton.innerHTML = `${selectedItem[0].innerHTML}`;
      }
    });

    setTimeout(setupFilters, 1000);
  }

  // close the sort dropdown when clicking outside of it
  document.addEventListener('click', (event) => {
    sortingEls.forEach((sortingEl) => {
      if (sortingEl !== event.target && !sortingEl.contains(event.target)) {
        sortingEl.children.forEach((child) => child.classList.remove('open'));
      }
    });
  });

  setupNavToggle();
};

export default {
  setup,
};