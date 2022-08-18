import { getURLParameter, addOrUpdateUrlParam } from '../utils/Helpers.js';

const dom = {
  letterTrigger: 'data-letter',
  herbArticle: 'data-first-letter',
};

const setVisibleHerbs = (event) => {
  const herbs = document.querySelectorAll(`[${dom.herbArticle}]`) || [];
  const triggers = document.querySelectorAll(`[${dom.letterTrigger}]`) || [];
  const selectedLetter = event.target.getAttribute(dom.letterTrigger);
  addOrUpdateUrlParam('herbs', selectedLetter);

  triggers.forEach((trigger) => {
    if (trigger === event.target) {
      trigger.classList.add('active');
    } else {
      trigger.classList.remove('active');
    }
  });

  herbs.forEach((herb) => {
    if (herb.getAttribute(dom.herbArticle) === selectedLetter ||
        selectedLetter === '') {
      herb.classList.remove('hidden');
    } else {
      herb.classList.add('hidden');
    }
  });
};

const setSelectedHerb = () => {
  const letter = getURLParameter('herbs') || false;
  if (!letter) return;
  const trigger = document.querySelector(`[${dom.letterTrigger}="${letter}"]`) || false;
  trigger && trigger.click();
};

const setup = () => {
  const triggers = document.querySelectorAll(`[${dom.letterTrigger}]`) || [];
  triggers.forEach((trigger) => trigger.addEventListener('click', setVisibleHerbs));

  setSelectedHerb();
};

export default {
  setup,
};