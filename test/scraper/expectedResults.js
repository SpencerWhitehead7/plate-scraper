const allrecipes0Recipe = require(`./expectedRecipes/allrecipes0`)
const allrecipes1Recipe = require(`./expectedRecipes/allrecipes1`)
const bettycrockerRecipe = require(`./expectedRecipes/bettycrocker`)
const bonappetitRecipe = require(`./expectedRecipes/bonappetit`)
const chowhoundRecipe = require(`./expectedRecipes/chowhound`)
const cookinglightRecipe = require(`./expectedRecipes/cookinglight`)
const eatingwellRecipe = require(`./expectedRecipes/eatingwell`)
const eatingwellFallbackOriginRecipe = require(`./expectedRecipes/eatingwellFallbackOrigin`)
const epicuriousRecipe = require(`./expectedRecipes/epicurious`)
const foodRecipe = require(`./expectedRecipes/food`)
// const food52Recipe = require('./food52')
const foodandwineRecipe = require(`./expectedRecipes/foodandwine`)
const foodnetworkRecipe = require(`./expectedRecipes/foodnetwork`)
const jamieoliverRecipe = require(`./expectedRecipes/jamieoliver`)
const myrecipesRecipe = require(`./expectedRecipes/myrecipes`)
const seriouseatsRecipe = require(`./expectedRecipes/seriouseats`)
const simplyrecipesRecipe = require(`./expectedRecipes/simplyrecipes`)
// const thekitchnRecipe = require(`./correct-recipes/thekitchn`)

module.exports = [
  {
    sourceSite: `allrecipes.com`,
    sourceUrl: `https://www.allrecipes.com/recipe/22918/pop-cake/`,
    title: `Pop Cake`,
    recipe: allrecipes0Recipe,
  },
  {
    sourceSite: `allrecipes.com`,
    sourceUrl: `https://www.allrecipes.com/recipe/6700/fabulous-homemade-bread/`,
    title: `Fabulous Homemade Bread`,
    recipe: allrecipes1Recipe,
  },
  {
    sourceSite: `bettycrocker.com`,
    sourceUrl: `https://www.bettycrocker.com/recipes/skillet-chicken-stroganoff/4966ef59-6380-49aa-89bf-5bf285b37a44`,
    title: `Skillet Chicken Stroganoff`,
    recipe: bettycrockerRecipe,
  },
  {
    sourceSite: `bonappetit.com`,
    sourceUrl: `https://www.bonappetit.com/recipe/grilled-salmon-with-lemon-sesame-sauce`,
    title: `Grilled Crispy-Skinned Salmon with Whole Lemon-Sesame Sauce`,
    recipe: bonappetitRecipe,
  },
  {
    sourceSite: `chowhound.com`,
    sourceUrl: `https://www.chowhound.com/recipes/slow-cooker-red-pepper-butternut-squash-soup-31117`,
    title: `Slow Cooker Butternut Squash and Red Pepper Soup`,
    recipe: chowhoundRecipe,
  },
  {
    sourceSite: `cookinglight.com`,
    sourceUrl: `https://www.cookinglight.com/recipes/grapefruit-campari-bars-shortbread-crust`,
    title: `Grapefruit-Campari Bars with Shortbread Crust`,
    recipe: cookinglightRecipe,
  },
  {
    sourceSite: `eatingwell.com`,
    sourceUrl: `https://www.eatingwell.com/recipe/278567/shaved-artichoke-salad-with-shrimp/`,
    title: `Shaved Artichoke Salad with Shrimp`,
    recipe: eatingwellRecipe,
  },
  {
    sourceSite: `eatingwell.com`,
    sourceUrl: `https://fallback-origin.eatingwell.com/recipe/278578/egyptian-lentil-soup/`,
    title: `Egyptian Lentil Soup`,
    recipe: eatingwellFallbackOriginRecipe,
  },
  {
    sourceSite: `epicurious.com`,
    sourceUrl: `https://www.epicurious.com/recipes/food/views/iron-skillet-peach-crisp-56389711`,
    title: `Iron-Skillet Peach Crisp`,
    recipe: epicuriousRecipe,
  },
  {
    sourceSite: `food.com`,
    sourceUrl: `https://www.food.com/recipe/sonic-strawberry-cheesecake-shake-122785`,
    title: `Sonic Strawberry Cheesecake Shake`,
    recipe: foodRecipe,
  },
  // add food52 here if I ever get it working
  {
    sourceSite: `foodandwine.com`,
    sourceUrl: `https://www.foodandwine.com/recipes/classic-southern-fried-chicken`,
    title: `Classic Southern Fried Chicken`,
    recipe: foodandwineRecipe,
  },
  {
    sourceSite: `foodnetwork.com`,
    sourceUrl: `https://www.foodnetwork.com/recipes/bobby-flay/perfectly-grilled-steak-recipe-1973350`,
    title: `Perfectly Grilled Steak`,
    recipe: foodnetworkRecipe,
  },
  {
    sourceSite: `jamieoliver.com`,
    sourceUrl: `https://www.jamieoliver.com/recipes/eggs-recipes/amazing-yorkies/`,
    title: `Amazing Yorkies`,
    recipe: jamieoliverRecipe,
  },
  {
    sourceSite: `myrecipes.com`,
    sourceUrl: `https://www.myrecipes.com/recipe/grapefruit-pound-cake`,
    title: `Grapefruit Pound Cake`,
    recipe: myrecipesRecipe,
  },
  {
    sourceSite: `seriouseats.com`,
    sourceUrl: `https://www.seriouseats.com/recipes/2010/10/new-york-style-pizza.html`,
    title: `New York-Style Pizza Recipe`,
    recipe: seriouseatsRecipe,
  },
  {
    sourceSite: `simplyrecipes.com`,
    sourceUrl: `https://www.simplyrecipes.com/recipes/grilled_salmon_with_peach_salsa/`,
    title: `Grilled Salmon with Peach Salsa`,
    recipe: simplyrecipesRecipe,
  },
  // {
  //   sourceSite: `thekitchn.com`,
  //   sourceUrl: `https://www.thekitchn.com/recipe-watermelon-mint-frose-233904`,
  //   title: `Watermelon Mint Frosé`,
  //   recipe: thekitchnRecipe,
  // },
]
