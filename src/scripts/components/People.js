const dom = {
  triggers: 'data-trigger-person',
  contents: 'data-carousel-trigger',
};

const setupPeopleSlider = () => {
  const triggers = document.querySelectorAll(`[${dom.triggers}]`);
  const contents = document.querySelectorAll(`[${dom.contents}]`);
  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const forPerson = trigger.getAttribute(dom.triggers);
      contents.forEach((content) => {
        if (content.getAttribute(dom.contents) === forPerson) {
          content.classList.remove('hidden');
        } else {
          content.classList.add('hidden');
        }
      });
      triggers.forEach((contentTrigger) => {
        if (trigger === contentTrigger) {
          contentTrigger.classList.add('active');
        } else {
          contentTrigger.classList.remove('active');
        }
      })
    });
  });
};


const setup = () => {
  setupPeopleSlider();
};

export default {
  setup,
};
