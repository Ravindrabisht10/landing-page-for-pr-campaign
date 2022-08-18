/*
 * Fetch the inventory levels for a product from the inventory API
 *
 * @param {string} productSku: the ID of the product to fetch
 *
 * @return {promise}: the promise of the fetch with all the response data included
 */

export const getIfsInventoryLevels = async (productSku) => {
  let url =
    "https://x66ix5nef4.execute-api.us-east-1.amazonaws.com/default/ifs_product_inventory";
  let params = `?skus=${productSku}`;
  url += params;
  let ifsData = await fetch(url)
    .then((res) => res.json())
    .then((data) => {
      return data
    })
    .catch((err) => console.error(err));
  return ifsData;
};
// export const fetchInventoryLevels = async (productSku) => {
//   return await fetch(`https://ifs-api-prod.gaiaherbs.com/api/v1/variant/inventory/get?catalog_no=${productSku}`, {
//     credentials: 'same-origin',
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   })
//     .then((blob) => blob.json());
// }
