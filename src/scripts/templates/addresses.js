import AccountNav from '../components/AccountNav.js';
import AccountForm from '../components/AccountForms.js';

document.addEventListener('DOMContentLoaded', () => {
  AccountNav.setup();
  AccountForm.setup();

  // Initialize each edit form's country/province selector
  $('.address-country-option').each(function() {
    const formId = $(this).data('form-id');
    const countrySelector = `AddressCountry_${formId}`;
    const provinceSelector = `AddressProvince_${formId}`;
    const containerSelector = `AddressProvinceContainer_${formId}`;

    new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
      hideElement: containerSelector,
    });

    new Shopify.CountryProvinceSelector(
      'AddressCountryNew',
      'AddressProvinceNew',
      {
        hideElement: 'AddressProvinceContainerNew',
      },
    );
  });

  $('.address-delete').on('click', function(event) {
    event.preventDefault();
    const $el = $(this);
    const formId = $el.data('form-id');
    const confirmMessage = $el.data('confirm-message');
    if (
      window.confirm(
        confirmMessage || 'Are you sure you wish to delete this address?',
      )
    ) {
      Shopify.postLink(`/account/addresses/${formId}`, {
        parameters: {_method: 'delete'},
      });
    }
  });
});