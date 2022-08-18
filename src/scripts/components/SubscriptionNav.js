const dom = {
  wrapper: '.js-selectNav',
  list: '.js-appendAroundContent',
};

const navigateTo = (event) => {
  const link = event.target.value;
  window.location.href = link;
};

const setupFormListener = () => {
  const searchForm = document.querySelector('#rc_product_search') || false;
  if (!searchForm) return;

  const action = searchForm.getAttribute('action');
  const observer = new MutationObserver(() => {
    if (searchForm.getAttribute('action') != action) {
      searchForm.setAttribute('action', action);
      observer.disconnect();
    }
  });
  observer.observe(searchForm, {
    attributes: true,
    subtree: true,
  });
}

const setup = () => {
  setupFormListener();

  const wrapperEl = document.querySelector(`${dom.wrapper}`) || false;
  const list = document.querySelectorAll(`${dom.list} a`) || [];
  const billingSelect = document.querySelector('[name="billing_country"]') || false;

  if (billingSelect) {
    const billingWrap = billingSelect.parentNode;
    billingWrap.classList.add('select-wrap');
  }

  if (!wrapperEl) return;

  const selectElWrap = document.createElement('div');
  selectElWrap.classList.add('mobile-only', 'select-wrap');
  const selectEl = document.createElement('select');
  selectEl.addEventListener('change', navigateTo);
  selectEl.innerHTML = [...list].reduce((html, item) => {
    const isSelected = item.getAttribute('href') === window.location.href;
    return `${html}<option value="${item.getAttribute('href')}" ${isSelected ? 'selected' : ''}>${item.innerHTML}</option>`;
  }, '');
  selectElWrap.appendChild(selectEl);
  wrapperEl.appendChild(selectElWrap);


  const href = window.location.href;
  const subLinks = document.querySelectorAll('.js-selectNav a') || [];
  let displayed = false;
  [...subLinks].reverse().forEach((link) => {
    const linkURL = link.getAttribute('href');
    let setAsActive = false;
    if (href.includes('payment_source') && linkURL.includes('payment_source')) {
      setAsActive = true;
    } else if (!linkURL.includes('payment_source') && href.includes('tools/recurring/portal') && linkURL.includes('tools/recurring/portal')) {
      setAsActive = true;
    }

    if (displayed === false && setAsActive === true) {
      displayed = true;
      link.parentNode.classList.add('active');
    }
  });

  const cancelLinks = document.querySelectorAll('.cancle-link a') || [];
  cancelLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      cancelLinks.forEach((linkToToggle) => {
        if (linkToToggle !== event.target) {
          linkToToggle.classList.remove('active');
        }
      })
    });
  });
};

export default {
  setup,
};
