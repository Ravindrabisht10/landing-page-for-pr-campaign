const dom = {
  inlineCart: '.inline-cart',
  cartTrigger: 'data-toggle-inline-cart',
  checkoutButton: 'data-checkout-link',
  quantity: 'data-quantity',
  updateItem: 'data-update-item',
  shippingUnit: 'data-subscription-unit',
  defaultFrequency: 'data-default-frequency',
  originalID: 'data-update-cart-item',
  upgradeItem: 'data-upgrade-to-subscription',
  map: 'data-new-subscription-map',
  currentQuantity: 'data-current-quantity',
  subShipping: 'data-free-shipping'
};

const updateCart = (updateStr) => {
  fetch(`/cart/update.js?${updateStr}`, {
    method: 'POST',
  })
  .then((blob) => blob.json())
  .then((data) => {
    updateInlineCart();
  });
}



const calcFreeShipping = () => {
  const cartTotal = document.getElementById('cart-price').innerText;
  const textDisplay = document.getElementById('free-ship-message');
  const progressBar = document.getElementById('shipping-progress-bar');
  
  const cartPrice = parseInt(cartTotal);
  const priceDiff = Math.round((4900 - cartPrice) / 100);
  

  const text = `You're $${priceDiff} away from free shipping!`
  let progressPercentage = Math.round(parseFloat((cartPrice / 4900) * 100));
  
  if(!textDisplay){
    progressPercentage = 100;
  } else {
    textDisplay.innerText = text;
  }


  progressBar.setAttribute('value',  progressPercentage);
  
}


const reChargeProcessCart = () => {
  function get_cookie(name){ return( document.cookie.match('(^|; )'+name+'=([^;]*)')||0 )[2] }
  var token = get_cookie('cart');
  const hasSubProduct = document.querySelectorAll('[data-product-is-subscription]') || [];
  if (!token || hasSubProduct.length === 0) return '/checkout/';
  try {
    var ga_linker = ga.getAll()[0].get('linkerParam');
  } catch(err) {
    var ga_linker =''
  }
  return "https://checkout.rechargeapps.com/r/checkout?myshopify_domain=" + window.eHouse.shop + "&cart_token=" + token + "&" + ga_linker;
}

/*
 * sets the checkout button URL for the inline cart
 */
const setCheckoutURL = () => {
  const url = reChargeProcessCart();
  const checkoutButton = document.querySelector(`[${dom.checkoutButton}]`) || false;
  checkoutButton && checkoutButton.setAttribute('href', url);
};

/*
 * Closes the inline cart
 */
const closeInlineCart = () => {
  const inlineCart = document.querySelector(dom.inlineCart);
  inlineCart.classList.remove('open');
  window.setBodyScroll();

  const cartUpsells = document.querySelector(`[data-cart-upsells]`) || false;
  cartUpsells && cartUpsells.classList.add('hidden');
};

/******** Adds GWP if there is a subscription item in cart JO 01-18-2022 GH-988********/

const gwpSubscription = () => {
  let cartHasSub = document.querySelectorAll('[data-product-is-subscription]') || [];
  const inlineCart = document.querySelector(dom.inlineCart);
  
  let addGWP = false;
  let freeJsonObj = '';
  let freeId = null;
  
  if(freebiesList.length > 0){
    freeJsonObj = JSON.parse(JSON.stringify(freebiesList));
    freeId = freeJsonObj[0].id;
  }

  /***** On/Off switch for GWP w/ subscription*******/
  // if(cartHasSub.length > 0){
  //   addGWP = true;
  // }
  /***** End On/Off switch for GWP w/ subscription*******/

  let removeGWP = `&updates[${freeId}]=${parseInt(0, 10)}`;

  if(freebiesList.length > 0 && freeId != null){
    jQuery.getJSON('/cart.js', (cart) => {
      let cartItems = cart.items;
      let existsCount = cartItems.some(item => item.id === freeId);

      if(freebiesList.length > 0 && addGWP == true && existsCount == false){
        fetch('/cart/add.js', {
          body: JSON.stringify({
            id: parseInt(freeId, 10),
            quantity: parseInt(1, 10),
          }),
          method: 'POST',
          headers: {
            'Content-Type':'application/json'
          }
        })
        .then((blob) => blob.json())
        .then((data) => {
          window.toggleInlineCart(true);
        })
      } else if (addGWP == false && existsCount == true){
        fetch(`/cart/update.js?${removeGWP}`, {
          method: 'POST',
        })
        .then((blob) => blob.json())
        .then((data) => {
          updateInlineCart();
        })
      }
    })
  }
}

/******* ADD GWP TO SUBSCRIPTION CART **********/

/*
 * Updates the contents of the inline cart
 */

const updateInlineCart = () => {
  // document.addEventListener('rebuy:cart.change', () => {
  //   widget.getWidgetProducts()

  const inlineCart = document.querySelector(dom.inlineCart);
  // update the inline cart with any new updates
  fetch('/?section_id=inline-cart')
    .then((blob) => blob.text())
    .then((section) => {

      const frag = document.createRange().createContextualFragment(section);

      inlineCart.innerHTML = frag.firstChild.innerHTML;
      inlineCart.classList.remove('loading');
      gwpSubscription();
      setCheckoutURL();
      calcFreeShipping();
      fetch('/cart.js')
        .then((blob) => blob.json())
        .then((response) => {
          const cartCounts = document.querySelectorAll('[data-cart-render="item_count"]');
          cartCounts.forEach((count) => {
            const parent = count.parentNode;
            if (response.item_count === 0) {
              parent.style.opacity = 0;
            } else {
              parent.style.opacity = 1;
              count.innerHTML = response.item_count;
            }
          });
        })
        .catch((err) => {
          console.error(err)
        })
    })
    .catch((err) => {
      console.error(err)
    })
  // })
}

/*
 * Toggles whether the inline cart is open
 */
const toggleInlineCart = (forceOpen = false) => {
  const inlineCart = document.querySelector(dom.inlineCart);
  if (forceOpen === true) {
    inlineCart.classList.add('open');
  } else {
    inlineCart.classList.toggle('open');
  }
  updateInlineCart();
  window.closeQuickshop();
  window.setBodyScroll();

  const cartUpsells = document.querySelector(`[data-cart-upsells]`) || false;
  cartUpsells && cartUpsells.classList.add('hidden');
};

/*
 * Removes an old item and adds a new item to cart
 *
 * @param {number}: the ID of the product to remove
 * @param {number}: the ID of the product to add (optional)
 * @param {number}: the quantity of the product to add (optional)
 */
const upgradeItem = (removeID, newID=false, quantity=false) => {

  const endpoint = newID ? `/cart/update.js?updates[${removeID}]=0&updates[${newID}]=${quantity}` : `/cart/update.js?updates[${removeID}]=0`;
  fetch(endpoint, {
    method: 'POST'
  })
    .then((blob) => blob.json())
    .then((data) => {
      updateInlineCart();
    });
};

/*
 * Updates an item in the cart
 *
 * @param {node}: the target button clicked that contains quantity/product info
 */
const updateItem = (button) => {

  const inlineCart = document.querySelector(dom.inlineCart);
  inlineCart.classList.add('loading');

  const variant = button.getAttribute(dom.updateItem);
  const amount = button.getAttribute(dom.quantity);

  // remove delete cart item
  var itemCount = document.querySelectorAll('.inline-cart__products .line-item').length;

  var freeJsonObj = '';
  var freeId = null;


  //freebies list gets populated when product is added to Freebies collection
  if(freebiesList.length>0){
    freeJsonObj = JSON.parse(JSON.stringify(freebiesList));
    freeId = freeJsonObj[0].id;
  }



  var checkoutButton = document.querySelector('a[data-checkout-link]');
  var cartTotal = parseFloat(checkoutButton.innerHTML.replace(/[^.\d]/g, ''));
  var thisPrice = button.closest('.line-item').dataset.cartItemPrice;
  thisPrice = parseFloat(thisPrice.replace(/[^.\d]/g, ''));
  var btnType = button.innerHTML.trim();
  var addGift = false;
  var myCartTotal;


  if(btnType=='+'){
    myCartTotal = (cartTotal + thisPrice).toFixed(2);

  }else if(btnType=='-'){
    myCartTotal = (cartTotal - thisPrice).toFixed(2);

  }else{
    myCartTotal = (cartTotal - thisPrice).toFixed(2);

   }
  /**********  GWP Threshold Switch **************/
  //  if(myCartTotal > minPurchase){
  //    addGift = true;
  //  }
  /*********  End GWP Threshold Switch************/


  var updateStr = `updates[${variant}]=${parseInt(amount, 10)}`;
  if(variant != freeId && freeId != null){
    jQuery.getJSON('/cart.js', function(cart) {
      var cartItems = cart.items;
      var existsCount = cartItems.some(item => item.id === freeId)


      if( existsCount && freebiesList.length>0 && addGift==false){
        // append string free object if free is not present

        if(existsCount==true){
          updateStr += `&updates[${freeId}]=${parseInt(0, 10)}`;
        }
      }


      if(freebiesList.length>0 && addGift==true && existsCount==false){

        fetch('/cart/add.js', {
          body: JSON.stringify({
          id: parseInt(freeId, 10),
          quantity: parseInt(1, 10),
        }),
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((blob) => blob.json())
        .then((data) => {
          window.toggleInlineCart(true);
        
          updateCart(updateStr);

        })

      }else{
      
        updateCart(updateStr);
      }

    });
  }else{
  
    updateCart(updateStr);
  }


};

/*
 * Adds a new subscription to the cart
 *
 * @param {number}: ID of the variant to add subscription for
 * @param {number}: frequency of the subscription
 * @param {string}: unit type the subscription is in
 * @param {function}: optional callback fired once subscription is added
 */
const addSubscription = (variantID, newFrequency, unit, quantity, callback=false) => {
  fetch('/cart/add.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      items: [{
        "id": variantID,
        "quantity": quantity,
        "properties": {
          "shipping_interval_frequency": newFrequency,
          "shipping_interval_unit_type": unit
        }
      }]
    })
  })
    .then((blob) => blob.json())
    .then((data) => {
      if (callback) {
        callback()
      } else {
        updateInlineCart();
      }
    });
}

/*
 * Updates a subscription frequency, or downgrades to a one time purchase
 */
const variantFrequencyUpdated = (event) => {
  const inlineCart = document.querySelector(dom.inlineCart);
  inlineCart.classList.add('loading');

  const newFrequency = event.target.value;
  const quantity = event.target.getAttribute(dom.currentQuantity);
  const unit = event.target.getAttribute(dom.shippingUnit);
  const variantID = event.target.getAttribute(dom.originalID);
  const rawMap = event.target.getAttribute(dom.map);
  const map = JSON.parse(rawMap);

  if (newFrequency === 'one-time') {
    const newItem = Object.entries(map).find((entry) => {
      return entry[1]['discount_variant_id'] === parseInt(variantID, 10);
    });
    upgradeItem(variantID, newItem[0], quantity);
  } else {
    fetch(`/cart/update.js?updates[${variantID}]=0`)
      .then((response) => {
        addSubscription(variantID, newFrequency, unit, quantity);
      })
  }
}

/*
 * Upgrades a one time purchase to a subscription
 */
const upgradeToSubscription = (event) => {
  const inlineCart = document.querySelector(dom.inlineCart);
  inlineCart.classList.add('loading');

  const toRemove = event.target.getAttribute(dom.upgradeItem);
  const unit = event.target.getAttribute(dom.shippingUnit);
  const frequency = event.target.getAttribute(dom.defaultFrequency);
  const rawMap = event.target.getAttribute(dom.map);
  const map = JSON.parse(rawMap);
  const upgradeTo = map[toRemove];
  const quantity = event.target.getAttribute(dom.currentQuantity);

  addSubscription(upgradeTo.discount_variant_id, frequency, unit, quantity, () => {
    upgradeItem(toRemove);
  });
};

/*
 * Description
 *
 * @param {type} name: description
 *
 * @return {type}: description
 */
const checkOpenInlineCart = () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('open_cart') && urlParams.get('open_cart') === 'true') {
    toggleInlineCart();
  }
}

/*
 * General setup for event listeners for the inline cart
 */
const setup = () => {
  const inlineCart = document.querySelector(dom.inlineCart);
  const toggles = document.querySelectorAll(`[${dom.cartTrigger}]`);

  document.addEventListener('keydown', (event) => {
    if (event.keyCode == 27) closeInlineCart();
  });

  document.addEventListener('click', (event) => {
    if (event.target.hasAttribute(dom.cartTrigger)) {
      toggleInlineCart();
    }
    else if (event.target.hasAttribute(dom.updateItem)) {
      updateItem(event.target);
    }
    else if (event.target.hasAttribute(dom.upgradeItem)) {
      upgradeToSubscription(event);
    }
    // check if clicking outside the mobile cart and close if so
    else if (inlineCart != event.target && !inlineCart.contains(event.target)) {
      closeInlineCart();
    }
  });

  window.updateInlineCart = updateInlineCart;
  window.variantFrequencyUpdated = variantFrequencyUpdated;
  window.toggleInlineCart = toggleInlineCart;
  window.setCheckoutURL = setCheckoutURL;
  checkOpenInlineCart();
};

export default {
  setup,
};
