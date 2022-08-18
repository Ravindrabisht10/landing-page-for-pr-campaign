const dom = {
  thumb: 'data-product-image-thumbnail',
  main: 'data-product-image',
  modal: 'data-product-image-modal',
  modalTrigger: 'data-product-image-trigger'
};

const moveImage = (direction) => {
  const modal = document.querySelector(`[${dom.modal}]`);
  const image = modal.querySelector('img');
  const src = image.getAttribute('src');

  const allImages = image.getAttribute('data-all-images').split(',');
  let index = allImages.indexOf(src);
  index += direction;
  if (index < 0) index = allImages.length - 1;
  if (index >= allImages.length) index = 0;

  const newSrc = allImages[index];
  image.setAttribute('src', newSrc);
  setTimeout(() => document.body.classList.add('no-scroll'), 10);
}

const openImageModal = (event) => {
  const modal = document.querySelector(`[${dom.modal}]`);
  const image = modal.querySelector('img');
  const src = event.target.getAttribute('src');
  modal.classList.add('open');
  image.setAttribute('src', src);

  setTimeout(() => document.body.classList.add('no-scroll'), 10);
};

const closeImageModal = (event) => {
  const modal = document.querySelector(`[${dom.modal}]`);

  if (event.target.hasAttribute(dom.modalTrigger)) {
    modal.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }
}

const setupZoom = () => {
  const mainImage = document.querySelector(`[${dom.main}]`);
  mainImage.addEventListener('click', openImageModal);

  const modalTriggers = document.querySelectorAll(`[${dom.modalTrigger}]`) || [];
  modalTriggers.forEach((trigger) => {
    trigger.addEventListener('click', closeImageModal);
  });

  const moveLeft = document.querySelector(`[data-move-left]`);
  const moveRight = document.querySelector(`[data-move-right]`);
  moveLeft.addEventListener('click', () => moveImage(-1));
  moveRight.addEventListener('click', () => moveImage(1));

  document.addEventListener('keydown', (event) => {
    if (event.keyCode === 37) moveImage(-1);
    if (event.keyCode === 39) moveImage(1);
  });
};

const setImage = (event) => {
  const src = event.target.getAttribute(dom.thumb);
  const mainImage = document.querySelector(`[${dom.main}]`);
  mainImage.setAttribute('src', src);

  const scrollTop = event.target.offsetTop;
  const scrollGallery = event.target.parentNode.parentNode;
  scrollGallery.scrollTo({
    top: scrollTop,
    behavior: 'smooth',
  })

  const thumbnails = document.querySelectorAll(`[${dom.thumb}]`);
  thumbnails.forEach((thumb) => {
    if (thumb === event.target) {
      thumb.parentNode.classList.add('product-gallery__thumbnail--selected');
    } else {
      thumb.parentNode.classList.remove('product-gallery__thumbnail--selected');
    }
  });
};

const setup = () => {
  const thumbnails = document.querySelectorAll(`[${dom.thumb}]`);
  thumbnails.forEach((thumb) => {
    thumb.addEventListener('click', setImage);
  });
};

export default {
  setup,
  setupZoom,
};
