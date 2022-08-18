import lazyload from '../utils/lazyload.js';


const dom = {
  trigger: 'data-sticky-header-trigger',
  allowLight: 'data-allow-light',
  header: 'data-header-sticky',
  mobileToggle: 'data-mobile-nav-toggle',
  mobileMenu: 'data-mobile-menu',
  subMenu: 'data-sub-menu',
  subListToggle: 'data-mobile-list',
  desktopTrigger: 'data-desktop-link',
  navClose: 'data-desktop-close'
};

const toggleNav = (tile, observer, isIntersecting) => {
  const header = document.querySelector(`[${dom.header}]`) || false;
  if (isIntersecting) {
    header.classList.add('show-promo');

    if (tile.hasAttribute(dom.allowLight)) {
      header.classList.add('light');
    }
  } else {
    header.classList.remove('light');
    header.classList.remove('show-promo');
  }
};

const setupMobileNav = () => {
  const toggles = document.querySelectorAll(`[${dom.mobileToggle}]`);
  const menu = document.querySelector(`[${dom.mobileMenu}]`);
  const subMenus = document.querySelectorAll(`[${dom.subMenu}]`);
  const mobileLists = document.querySelectorAll(`[${dom.subListToggle}]`);

  mobileLists.forEach((subMenu) => {
    subMenu.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      subMenu.classList.toggle('active');
      subMenu.nextElementSibling.classList.toggle('open');
    });
  });

  subMenus.forEach((subMenu) => {
    subMenu.addEventListener('click', () => {
      subMenu.classList.toggle('open');
    });
  });

  toggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('active');
      setTimeout(() => {
        subMenus.forEach((subMenu) => subMenu.classList.remove('open'));
      },0)
    });
  });
};

const selectDesktopSub = () => {
  const subLinks = document.querySelectorAll(`[${dom.desktopTrigger}]`)
  subLinks.forEach((link) => {
    link.classList.add('no-click')
  });
}

const isMobile = () => {
  return navigator.userAgentData.mobile;
}

const setup = () => {
  setupMobileNav();

  // if(isMobile){
  //   selectDesktopSub();
  // }

  const closeTab = document.querySelectorAll('.dropdown-close-icon');
  const topSubs = document.querySelectorAll('.sub');
  const inputs = document.querySelectorAll('input');
  const links = document.querySelectorAll('.top-level-link')
  const subNav = document.querySelectorAll('.nav-sub');

  topSubs.forEach((sub) => {
    sub.addEventListener('mouseenter', () => {

      sub.childNodes[3].classList.remove('hidden')

      inputs.forEach((input) => {
        input.blur()
      })
      links.forEach((link) => {
        link.classList.remove('hide_line')
      })
    })
    sub.addEventListener('mouseleave', () => {
      closeTab.forEach((tab) => {
        tab.blur()
      })
      links.forEach((link) => {
        link.blur()
      })
      sub.blur()
    })
    sub.addEventListener('click', () => {
      // e.preventDefault()
      sub.focus()
      sub.childNodes[3].classList.remove('hidden')
    })
  });

  
  closeTab.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      subNav.forEach((nav) => {

        setTimeout(() => {
          nav.classList.add('hidden')
          nav.classList.remove('active')
          nav.blur()
        }, 50);

      })
      links.forEach((link) => {
        link.classList.add('hide_line')
        link.blur()
      })
    })
  })

  const trigger = document.querySelector(`[${dom.trigger}]`) || false;
  if (!trigger) return;

  if (trigger.hasAttribute(dom.allowLight)) {
    document.body.classList.add('has-sticky-nav');
  }

  lazyload.setupObservers({
    queryString: `[${dom.trigger}]`,
    callback: toggleNav,
  });

/************************
    Desktop Selectors
*************************/

const headerNavContainer = document.querySelector('.nav-desktop'),
primaryNav = document.querySelector('.nav-primary'),
searchForm = document.getElementById('searchform'),
searchIcon = document.getElementById('nav-search'),
navigationSub = document.querySelector('.navigation-sub'),
searchWrapper = document.querySelector('.search-sub'),
headerSearch = document.querySelector('.header-search'),
resultContainer = document.querySelector('.result-container'),
suggestionResultsContainer = document.querySelector('.suggestions-results'),
collectionResultsContainer = document.querySelector('.collection-results'),
pageResultsContainer = document.querySelector('.page-results'),
productResultsContainer = document.querySelector('.product-results'),
searchResultLink = document.querySelector('.view-all-btn-container'),
serachResultImage = document.querySelector('[data-search-nav-image]');

/************************
    Mobile Selectors
*************************/

const searchMobileWrapper = document.querySelector('.mobile-search'),
navMobile = document.querySelector('.nav-mobile'),
mobileSearchIcon = document.querySelector('.mobile-nav-search'),
mobileHeaderSearch = document.querySelector('.mobile-header-search'),
resultMobileContainer = document.querySelector('.mobile-result-container'),
productMobileResultsContainer = document.querySelector('.product-mobile-results'),
suggestionMobileResultsContainer = document.querySelector('.suggestions-mobile-results'),
collectionMobileResultsContainer = document.querySelector('.collection-mobile-results'),
pageMobileResultsContainer = document.querySelector('.page-mobile-results'),
searchMobileResultLink = document.querySelector('.mobile-view-all-btn-container'),
mobileSearchForm = document.querySelector('.mobile-search-form');

// mobileViewAll = document.querySelector('.mobile-view-all-btn-container')

// Just using for testing, will need to comment out/delete once done
// document.body.classList.toggle("no-scroll");

/************************
    Event listeners
*************************/

searchIcon && searchIcon.addEventListener('click', activeSearch);
// searchIcon.addEventListener('mouseover', activeSearch);
// searchIcon.addEventListener('mouseleave', clearSearch);
// navigationSub.addEventListener('mouseover', activeSearch);
// searchWrapper.addEventListener('mouseleave', clearSearch);
mobileSearchIcon.addEventListener('touchstart', activeSearchIcon);
headerSearch.addEventListener('input', updateValue);
mobileHeaderSearch.addEventListener('input', updateValue);
searchResultLink.addEventListener('click', submitForm);
searchMobileResultLink.addEventListener('click', mobileSubmitForm);
primaryNav.addEventListener('mouseover', clearSearch);
//clearSearchBtn && clearSearchBtn.addEventListener('click', clearSearch)

let timer;

function submitForm() {
  searchForm.submit();
  document.body.classList.toggle("no-scroll");
}

function mobileSubmitForm() {
  mobileSearchForm.submit();
  document.body.classList.toggle("no-scroll");
}

function activeSearchIcon() {
  searchForm.setAttribute("action","/search");
  mobileSearchForm.setAttribute("action","/search");
  searchWrapper.classList.toggle('active-search');
  searchMobileWrapper.classList.toggle('active-search');
  searchMobileWrapper.classList.toggle('hide-nav');
  document.body.classList.add("no-scroll");
  const searchEl = document.querySelector('#search') || false;
  searchEl && searchEl.focus();
}
function activeSearch() {
  searchForm.setAttribute("action","/search");
  mobileSearchForm.setAttribute("action","/search");
  searchWrapper.classList.add('active-search');
  searchWrapper.classList.remove('hidden')
  searchMobileWrapper.classList.add('active-search');
  searchMobileWrapper.classList.remove('hide-nav');
  document.body.classList.add("no-scroll");
  const searchEl = document.querySelector('#search') || false;
  searchEl && searchEl.focus();
}

function clearSearch() {
  searchWrapper.classList.remove('active-search');
  searchWrapper.classList.remove('active');
  resultContainer.classList.add('hide-nav');
  searchResultLink.classList.add('hide-nav');
  document.body.classList.remove("no-scroll");
  headerSearch.value = '';
}



function suggestionSubmitForm(elm) {
  headerSearch.value = elm;
  searchForm.submit();
}

document.addEventListener('click', function(event) {
  if(event.target.classList.contains('suggestion-item')) {
    let desiredSuggestion = event.target.innerText;
    suggestionSubmitForm(desiredSuggestion)
  }
});



var siteHeader = document.querySelector('.page-header');

//I'm using "click" but it works with any event
document.addEventListener('click', function(event) {
  var isClickInside = siteHeader.contains(event.target);

  if (!isClickInside) {
    clearSearch();
  }
});



/****************************
  Where the magic happens ✨
*****************************/

function updateValue(e) {
  let userInput = e.target.value;

  resultContainer.classList.remove("hide-nav");
  resultMobileContainer.classList.remove("hide-nav");
  searchResultLink.classList.remove("hide-nav");
  searchMobileResultLink.classList.remove("hide-nav");
  searchMobileWrapper.classList.toggle("active");
  searchWrapper.classList.add("active");

  if(userInput == '') {
    resultContainer.classList.toggle('hide-nav');
    resultMobileContainer.classList.toggle('hide-nav');
    searchResultLink.classList.toggle('hide-nav');
    searchMobileResultLink.classList.toggle('hide-nav');
    searchMobileWrapper.classList.toggle('active');
    searchWrapper.classList.toggle('active');
  } else {
    activeSearch()
  }
  // Fetch Call to PFS
  fetch('https://services.mybcapps.com/bc-sf-filter/search/suggest?q=' + userInput + '&shop=gh-test-site.myshopify.com&product_limit=3&page_limit=4&fuzzy=2')
  .then((blob) => blob.json())
  .then((response) => {

    // Parse arrays
    let collectionArr = response.collections;
    let suggestionArr = response.suggestions;
    let productArr = response.products;
    let pageArr = response.pages;

    // Clear options when fetch call is made
    productResultsContainer.innerHTML = '';
    productMobileResultsContainer.innerHTML = '';
    collectionResultsContainer.innerHTML = '';
    collectionMobileResultsContainer.innerHTML = '';
    suggestionResultsContainer.innerHTML = '';
    suggestionMobileResultsContainer.innerHTML = '';
    pageResultsContainer.innerHTML = '';
    pageMobileResultsContainer.innerHTML = '';

    // Collection Array
    collectionArr.forEach((val)=>{
      let collectionResultLink = document.createElement("a");
      collectionResultLink.setAttribute('href', "/collections/" + val.handle);
      collectionResultLink.textContent = val.title;
      collectionResultsContainer.appendChild(collectionResultLink);
      collectionMobileResultsContainer.appendChild(collectionResultLink.cloneNode(true));
    });

    // Page Array
    pageArr.forEach((val)=>{
      let pageResultLink = document.createElement("a");
      pageResultLink.setAttribute('href', val.url);
      pageResultLink.textContent = val.title;
      pageResultsContainer.appendChild(pageResultLink);
      pageMobileResultsContainer.appendChild(pageResultLink.cloneNode(true));
    });

    // Suggestion Array
    suggestionArr.forEach((val)=>{
      let suggestionResultLink = document.createElement("span");
      suggestionResultLink.textContent = val;
      suggestionResultLink.setAttribute('data-suggestion', val );
      suggestionResultLink.setAttribute('class','suggestion-item');
      suggestionResultsContainer.appendChild(suggestionResultLink);
      suggestionMobileResultsContainer.appendChild(suggestionResultLink.cloneNode(true));
    });

    const badgeSortValues = {
      'badge-out-of-stock': 1,
      'badge-final-sale': 2,
      'badge-sale': 3,
      'badge-new': 4,
      'badge-coming-soon': 5,
      'badge-best-seller': 6,
      'badge-award-winner': 7,
      'badge-discontinued': 8,
    };



    // Product Array
    productArr.forEach((val)=>{
      //Loop tags to check for badges
      let productTags = val.tags;

      // Create Product card items
      let productWrapper = document.createElement("a");
      let productImageWrapper = document.createElement("div");
      let productImage = document.createElement("img");
      let productSecondaryImage = document.createElement("img");
      let productTitle = document.createElement("h4");
      let productPrice = document.createElement("p");
      let productComparePrice = document.createElement("p");
      let productBadgeContainer = document.createElement("div");

      // Give card items class name and other attr
      productWrapper.setAttribute('class','search-product--wrapper col-lg-4 col-sm-3 col-xs-6');
      productWrapper.setAttribute('href','/products/' + val.handle);
      productImageWrapper.setAttribute('class','product-tile__image-wrap');
      productImage.setAttribute('class','product-tile__image header-search-product-tile__image');
      productImage.setAttribute('data-search-nav-image','product-tile__image');
      productSecondaryImage.setAttribute('class','product-tile__image-alt');
      productTitle.setAttribute('class','search-product-title');
      productPrice.setAttribute('class','search-product-price-min');
      productComparePrice.setAttribute('class','search-product-compare-price');
      productBadgeContainer.setAttribute('class','product-tile__badges');
      productImage.setAttribute('src', val.images[1]);
      productSecondaryImage.setAttribute('src', val.images[2]);


  /******** HIDING $0 VARIANT FROM SEARCH JO 01-18-2022 GH-988 *******/
      let priceArr = [];
      for(let item of val.variants){
        priceArr.push(parseFloat(item.price));
      }
      priceArr.sort((a, b) => {a - b});
      priceArr = [...new Set(priceArr)];
      
      if(val.price_min == 0){
        val.price_min = priceArr[0].toString();
      }
/*********  HIDING $0 VARIANT FROM SEARCH ******************/

      productTitle.textContent = val.title;
      productPrice.textContent = "$" + val.price_min;

   
      if(val.compare_at_price_min){
        productComparePrice.textContent = "$" + val.compare_at_price_min;
        productPrice.classList.add('sale-price');
      } else if(val.compare_at_price_max){
        productComparePrice.textContent = "$" + val.compare_at_price_max;
        productPrice.classList.add('sale-price');
      }

      // Place product items together
      productImageWrapper.append(productImage,productSecondaryImage, productBadgeContainer);
      productWrapper.append(productImageWrapper,productTitle,productPrice,productComparePrice);
      productResultsContainer.appendChild(productWrapper);
      productMobileResultsContainer.appendChild(productWrapper.cloneNode(true));

      // Create Badge hierarchy
      const sortedTags = productTags.sort((a, b) => {
        const aSort = badgeSortValues[a] || 10;
        const bSort = badgeSortValues[b] || 10;
        return aSort - bSort;
      });

      // Set Badges
      function setBadges(badge) {
        let badgeContainers = document.querySelectorAll('.product-tile__badges') || false;
        badgeContainers && badgeContainers.forEach((el) => {
          if(badge){
            el.innerHTML += `<div class="badge badge--${badge}">${badge}</div>`;
          } else {
            el.innerHTML += `<div class="badge"></div>`;
          }
        });
        
      }

      // Check for badge and implement badge hierarchy
      let badgeFound = false;
      sortedTags.forEach((tag) => { 
        if (tag.includes('badge-')) {
          badgeFound = true;
          const badgeText = tag.replace('badge-', '');
          setBadges(badgeText);
        }
      });

      if(!badgeFound){
        setBadges(false);
      }

    });

    // If no results, let user know
    if(collectionArr.length == 0) {
      collectionResultsContainer.innerHTML = '<p class="no-results">No Results</p>';
      collectionMobileResultsContainer.innerHTML = '<p class="no-results">No Results</p>';
    }
    if(suggestionArr.length == 0){
      suggestionResultsContainer.innerHTML = '<p class="no-results">No Results</p>';
      suggestionMobileResultsContainer.innerHTML = '<p class="no-results">No Results</p>';
    }
    if(pageArr.length == 0){
      pageResultsContainer.innerHTML = '<p class="no-results">No Results</p>';
      pageMobileResultsContainer.innerHTML = '<p class="no-results">No Results</p>';
    }
    if(productArr.length == 0){
      productResultsContainer.innerHTML = '<p class="no-results">No Results</p>';
      productMobileResultsContainer.innerHTML = '<p class="no-results">No Results</p>';
    }

  });
}


};

export default {
  setup
};