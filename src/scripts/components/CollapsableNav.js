const dom = {
  triggers: 'data-collapse-nav-trigger',
};

const setNavs = (triggers, selectedTrigger) => {
  triggers.forEach((trigger) => {
    const sibling = trigger.nextElementSibling;
    if (selectedTrigger === trigger) {
      sibling.classList.toggle('is-open');
      trigger.classList.toggle('is-open');
    } else {
      sibling.classList.remove('is-open');
      trigger.classList.remove('is-open');
    }
  });
};

const setup = () => {
  const triggers = document.querySelectorAll(`[${dom.triggers}]`);
  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      setNavs(triggers, trigger);
    });
  });
};

export default {
  setup,
};
