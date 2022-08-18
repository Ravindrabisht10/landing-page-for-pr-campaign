const getIDsInCart = () => {
  const lineItems = document.querySelectorAll(`[data-cart-item-base]`);
  return [...lineItems].map((item) => {
    return parseInt(item.getAttribute('data-cart-item-base'), 10);
  });
}

window.getRebuyProducts = (products) => {
  const items = getIDsInCart();

  return products.filter((product) => {
    const inCart = items.includes(product.selected_variant.id);
    return product.handle !== window.currentProduct && inCart === false;
  }).slice(0, 10);
};

document.addEventListener('rebuy.ready', function(event){
  window.resetAllCarousels();
  const api = new Yotpo.API(yotpo);
  api.refreshWidgets();

  const cartUpsells = document.querySelector(`[data-cart-upsells]`) || false;
  cartUpsells && cartUpsells.classList.remove('hidden');
});


window.hideRebuyTile = (product) => {
  const tile = document.querySelector(`[rebuy-product-tile="${product.handle}"]`) || false;
  tile && tile.parentNode.removeChild(tile);
};
