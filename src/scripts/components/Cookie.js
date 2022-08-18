function createCookie(name, value, days) {
  let expires;
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = `; expires=${date.toGMTString()}`;
  } else {
    expires = '';
  }
  document.cookie = `${name}=${value}${expires}; path=/`;
}

function readCookie(name) {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let char = ca[i];
    while (char.charAt(0) === ' ') {
      char = char.substring(1, char.length);
    }
    if (char.indexOf(nameEQ) === 0) {
      return char.substring(nameEQ.length, char.length);
    }
  }
  return null;
}

const setup = () => {
  const banner = document.querySelector('[data-page-banner]') || false;
  const closeBanner = document.querySelectorAll('[data-close-cookies]') || [];

  if (readCookie('GDPRApproved') != 'true') {
    banner && banner.classList.remove('hidden');
  }

  closeBanner.forEach((close) => {
    close.addEventListener('click', (event) => {
      if (event.target.hasAttribute('data-set-cookie')) {
        createCookie('GDPRApproved', true, 365);
      }
      banner.classList.add('hidden');
    });
  });

  // $('.page-banner .accept').on('click touch', function(e) {
  //   e.preventDefault();
  //   createCookie('GDPRApproved', true, 365)
  //   $('.page-banner').addClass('hidden')
  // })

  // $('.page-banner .close').on('click touch', function(e) {
  //   e.preventDefault();
  //   $('.page-banner').addClass('hidden')
  // })
};

export default {
  setup,
};
