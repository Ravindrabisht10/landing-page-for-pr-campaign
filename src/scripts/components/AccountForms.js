const dom = {
  forgot: '#RecoverPassword',
  forgotModal: '#RecoverPasswordForm',
  close: 'data-close-modal',
  addAddress: '#AddressNewForm',
  editAddress: '#EditAddress_',
  editAddressForm: 'data-edit-address-form',
  addresses: 'data-saved-addresses',
  editButton: 'data-form-id',
  closeEdit: 'data-close-address-edit',
  addAddressButton: 'data-add-new-address',
};

const setupAddresses = () => {
  const addAddressEl = document.querySelector(dom.addAddress);
  const savedAddressEl = document.querySelector(`[${dom.addresses}]`);
  const editFormsEl = document.querySelectorAll(`[${dom.editAddressForm}]`);
  const editButtons = document.querySelectorAll(`[${dom.editButton}]`) || [];
  const closeEditEl = document.querySelectorAll(`[${dom.closeEdit}]`) || [];
  const addNewAddressEl = document.querySelector(`[${dom.addAddressButton}]`) || false;
  const editPagination = document.querySelector(`.pagination`) || false;

  editButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.classList.contains('address-delete')) return;
      const id = button.getAttribute(dom.editButton);
      const form = document.querySelector(`${dom.editAddress}${id}`);
      form.classList.remove('hidden');
      savedAddressEl.classList.add('hidden');
      editPagination && editPagination.classList.add('hidden');
    });
  });

  closeEditEl.forEach((close) => {
    close.addEventListener('click', () => {
      savedAddressEl.classList.remove('hidden');
      addAddressEl.classList.add('hidden');
      editFormsEl.forEach((form) => form.classList.add('hidden'));
      editPagination && editPagination.classList.remove('hidden');
    });
  });

  addNewAddressEl.addEventListener('click', () => {
    savedAddressEl.classList.add('hidden');
    addAddressEl.classList.remove('hidden');
    editFormsEl.forEach((form) => form.classList.add('hidden'));
    editPagination && editPagination.classList.add('hidden');
  });
};

const setup = () => {
  const trigger = document.querySelector(dom.forgot) || false;
  const modal = document.querySelector(dom.forgotModal);
  const closes = document.querySelectorAll(`[${dom.close}]`);

  closes.forEach((close) => {
    close.addEventListener('click', (event) => {
      if (event.target.hasAttribute(dom.close)) {
        modal.classList.add('hidden');
      }
    })
  })

  trigger && trigger.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });

  setupAddresses();
};

export default {
  setup,
};
