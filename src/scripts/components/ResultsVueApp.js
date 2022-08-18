import SwiperSlider from '../components/SwiperSlider';

const getshowingredients = (result) => {
  const filteredIngredients = $.map(result[0].ingredients, (value, index) => {
    return [value];
  });

  const alphabetString = 'abcdefghijklmnopqrstuvwxyz';
  const alphabet = alphabetString.split('');
  const ingredientBatchesByIngredient = [];

  filteredIngredients.forEach((value) => {

    if(value.integrity_harvesttype.toUpperCase() == 'COG'){
      value.integrity_harvesttype = 'Certified Organic';
    }

    let ingredientPosition = ingredientBatchesByIngredient.map((event) => {
      return event.id;
    }).indexOf(value.ingredient_gaia3digit);

    if (ingredientPosition === -1) {
      ingredientBatchesByIngredient.push({
        id: value.ingredient_gaia3digit,
      });
      ingredientPosition = ingredientBatchesByIngredient.map((event) => {
        return event.id;
      }).indexOf(value.ingredient_gaia3digit);
      ingredientBatchesByIngredient[ingredientPosition].latin_name = value.latin_name;
      ingredientBatchesByIngredient[ingredientPosition].ingredientId = value.cms.id;
      ingredientBatchesByIngredient[ingredientPosition].slug = value.cms.slug;
      ingredientBatchesByIngredient[ingredientPosition].integrity_commonnames = value.integrity_commonnames;
      ingredientBatchesByIngredient[ingredientPosition].function = value.cms.function;
      ingredientBatchesByIngredient[ingredientPosition].description = value.cms.description;
      ingredientBatchesByIngredient[ingredientPosition].batches = [];
    }

    let position = ingredientBatchesByIngredient[ingredientPosition].batches.push(value);

    position -= 1;

    ingredientBatchesByIngredient[ingredientPosition].batches[position].alpha = alphabet[position];

    if (ingredientBatchesByIngredient[ingredientPosition].batches.length >= 2) {
      const showBatchNav = true;
    }
  });
  return ingredientBatchesByIngredient;
};

const getIngredientResults = (data, productData) => {
  const showingredients = getshowingredients([data]);
  return {
    props: ['productDataSet'],
    template: '#ingredients-template',
    data() {
      return {
        result: data,
        productData: [{
          product: productData
        }],
        ingredientBatches: showingredients,
      };
    },
    computed: {
      isproduct() {
        return this.productData.length;
      },
      isBatches() {
        return this.ingredientBatches.length;
      },
    },
    mounted() {
      SwiperSlider.setup();

      if (this.$refs.herbslider) {
        if (this.ingredientBatches.length < 6) {
          const sliderWrap = this.$refs.herbslider.querySelector(`.swiper-wrapper`);
          sliderWrap.classList.add('feature-herbs-carousel--desktop-centered');
        }
      }

      if (!this.$refs.batchSelect) return;
      const batchSelect = this.$refs.batchSelect[0] || false;
      if (!batchSelect) return;
      batchSelect.addEventListener('change', () => {
        const selected = `${batchSelect.selectedIndex}`;
        const allParts = document.querySelectorAll('.info-part[currentindex]');
        allParts.forEach((part) => {
          if (part.getAttribute('currentindex') === selected) {
            part.classList.remove('hidden');
          } else {
            part.classList.add('hidden');
          }
        });
      });
    }
  };
};

const getTestResults = (data, productData) => {
  return {
    props: ['searchid', 'results'],
    template: '#test-results-template',
    data() {
      return {
        result: [data],
        productData: productData,
      };
    },
    computed: {
      isresult() {
        return this.result.length;
      },
      isproduct() {
        return this.productData.length;
      },
      isstrength() {
        return JSON.stringify(this.result[0].cofc.potency_tests).indexOf('Strength');
      },
    },
    methods:{
      removetrailperiod(v){
        return removetrailperiod_(v);
      }
    }
  }
};

const buildRouter = (testResults, ingredientResults, data, productData) => {
  return new VueRouter({
    mode: 'history',
    base: '/pages/meet-your-herbs-results',
    routes: [
      {
        path: '/',
        components: {
          testresults: testResults,
          ingredients: ingredientResults,
        },
        props: {default: (route) => ({searchid: route.query.id})},
      },
    ],
  });
};

export const setupVueApp = (data, productData) => {

  const testResults = getTestResults(data, productData);
  const ingredientResults = getIngredientResults(data, productData);
  const router = buildRouter(testResults, ingredientResults, data, productData);

  new Vue({
    el: '#myhresults',
    router,
    components: {
      testResults,
      ingredients: ingredientResults,
    },
    data() {
      return {
        result: [],
        productData: [],
        productID: '',
        sku: '',
        ingredientBatches: [],
      };
    }
  });
}