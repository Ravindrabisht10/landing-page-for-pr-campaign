import { fetchProductResults, cleanProductResults } from '../utils/ProductResults.js';
import { getURLParameter } from '../utils/Helpers.js';
import { setupVueApp } from '../components/ResultsVueApp.js';

const dom = {
  results: 'data-hreb-results',
  title: 'data-herb-results-product-title',
  productTitle: 'data-herb-manufacture-title',
  excerpt: 'data-herb-manufacture-excerpt',
  image: 'data-herb-results-product-image',
  link: 'data-herb-results-product-link',
  id: 'data-herb-manufacture-id',
  table: 'data-herb-manufacture-table',
  triggers: 'data-trigger-herb',
  contents: 'data-for-herb',
  modalTrigger: 'data-trigger-cert-modal',
  certModal: 'data-cert-modal',
  closeCertModal: 'data-close-cert-modal',
};

const setupIngredientSlider = () => {
  const triggers = document.querySelectorAll(`[${dom.triggers}]`);
  const contents = document.querySelectorAll(`[${dom.contents}]`);
  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const forHerb = trigger.getAttribute(dom.triggers);
      contents.forEach((content) => {
        if (content.getAttribute(dom.contents) === forHerb) {
          content.classList.remove('hidden');
        } else {
          content.classList.add('hidden');
        }
      });
      triggers.forEach((contentTrigger) => {
        if (trigger === contentTrigger) {
          contentTrigger.classList.add('active');
        } else {
          contentTrigger.classList.remove('active');
        }
      })
    });
  });
};

const setupProductInfo = (data, IDToPass) => {
  const productSlug = data.slug;
  //console.log( `${IDToPass}` );
  if (data.redirect === 1) {
    window.location = `https://www.gaiaprofessional.com/products/trace/${IDToPass}`;
  }
  else if (data.redirect === 2) {
    window.location = `https://www.gaiaherbshemp.com/pages/meet-your-herbs-results?id=${IDToPass}`;
  }

  fetch(`/products/${productSlug}?view=json`)
    .then((blob) => blob.json())
    .then((productData) => {
      const titleEls = document.querySelectorAll(`[${dom.title}]`);
      const productTitleEl = document.querySelectorAll(`[${dom.productTitle}]`);
      const imageEls = document.querySelectorAll(`[${dom.image}]`);
      const linkEls = document.querySelectorAll(`[${dom.link}]`);
      const excerptEl = document.querySelectorAll(`[${dom.excerpt}]`);
      const ingredientsEl = document.querySelectorAll(`[data-other-ingredients]`);
      const doesntContainEl = document.querySelectorAll(`[data-doesnt-contain]`);
      const images = document.querySelectorAll(`[data-product-image]`);

      images.forEach((image) => {
        image.setAttribute('src', productData.image);
        image.classList.remove('hidden');
      });
      productTitleEl.forEach((title) => title.innerHTML = productData.title);
      titleEls.forEach((titleEl) => titleEl.innerHTML = `Testing Results for ${productData.title}`);
      linkEls.forEach((linkEl) => linkEl.setAttribute('href', productData.url));
      excerptEl.forEach((excerpt) => excerpt.innerHTML = productData.description);
      ingredientsEl.forEach((ingredient) => ingredient.innerHTML = productData.metafields.ingredients);
      doesntContainEl.forEach((contain) => contain.innerHTML = productData.metafields.doesntContain);
      imageEls.forEach((imageEl) => {
        imageEl.setAttribute('src', productData.image);
        imageEl.classList.remove('hidden');
      });

      setupVueApp(data, productData);
      setupIngredientSlider(data, productData);

      const modalTriggers = document.querySelectorAll(`[${dom.modalTrigger}]`) || [];
      modalTriggers.forEach((modalTrigger) => modalTrigger.addEventListener('click', () => {
        const modal = document.querySelector(`[${dom.certModal}]`);
        const modalTitle = document.querySelector(`[data-herb-modal-product-title]`);
        modal.classList.remove('hidden');
        modalTitle.innerHTML = productData.title;
      }));
    });
};

const formatDate = (date) => {
  const pieces = date.split('-');
  return `${pieces[1]}/${pieces[2]}/${pieces[0]}`;
}

const setupDatesTable = (data) => {
  const tableEls = document.querySelectorAll(`[${dom.table}]`);
  tableEls.forEach((tableEl) => {
    tableEl.innerHTML = `
      <tr><td>MASTER ID</td><td>${data.Purity_ID}</td></tr>
      <tr><td>Manufacture Date</td><td>${formatDate(data.manufactured_date)}</td></tr>
      <tr><td>Best By Date</td><td>${formatDate(data.cofc.best_by)}</td></tr>
    `;
  });
};

const closeCertModal = () => {
  const certModal = document.querySelector(`[${dom.certModal}]`);
  certModal.classList.add('hidden');
}

const setup = () => {
  const productCode = getURLParameter('id');
  const productID = getURLParameter('product');
  const resultType = productCode ? 1 : 0;
  const IDToPass = productCode ? productCode : productID;

  fetchProductResults(IDToPass, resultType)
    .then((data) => {
      const mainPanel = document.querySelector(`[data-herb-results-panel="main"]`) || false;
      mainPanel && mainPanel.classList.remove('hidden');

      setupProductInfo(data, IDToPass);
      setupDatesTable(data);

      const productIDEl = document.querySelector(`[${dom.id}]`);
      productIDEl.innerHTML = `ID #${data.Purity_ID}`

      const results = cleanProductResults(data.cofc);
      const resultTables = document.querySelectorAll(`[${dom.results}]`) || [];
      if (resultTables.length === 0) return;
      results.forEach((test) => {
        const row = `<tr class="meet-herbs__result"><td>${test.test}</td>
        <td class="score">
          ${test.passes ? '<svg><use href="#checkmark-icon"/></svg> PASSED' : 'FAILS'}
        </td></tr>`;

        resultTables.forEach((resultTable) => {
          resultTable.innerHTML += row;
        });
      })
    })
    .catch((err) => {
      const panels = document.querySelectorAll(`[data-herb-results-panel]`) || [];
      panels.forEach((panel) => panel.classList.toggle('hidden'));
    });

  document.addEventListener('click', (event) => {
    if (event.target.hasAttribute(dom.certModal) ||
        event.target.hasAttribute(dom.closeCertModal)) {
      closeCertModal();
    }
  });
};

export default {
  setup,
};
