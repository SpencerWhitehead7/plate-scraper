import { RecipeData } from "../helpers"

import allrecipesRecipe from "./expectedRecipes/allrecipes"
import bettycrockerRecipe from "./expectedRecipes/bettycrocker"
import bonappetitRecipe from "./expectedRecipes/bonappetit"
import cookinglightRecipe from "./expectedRecipes/cookinglight"
import eatingwellRecipe from "./expectedRecipes/eatingwell"
import eatingwellFallbackOriginRecipe from "./expectedRecipes/eatingwellFallbackOrigin"
import epicuriousRecipe from "./expectedRecipes/epicurious"
import foodRecipe from "./expectedRecipes/food"
import food52Recipe from "./expectedRecipes/food52"
import foodandwineRecipe from "./expectedRecipes/foodandwine"
import foodnetworkRecipe from "./expectedRecipes/foodnetwork"
import jamieoliverRecipe from "./expectedRecipes/jamieoliver"
import myrecipesRecipe from "./expectedRecipes/myrecipes"
import seriouseatsRecipe from "./expectedRecipes/seriouseats"
import simplyrecipesRecipe from "./expectedRecipes/simplyrecipes"
import thekitchnRecipe from "./expectedRecipes/thekitchn"

export const expecteds: RecipeData[] = [
  {
    sourceSite: "allrecipes.com",
    sourceUrl: "https://www.allrecipes.com/recipe/22918/pop-cake/",
    text: allrecipesRecipe,
    title: "Pop Cake",
  },
  {
    sourceSite: "bettycrocker.com",
    sourceUrl:
      "https://www.bettycrocker.com/recipes/skillet-chicken-stroganoff/4966ef59-6380-49aa-89bf-5bf285b37a44",
    text: bettycrockerRecipe,
    title: "Skillet Chicken Stroganoff",
  },
  {
    sourceSite: "bonappetit.com",
    sourceUrl:
      "https://www.bonappetit.com/recipe/grilled-salmon-with-lemon-sesame-sauce",
    text: bonappetitRecipe,
    title: "Grilled Crispy-Skinned Salmon With Whole Lemon-Sesame Sauce",
  },
  {
    sourceSite: "cookinglight.com",
    sourceUrl:
      "https://www.cookinglight.com/recipes/grapefruit-campari-bars-shortbread-crust",
    text: cookinglightRecipe,
    title: "Grapefruit-Campari Bars with Shortbread Crust",
  },
  {
    sourceSite: "eatingwell.com",
    sourceUrl:
      "https://www.eatingwell.com/recipe/278567/shaved-artichoke-salad-with-shrimp/",
    text: eatingwellRecipe,
    title: "Shaved Artichoke Salad with Shrimp",
  },
  {
    sourceSite: "eatingwell.com",
    sourceUrl:
      "https://fallback-origin.eatingwell.com/recipe/278578/egyptian-lentil-soup/",
    text: eatingwellFallbackOriginRecipe,
    title: "Egyptian Lentil Soup",
  },
  {
    sourceSite: "epicurious.com",
    sourceUrl:
      "https://www.epicurious.com/recipes/food/views/iron-skillet-peach-crisp-56389711",
    text: epicuriousRecipe,
    title: "Iron-Skillet Peach Crisp",
  },
  {
    sourceSite: "food.com",
    sourceUrl:
      "https://www.food.com/recipe/sonic-strawberry-cheesecake-shake-122785",
    text: foodRecipe,
    title: "Sonic Strawberry Cheesecake Shake",
  },
  {
    sourceSite: "food52.com",
    sourceUrl: "https://food52.com/recipes/81226-espresso-caramel-sauce",
    text: food52Recipe,
    title: "Espresso Caramel Sauce",
  },
  {
    sourceSite: "foodandwine.com",
    sourceUrl:
      "https://www.foodandwine.com/recipes/classic-southern-fried-chicken",
    text: foodandwineRecipe,
    title: "Classic Southern Fried Chicken",
  },
  {
    sourceSite: "foodnetwork.com",
    sourceUrl:
      "https://www.foodnetwork.com/recipes/bobby-flay/perfectly-grilled-steak-recipe-1973350",
    text: foodnetworkRecipe,
    title: "Perfectly Grilled Steak",
  },
  {
    sourceSite: "jamieoliver.com",
    sourceUrl:
      "https://www.jamieoliver.com/recipes/eggs-recipes/amazing-yorkies/",
    text: jamieoliverRecipe,
    title: "Amazing Yorkies",
  },
  {
    sourceSite: "myrecipes.com",
    sourceUrl: "https://www.myrecipes.com/recipe/grapefruit-pound-cake",
    text: myrecipesRecipe,
    title: "Grapefruit Pound Cake",
  },
  {
    sourceSite: "seriouseats.com",
    sourceUrl:
      "https://www.seriouseats.com/recipes/2010/10/new-york-style-pizza.html",
    text: seriouseatsRecipe,
    title: "New York-Style Pizza Recipe",
  },
  {
    sourceSite: "simplyrecipes.com",
    sourceUrl:
      "https://www.simplyrecipes.com/recipes/grilled_salmon_with_peach_salsa/",
    text: simplyrecipesRecipe,
    title: "Grilled Salmon With Peach Salsa",
  },
  {
    sourceSite: "thekitchn.com",
    sourceUrl: "https://www.thekitchn.com/recipe-watermelon-mint-frose-233904",
    text: thekitchnRecipe,
    title: "Watermelon Mint Frosé",
  },
]
