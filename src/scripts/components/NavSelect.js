const dom = {
  select: 'data-nav-select',
};

const redirect = (event) => {
  const newURL = event.target.value;
  if (!newURL.startsWith('/') && !newURL.includes(location.hostname.includes)) {
    window.open(newURL, '_blank');
  } else {
    location.href = newURL;
  }
};

const setup = () => {
  const navSelects = document.querySelectorAll(`[${dom.select}]`);
  navSelects.forEach((select) => select.addEventListener('change', redirect));
};

export default {
  setup,
};
