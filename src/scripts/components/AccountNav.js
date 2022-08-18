const dom  = {
  accountLink: 'data-account-nav-link',
};

const setup = () => {
  const href = window.location.href;
  const links = document.querySelectorAll(`[${dom.accountLink}]`) || [];
  const activeLink = [...links].reverse().find((link) => {
    const linkURL = link.getAttribute(dom.accountLink);
    if (href.includes(linkURL)) {
      return true;
    }
    return false;
  }) || false;
  activeLink && activeLink.classList.add('active');

  const selectOptioons = document.querySelectorAll('#accountNav option') || [];
  let found = false;

  [...selectOptioons].reverse().forEach((option) => {
   
    if (href.includes(option.value) && found === false) {
      option.setAttribute('selected', 'selected');
      found = true;
    }
  });

};

export default {
  setup,
};
