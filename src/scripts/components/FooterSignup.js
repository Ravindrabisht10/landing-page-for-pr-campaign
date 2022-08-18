const dom = {
  emarsys: '#newsletter-subscribe',
  emarsysEmail: '[data-emarsys-email]',
  emarsysSuccess: '[data-emarsys-success]',
};

const endpoint = 'https://5mdfcecucd.execute-api.us-east-1.amazonaws.com/production/emarsysapi';

const setup = () => {
  const footerForm = document.querySelector(dom.emarsys);
  const footerInput = document.querySelector(dom.emarsysEmail);
  const footerSuccess = document.querySelector(dom.emarsysSuccess);

  footerForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const payload = { account: "gaiaherbs.com", contacts: [], endpoint: "post_contact" };
    payload.contacts.push({
      3: footerInput.value,
      31: 1,
      key_id: "3"
    });

    fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
      .then((blob) => blob.json())
      .then((data) => {
        footerForm.classList.add('hidden');
        footerSuccess.classList.remove('hidden');
      });
  });
};

export default {
  setup,
};