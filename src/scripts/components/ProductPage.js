import { fetchProductResults, cleanProductResults } from '../utils/ProductResults.js';

const dom = {
  results: 'data-hreb-results',
};

const setup = () => {
  fetchProductResults(window.productSku, 0)
    .then((data) => {
      const results = cleanProductResults(data.cofc);
      const resultTable = document.querySelector(`[${dom.results}]`) || false;
      if (resultTable === false) return;

      results.forEach((test) => {
        const row = document.createElement('tr');
        row.classList.add('meet-herbs__result');
        row.innerHTML = `<td>${test.test}</td>
        <td class="score">
          ${test.passes ? '<svg><use href="#checkmark-icon"/></svg> PASSED' : 'FAILS'}
        </td>`;
        resultTable.appendChild(row);
      });
    });
};

export default {
  setup,
};
