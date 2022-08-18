export const getURLParameter = (param) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

export const addOrUpdateUrlParam = (name, value) => {
  let href = window.location.href;
  let regex = new RegExp("[&\\?]" + name + "=");

  if (regex.test(href)) {
    if ([null, '', false].includes(value)) {
      regex = new RegExp("([&\\?])" + name + "=.");
      let newurl = href.replace(regex, "$1");
      if (newurl.endsWith('?') || newurl.endsWith('&')) {
        newurl = newurl.slice(0, -1);
      }
      history.replaceState({}, null, newurl);
    } else {
      regex = new RegExp("([&\\?])" + name + "=.");
      const newurl = href.replace(regex, `$1${name}=${value}`);
      history.replaceState({}, null, href.replace(regex, "$1" + name + "=" + value));
    }
  } else {
    const char = href.indexOf("?") > -1 ? '&' : '?';
    if (value === null) {
      history.replaceState({}, null, href.replace(`${name}=`, ''));
    } else {
      history.replaceState({}, null, href + char + name + "=" + value);
    }
  }
}

export const setupScrollTos = () => {
  const scrollTos = document.querySelectorAll('[scrollto]');
  scrollTos.forEach((scrollTo) => {
    scrollTo.addEventListener('click', (event) => {
      event.preventDefault();
      const id = scrollTo.getAttribute('scrollto');
      const toScrollTo = document.querySelector(`#${id}`) || false;
      if (toScrollTo) {
        const header = document.querySelector(`.page-header`);
        const height = header.clientHeight;
        const rect = toScrollTo.getBoundingClientRect();
        const position = rect.top + window.innerHeight - rect.height - height;
        window.scrollTo({
          top: position,
          behavior: 'smooth'
        })
      }
    })
  })
}