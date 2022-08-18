window.addEventListener('load', (event) => {

    // Selectors
    const productTab = document.querySelector('.product-selector') || false,
    pageTab = document.querySelector('.page-selector') || false,
    productSearchGrid = document.querySelector('.product-search-grid') || false,
    pageSearchWrapper = document.querySelector('.page-result-wrapper') || false,
    pageSearchGrid = document.querySelector('.page-search-grid') || false,
    productFilters = document.getElementById('shopify-section-search-filtering') || false,
    suggestionWrapper = document.querySelector('.suggestion-wrapper') || false,
    searchFilterMobileTriggers = document.querySelectorAll('[data-mobile-filter-trigger]') || false,
    searchFilters = document.querySelector('.search-filter-nav') || false,
    searchNavToggle = document.querySelector('[data-search-filter-nav-toggle]') || false,
    searchFilterNav = document.querySelector('[data-search-filter-nav]') || false,
    typeSelector = document.querySelector('.type-selector-wrapper') || false;
  
    const mobileFilterSelector = document.querySelector('.search-filter-custom-sorting'),
    mobileControls = document.querySelector('.product-controls--mobile');
  
    searchNavToggle && searchNavToggle.addEventListener('click', () => {
      searchFilterNav && searchFilterNav.classList.toggle('closed');
      searchNavToggle.classList.toggle('closed');
    });
  
    searchFilterMobileTriggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        searchFilters.classList.toggle('open');
        if(productFilters.classList.contains('hide-result')) {
          productFilters.classList.toggle('hide-result');
        }
      });
    });
  
    // Event Listeners
    pageTab && pageTab.addEventListener('click', displayPageResults);
    productTab && productTab.addEventListener('click', displayProductResults);
  
    function displayPageResults() {
      productTab.classList.remove('active');
      pageTab.classList.add('active');
      productSearchGrid.classList.add('hide-result');
      pageSearchWrapper.classList.remove('hide-result');
      productFilters.classList.add('hide-result');
      suggestionWrapper.classList.add('page-view-enabled');
      mobileFilterSelector.classList.add('hide-tab');
      mobileControls.classList.add('hide-result');
      typeSelector.classList.add('page-active');
  
      if(document.querySelectorAll('.page-element-wrapper').length >= dataProductCount) {
        document.querySelector('.page-load-more-btn').classList.add('hide');
      } else {
        document.querySelector('.page-load-more-btn').classList.remove('hide');
      }
    }
  
    function displayProductResults() {
      productTab.classList.add('active');
      pageTab.classList.remove('active');
      productSearchGrid.classList.remove('hide-result');
      pageSearchWrapper.classList.add('hide-result');
      productFilters.classList.remove('hide-result');
      suggestionWrapper.classList.remove('page-view-enabled');
      mobileFilterSelector.classList.remove('hide-tab');
      mobileControls.classList.remove('hide-result');
      typeSelector.classList.remove('page-active');
    }
  
    let params = new URLSearchParams(window.location.search);
    let searchTerm = params.get('q');
    let searchURL = 'https://services.mybcapps.com/bc-sf-filter/search/pages?q=';
    let shopURL = '&shop=gh-test-site.myshopify.com';
    let pageNum = "&page=" + params.get('page');
    const loadMoreBtn = document.querySelector('.page-load-more-btn') || false;
    let loadMoreClickCount = 1;
    let productCount = 0;
    let dataProductCount = 0;
  
    loadMoreBtn && loadMoreBtn.addEventListener('click', function(event) {
      loadMoreClickCount += 1;
      let params = new URLSearchParams(window.location.search);
      let searchTerm = params.get('q');
      let searchURL = 'https://services.mybcapps.com/bc-sf-filter/search/pages?q=';
      let shopURL = '&shop=gh-test-site.myshopify.com';
      let additionalPageNum = +params.get('page') + +loadMoreClickCount;
      additionalPageNum = "&page=" + additionalPageNum;
      
      pageResultRequest(searchURL, searchTerm, shopURL, additionalPageNum, document.querySelectorAll('.page-element-wrapper').length);
    });
    
    function pageResultRequest(fetchURL, searchTerm, shopURL, pageNum, pageCount) {
      // on page load get page results
      fetch(fetchURL + searchTerm + shopURL + pageNum)
      .then((blob) => blob.json())
      .then((response) => {
        const pageData = response.pages;
        let pageDataCount = response.total_page;
  
        dataProductCount = response.total_page;
  
        pageData.forEach(page => {
  
          // create page result HTML element
          const pageResultWrapper = document.createElement("div");
          const pageImageWrapper = document.createElement("div");
          const pageTextWrapper = document.createElement("div");
          const pageImage = document.createElement("img");
          const pageTitle = document.createElement("a");
          const pageDesc = document.createElement("p");
          const pageLink = document.createElement("a");
  
          // Give page elements class names
          pageResultWrapper.setAttribute("class","page-element-wrapper");
          pageImageWrapper.setAttribute("class","page-image-wrapper");
          pageTextWrapper.setAttribute("class","page-text-wrapper col-9");
          pageImage.setAttribute("class","page-element-image");
          pageTitle.setAttribute("class","page-result-title");
          pageLink.setAttribute("class","page-result-link");
  
          // Assign element attributes
          pageTitle.textContent = page.title;
          pageTitle.setAttribute('href', page.url);
          pageLink.setAttribute('href', page.url);
          if(page.image) {
            pageImageWrapper.setAttribute("style", "background-image: url(" + page.image.src + ");background-repeat: no-repeat;");
          } else {
            pageImageWrapper.setAttribute("style", "background-image: url(https://cdn.shopify.com/s/files/1/0058/0252/4783/files/1200x630_-_Farm.jpg);background-repeat: no-repeat;");
          }
  
          // Append page element
          pageImageWrapper.append(pageImage);
          pageLink.append(pageImageWrapper);
          pageTextWrapper.append(pageTitle);
          pageResultWrapper.append(pageLink, pageTextWrapper);
          pageSearchGrid.append(pageResultWrapper);
  
          // For page load to see if the 'load more' button needs to display
          productCount += 1;
        });
  
  
        if(document.querySelectorAll('.page-element-wrapper').length == pageDataCount) {
          loadMoreBtn.classList.add('hide');
        }
      });
    }
  
    pageResultRequest(searchURL, searchTerm, shopURL, pageNum);
  
  });
