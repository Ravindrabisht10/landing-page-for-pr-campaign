const setup = () => {
  const formSelector = document.querySelector('[data-wufoo-field="dropdown"]') || false;
  formSelector && formSelector.addEventListener('change', (event) => {
    const formOneEls = document.querySelectorAll('[data-form-contents="form1"]');
    const formTwo = document.querySelector('[data-form-contents="form2"]');

    if (event.target.value === 'Sponsorship Request') {
      formOneEls.forEach((formOne) => formOne.classList.add('hidden'));
      formTwo.classList.remove('hidden');
    } else {
      formOneEls.forEach((formOne) => formOne.classList.remove('hidden'));
      formTwo.classList.add('hidden');
    }
  });
};

export default {
  setup,
};