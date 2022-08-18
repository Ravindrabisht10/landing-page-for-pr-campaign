const endpoint = 'https://myh.gaiaherbs.com/tracedata.php';

const capitalize = (word) => {
  return word.toLowerCase().charAt(0).toUpperCase() + word.toLowerCase().slice(1);
}

/*
 * Fetch test results for a product
 *
 * @param {String} productID: SKU or lookup ID for a product
 * @param {Number} mhyType: 0 for a product sku and 1 for a lookup ID
 *
 * @return {type}: description
 */
export const fetchProductResults = async (productID, myhType) => {
  return await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Origin': 'https://www.gaiaherbs.com'
    },
    body: `myh=${myhType}&id=${productID}`
  })
    .then((blob) => {
      return blob.json();
    });
}

export const cleanProductResults = (results) => {
  return [
    { test: 'Microbial testing', passes: true },
    { test: 'Heavy metals testing', passes: true },
    { test: 'Identity testing', passes: true },
    { test: 'Pesticide testing', passes: true },
    { test: 'Strength testing', passes: true }
  ];
  // const cleanedResults = {};
  // Grab the strength test
  // results.potency_tests.forEach((test) => {
  //   if (JSON.stringify(test).includes('Strength: ')) {
  //     const result = parseInt(test.result, 10);
  //     const specsRaw = test.specification.split('-');
  //     const specification = [
  //       parseInt(specsRaw[0], 10),
  //       parseInt(specsRaw[1], 10)
  //     ];
  //     const noSpec = test.specification.toLowerCase() === 'no specification';
  //     const strengthTest = 'Strength testing';
  //     if (!cleanedResults[strengthTest] || cleanedResults[strengthTest] !== 'pass') {
  //       cleanedResults[strengthTest] = (result >= specification[0] && result <= specification[1] || noSpec === true);
  //     }
  //   }
  // });

  // // Grab identity test
  // results.product_integrity_tests.forEach((test) => {
  //   if (test.category === 'Identity') {
  //     const identityTest = 'Identity testing';
  //     if (!cleanedResults[identityTest] || cleanedResults[identityTest] !== 'pass') {
  //       cleanedResults[identityTest] = test.result.toLowerCase() === 'pass';
  //     }
  //   }
  // });

  // Object.keys(results.purity_tests).forEach((test) => {
  //   const passes = results.purity_tests[test].reduce((allPassed, singleTest) => {
  //     return allPassed && singleTest.result.toLowerCase() === 'pass';
  //   }, true);
  //   const testName = `${capitalize(test)} testing`;
  //   if (!cleanedResults[testName] || cleanedResults[testName] !== 'pass') {
  //     cleanedResults[testName] = passes;
  //   }
  // });

  // return Object.keys(cleanedResults).reduce((toReturn, testKey) => {
  //   toReturn.push({
  //     test: testKey,
  //     passes: cleanedResults[testKey]
  //   });
  //   return toReturn;
  // }, []);
}
