import { getIfsInventoryLevels } from "../utils/ProductInventory.js";

const dom = {
  supplementButton: "data-supplement-trigger",
  supplementModal: "data-supplement-modal",
  productType: "data-update-product-type",
  baseVariant: "data-update-variant",
  frequency: "data-buybox-frequency",
  frequencyWrap: "data-frequency-selector",
  quantityChange: "data-set-quantity",
  addToCart: "data-add-to-cart",
  itemPrice: "data-item-price",
  map: "data-product-map",
  quantity: "data-buybox-quantity",
  unit: "data-unit-type",
  sku: "data-variant-sku",
  oneTimePrice: "data-one-time-price",
  subPrice: "data-subscription-price",
  variantPrice: "data-variant-price",
  comparePrice: "data-compare-price",
  selectedSupply: "data-size-selected",
  supply: "data-supply",
  deliveryFrequency: "data-delivery-frequency",
  bundledSkus: "data-product-skus",
  variantAvailable: "data-variant-availability"
};
let variantAvailableObj = document.querySelector(`[${dom.variantAvailable}]`)
let variantObj = {}
if(variantAvailableObj) {
  variantObj = JSON.parse(variantAvailableObj.dataset.variantAvailability)
}

let thisPrice = 0;
let thisVariant = null;

const setFrequency = (event) => {
  const frequencyWrap = document.querySelector(`[${dom.frequencyWrap}]`);
  const type = event.target.value;
  if (type === "subscription") {
    frequencyWrap.classList.remove("hidden");
  } else {
    frequencyWrap.classList.add("hidden");
  }
};

const postAddToCart = (body) => {
  fetch("/cart/add.js", {
    body: JSON.stringify(body),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((blob) => blob.json())
    .then((data) => {
      window.toggleInlineCart(true);
    });
};

const addItemToCart = (event) => {
  const productURI = event.target.attributes["data-add-to-cart"].baseURI; //grab URI from PDP page
  const variantID = event.target.getAttribute(dom.addToCart);
  const itemPrice = event.target.getAttribute(dom.itemPrice);
  const rawMap = event.target.getAttribute(dom.map);
  const map = JSON.parse(rawMap);
  const quantityEl = document.querySelector(`[${dom.quantity}]`);
  const quantity = quantityEl.getAttribute(dom.quantity);
  const frequencyEl = document.querySelector(`[${dom.frequency}]`) || false;
  const frequency = frequencyEl ? parseInt(frequencyEl.value, 10) : false;
  const selectedType =
    document.querySelector(`input[name="purchase-type"]:checked`) || false;
  const body = { items: [] };
  const searchURI = document
    .getElementsByClassName("buybox__title")[0]
    .parentNode.getAttribute("href"); //grab URI from search result page
  const searchHref = window.location.href.slice(26, 32);

  //parse productURI to get the product endpoint
  const parsedURI = productURI.toString().slice(25);
  const productData = document.querySelectorAll(".buybox__title");
  let productHandle;
  let queryHandle = parsedURI;

  if (productData[0].parentNode.href) {
    productHandle = productData[0].parentNode.href.slice(25);
  }

  if (parsedURI == "/") {
    queryHandle = productHandle;
  }

  if (parsedURI.includes("collections")) {
    queryHandle = productHandle;
  }

  if (searchHref == "search") {
    queryHandle = searchURI;
  }

  jQuery.getJSON("/cart.js", function (cart) {
    var totalPrice = parseFloat((cart.total_price / 100).toFixed(2));

    if (thisPrice <= 0 || thisVariant != variantID) thisPrice = itemPrice;

    var cartTotal =
      parseFloat(thisPrice.replace(/[^.\d]/g, "")) * parseFloat(quantity) +
      totalPrice;

    // !!! this method checks inventory from admin
    if (selectedType.value === "subscription" && selectedType !== false) {
      const unit = selectedType.getAttribute(dom.unit);
      const frequencyID = map[parseInt(variantID, 10)].discount_variant_id;
      body.items.push({
        id: frequencyID,
        quantity: parseInt(quantity, 10),
        properties: {
          shipping_interval_frequency: frequency,
          shipping_interval_unit_type: unit,
        },
      });
    } else {
      body.items.push({
        id: parseInt(variantID, 10),
        quantity: parseInt(quantity, 10),
      });
    }

    if (freebiesList.length > 0 && cartTotal >= minPurchase) {
      var freeJsonObj = JSON.parse(JSON.stringify(freebiesList));
      var cartItems = cart.items;
      var existsCount = cartItems.some((item) => item.id === freeJsonObj[0].id);
      if (existsCount == false) {
        body.items.push({
          id: parseInt(freeJsonObj[0].id, 10),
          quantity: parseInt(1, 10),
        });
      }
    }

    thisPrice = 0;
    thisVariant = null;

    jQuery.getJSON(`${queryHandle}`, function (product) {
      const tagsArr = product.product.tags.replace(/\s/g, "").split(",");
      if (!tagsArr.includes("badge-final-sale")) {
        postAddToCart(body);
      } else {
        outletModal(body);
      }
    });
  });
};

const outletModal = (data) => {
  var ntModalDiv = document.createElement("div");
  ntModalDiv.id = "nt_modal";
  ntModalDiv.class = "modal-box";
  ntModalDiv.innerHTML =
    '<div id="nt-disclaimer-modal" class="nt-modal">\
  <div class="nt-modal-content">\
    <div class="nt-modal-header">DISCLAIMER</div>\
      <div class="nt-modal-body">\
      Gaia Herbs outlet products may have minor imperfections that do not affect purity, potency, or integrity. All outlet items are final sale and are not eligible for returns or exchanges. Please hit “Accept” to add to your cart.\
      </div>\
      <div id="checkbox-container">\
        <input id="accept-checkbox" type="checkbox">Check if you agree</input>\
      </div>\
      <div id="nt-modal-buttons">\
        <button href="" id="btn-disagree" class="nt-modal-btn">DECLINE</button>\
        <button href="" id="btn-agree" class="nt-modal-btn" disabled="disabled">ACCEPT</button>\
      </div>\
    </div>\
  </div>';

  const pageLocation = window.location.href.slice(26, 36);

  let pageTag;
  if (pageLocation.includes("products")) {
    pageTag = "pdp";
  } else {
    pageTag = "quickshop";
  }

  /********* PDP Modal ***********/
  const outletOverlay = document.getElementById("outlet-overlay");
  outletOverlay.setAttribute("class", "outlet-overlay-active");

  if (pageTag === "pdp") {
    const mainGrid = document.getElementsByClassName("product-main-grid");
    const modalContainer = document.getElementById("outlet-modal-container");
    const stickyATC = document.getElementsByClassName("button--sticky-atc");
    stickyATC[0].classList.add("hidden");
    mainGrid[0].classList.add("hidden");
    modalContainer.setAttribute("class", "modal-active");
    modalContainer.appendChild(ntModalDiv);

    window.scrollTo(0, 0);

    const checkBox = document.getElementById("accept-checkbox");
    const modalAcceptBtn = document.getElementById("btn-agree");
    const modalDenyBtn = document.getElementById("btn-disagree");
    if (checkBox) {
      checkBox.onclick = () => {
        if (checkBox.checked) {
          modalAcceptBtn.disabled = false;
        } else {
          modalAcceptBtn.disabled = true;
        }
      };
    }

    modalDenyBtn.onclick = () => {
      outletOverlay.removeAttribute("class");
      mainGrid[0].classList.remove("hidden");
      modalContainer.removeChild(ntModalDiv);
      modalContainer.removeAttribute("class");
      stickyATC[0].classList.remove("hidden");
      enableScroll();
    };

    modalAcceptBtn.onclick = () => {
      outletOverlay.removeAttribute("class");
      mainGrid[0].classList.remove("hidden");
      modalContainer.removeChild(ntModalDiv);
      modalContainer.removeAttribute("class");
      stickyATC[0].classList.remove("hidden");
      postAddToCart(data);
      enableScroll();
    };
  }

  /*********** QuickShop Modal ************/

  if (pageTag === "quickshop") {
    const quickContent = document.getElementsByClassName("quickshop");
    quickContent[0].classList.toggle("open");
    outletOverlay.appendChild(ntModalDiv);
    const parentContainer = document.getElementById("nt_modal");
    parentContainer.setAttribute("class", "quickbuy-modal");

    const checkBox = document.getElementById("accept-checkbox");
    const modalAcceptBtn = document.getElementById("btn-agree");
    const modalDenyBtn = document.getElementById("btn-disagree");
    if (checkBox) {
      checkBox.onclick = () => {
        if (checkBox.checked) {
          modalAcceptBtn.disabled = false;
        } else {
          modalAcceptBtn.disabled = true;
        }
      };
    }

    modalDenyBtn.onclick = () => {
      outletOverlay.removeAttribute("class");
      outletOverlay.removeChild(ntModalDiv);
      parentContainer.removeAttribute("class");
    };

    modalAcceptBtn.onclick = () => {
      outletOverlay.removeAttribute("class");
      outletOverlay.removeChild(ntModalDiv);
      parentContainer.removeAttribute("class");
      postAddToCart(data);
    };
  }
};

const setNewPrice = (price, subPrice, comparePrice = false) => {
  const basePrices = document.querySelectorAll(`[${dom.oneTimePrice}]`);
  const subPriceEl = document.querySelector(`[${dom.subPrice}]`) || false;

  basePrices.forEach((basePrice) => {
    if (comparePrice) {
      basePrice.innerHTML = `
        <span class="price price--sale">$${(price / 100.0).toFixed(2)}</span>
        <span class="price price--old">$${(comparePrice / 100.0).toFixed(
          2
        )}</span>`;
    } else {
      basePrice.innerHTML = `$${(price / 100.0).toFixed(2)}`;
    }
  });

  if (!subPriceEl) return;

  if (comparePrice) {
    subPriceEl.innerHTML = `
        <span class="price price--sale">$${subPrice}</span>
        <span class="price price--old">$${(comparePrice / 100.0).toFixed(
          2
        )}</span>`;
  } else {
    subPriceEl.innerHTML = `$${subPrice}`;
  }
};

const setSelectedSupply = (variantButton) => {
  const supply = variantButton.getAttribute(dom.supply);
  const supplyEl = document.querySelector(`[${dom.selectedSupply}]`);
  supplyEl.innerHTML = supply;
};

/*
 * sets the base variant that will get added to the cart
 */
const setVariant = (event) => {
  const addToCart = document.querySelector(`[${dom.addToCart}]`);
  const variantID = event.target.getAttribute(dom.baseVariant);
  const priceString = event.target.getAttribute(dom.variantPrice);
  const comparePriceString = event.target.getAttribute(dom.comparePrice);
  const deliveryFrequency =
    event.target.getAttribute(dom.deliveryFrequency) || false;
  const priceMapEl = document.querySelector(`[${dom.map}]`);
  const priceMapRaw = priceMapEl.getAttribute(dom.map) || false;
  const priceMap = priceMapRaw ? JSON.parse(priceMapRaw) : false;
  const subPricing = priceMap ? priceMap[`${variantID}`] : false;

  const price = parseInt(priceString, 10);
  const comparePrice = parseInt(comparePriceString, 10);

  const frequency = document.querySelector(`[${dom.frequency}]`) || false;
  if (deliveryFrequency && frequency) {
    frequency.value = parseInt(deliveryFrequency, 10);
  }

  thisPrice = (price / 100).toFixed(2);
  thisVariant = variantID;

  addToCart.setAttribute(dom.addToCart, variantID);
  addToCart.removeAttribute("disabled");
  addToCart.innerHTML = "Add To Cart";
  setNewPrice(
    price,
    subPricing ? subPricing.discount_variant_price : 0,
    comparePrice
  );
  setSelectedSupply(event.target);

  const variantSelectors = document.querySelectorAll(`[${dom.baseVariant}]`);
  variantSelectors.forEach((selector) => {
    if (selector === event.target) {
      selector.classList.add("selected");
    } else {
      selector.classList.remove("selected");
    }
  });
};

const setQuantity = (event) => {
  const quantityEl = document.querySelector(`[${dom.quantity}]`);
  const toChangeBy = event.target.getAttribute(dom.quantityChange);
  const currentQuantity = quantityEl.getAttribute(dom.quantity);
  let newQuantity = parseInt(toChangeBy, 10) + parseInt(currentQuantity, 10);
  newQuantity = Math.max(1, newQuantity);
  quantityEl.setAttribute(dom.quantity, newQuantity);
  quantityEl.innerHTML = newQuantity;
};

// Checks Shopify inventory levels in the event of IFS failure

const backupInventoryCheck = (id) => {
  let result
  id = parseInt(id)
  for(let v in variantObj) {
    if(id === v.id){
      if(v.available) {
        result = true
      } else {
        result = false
      }
    }
  }
  return result
}


/*
 * Sets a variant's availablity based on inventory levels
 *
 * @param {Node} variant: the variant selector to update
 * @param {Object} response: a response object from the inventory API
 */
const setVariantAvailablility = (variant, response, vLength, ii) => {
  const addToCart = document.querySelector(`[${dom.addToCart}]`);
  const defaultVariant = addToCart.getAttribute(dom.addToCart);
  const variantID = variant.getAttribute(dom.baseVariant);
  // const atcBtn = document.querySelectory('#atc-btn')
  let isAvailable;

  if(typeof response !== 'number') {
    isAvailable = backupInventoryCheck(variantID)
  } else if (response > 0) {
    isAvailable = true
  } else {
    isAvailable = false
  }

  if (isAvailable == false) {
    variant.setAttribute("disabled", "disabled");
    variant.classList.remove("selected");
    addToCart.innerHTML = "Out of Stock";
    addToCart.setAttribute("disabled", "disabled");
  }

  for(let v in variantObj) {
    if(v.available) {
      addToCart.removeAttribute('disabled')
      addToCart.innerHTML = 'Add To Cart'
    }
  }


  if (vLength - 1 == ii) {
    let myButtons = document.querySelectorAll("[data-variant-sku]");
    const d1 = myButtons[0].getAttribute("disabled");
    if (d1 != "disabled") {
      //setTimeout( myButtons[0].click() , 700);
      addToCart.innerHTML = "Add To Cart";
      addToCart.removeAttribute("disabled");
    }
  }
};

/*
 * Toggles the supplements/ingredients modal
 */
const toggleSupplements = () => {
  const supplementModal =
    document.querySelector(`[${dom.supplementModal}]`) || false;
  supplementModal && supplementModal.classList.toggle("open");
};

/*
 * Closes the supplements/ingredients modal
 */
const closeSupplements = (event) => {
  const supplementModal =
    document.querySelector(`[${dom.supplementModal}]`) || false;
  if (supplementModal && event.target === supplementModal) {
    supplementModal.classList.remove("open");
  }
};

const quickAddToCart = (query, product) => {
  const selectorEl =
    document.querySelector(`[${query}="${product.handle}"]`) || false;
  const idToPass = selectorEl ? selectorEl.value : product.selected_variant.id;
  postAddToCart({
    items: [
      {
        id: idToPass,
        quantity: 1,
      },
    ],
  });
};

/*
 *  Check inventory of bundled products
 */

const handleBundles = (dataElement) => {
  let inStock = 1;
  if (dataElement) {
    let productSkus = dataElement.dataset.productSkus.split(",");
    productSkus.length > 1 &&
      productSkus.map((s) => {
        getIfsInventoryLevels(s).then((res) => {
          res < 1 && (inStock = 0);
        });
      });
    return inStock;
  }
};

const setAvailableVariant = () => {
  let setID
  const variantEls = document.querySelectorAll('.variant_selectors')
  // set id for the first available variant
  for(let v in variantObj) {
    if(v.available){
      setID = v.id
      break
    }
  }
  // set the first available variant to selected
  for(let x of variantEls) {
    let varID = x.dataset.updateVariant
    if(setID == varID) {
      x.attributes.class.textContent += ' selected'
    }
  }
}

/*
 * General buybox setup
 */
const setup = () => {
  window.quickAddToCart = quickAddToCart;

  const dataElement = document.querySelector(`[${dom.bundledSkus}]`);
  const productSkus = dataElement.dataset.productSkus.split(",").length;

  const supplementModal =
    document.querySelector(`[${dom.supplementModal}]`) || false;
  const supplementTriggers =
    document.querySelectorAll(`[${dom.supplementButton}]`) || [];

  supplementTriggers.forEach((trigger) =>
    trigger.addEventListener("click", toggleSupplements)
  );
  supplementModal &&
    supplementModal.addEventListener("click", closeSupplements);

  const typeRadios = document.querySelectorAll(`[${dom.productType}]`);
  typeRadios.forEach((radio) => radio.addEventListener("change", setFrequency));

  const addToCart = document.querySelector(`[${dom.addToCart}]`) || false;

  addToCart && addToCart.addEventListener("click", addItemToCart);

  const variantSelectors = document.querySelectorAll(`[${dom.baseVariant}]`) || [];
  const vLength = variantSelectors.length;

  variantSelectors.forEach((variant, ii) => {
    if (productSkus < 2) {
      variant.addEventListener("click", setVariant);
      const variantSku = variant.getAttribute(dom.sku);
      getIfsInventoryLevels(variantSku).then((response) => {
        setVariantAvailablility(variant, response, vLength, ii);
      });
    } else {
      const bundleInStock = handleBundles(dataElement);
      // const bundleInStock = 0;
      setVariantAvailablility(variant, bundleInStock, vLength, ii);
    }
  });
  const quantityChangers =
    document.querySelectorAll(`[${dom.quantityChange}]`) || [];
  quantityChangers.forEach((button) =>
    button.addEventListener("click", setQuantity)
  );

  setAvailableVariant()
};

export default {
  setup,
};