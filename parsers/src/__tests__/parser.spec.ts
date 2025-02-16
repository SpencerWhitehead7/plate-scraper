import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { load } from "cheerio"

import { RecipeData, selectParser } from "../index"
import {
  allrecipes as allrecipesRecipe,
  bonappetit as bonappetitRecipe,
  budgetbytes as budgetbytesRecipe,
  cookingnytimes as cookingnytimesRecipe,
  delish as delishRecipe,
  eatingwell as eatingwellRecipe,
  epicurious as epicuriousRecipe,
  food as foodRecipe,
  food52 as food52Recipe,
  foodandwine as foodandwineRecipe,
  foodnetwork as foodnetworkRecipe,
  seriouseats as seriouseatsRecipe,
  simplyrecipes as simplyrecipesRecipe,
  tasty as tastyRecipe,
  thekitchn as thekitchnRecipe,
} from "./expectedRecipes"

void describe("Parsers", async () => {
  const cases: {
    title: string
    src: string
    expected: RecipeData
  }[] = [
    {
      title: "allrecipes",
      src: "https://www.allrecipes.com/recipe/22918/pop-cake/",
      expected: {
        sourceSite: "allrecipes.com",
        sourceUrl: "https://www.allrecipes.com/recipe/22918/pop-cake/",
        text: allrecipesRecipe,
        title: "Pop Cake",
      },
    },
    {
      title: "bonappetit",
      src: "https://www.bonappetit.com/recipe/grilled-salmon-with-lemon-sesame-sauce",
      expected: {
        sourceSite: "bonappetit.com",
        sourceUrl:
          "https://www.bonappetit.com/recipe/grilled-salmon-with-lemon-sesame-sauce",
        text: bonappetitRecipe,
        title: "Grilled Crispy-Skinned Salmon With Whole Lemon-Sesame Sauce",
      },
    },
    {
      title: "budgetbytes",
      src: "https://www.budgetbytes.com/skillet-cheeseburger-pasta/",
      expected: {
        sourceSite: "budgetbytes.com",
        sourceUrl: "https://www.budgetbytes.com/skillet-cheeseburger-pasta/",
        text: budgetbytesRecipe,
        title: "One Pot Cheeseburger Pasta",
      },
    },
    {
      title: "cooking.nytimes",
      src: "https://cooking.nytimes.com/recipes/1019772-spiced-chickpea-stew-with-coconut-and-turmeric",
      expected: {
        sourceSite: "cooking.nytimes.com",
        sourceUrl:
          "https://cooking.nytimes.com/recipes/1019772-spiced-chickpea-stew-with-coconut-and-turmeric",
        text: cookingnytimesRecipe,
        title: "Spiced Chickpea Stew With Coconut and Turmeric",
      },
    },
    {
      title: "delish",
      src: "https://www.delish.com/cooking/recipe-ideas/a42628377/croque-monsieur-breakfast-casserole-recipe/",
      expected: {
        sourceSite: "delish.com",
        sourceUrl:
          "https://www.delish.com/cooking/recipe-ideas/a42628377/croque-monsieur-breakfast-casserole-recipe/",
        text: delishRecipe,
        title: "Croque Monsieur Breakfast Casserole",
      },
    },
    {
      title: "eatingwell",
      src: "https://www.eatingwell.com/recipe/259489/shrimp-fish-stew/",
      expected: {
        sourceSite: "eatingwell.com",
        sourceUrl: "https://www.eatingwell.com/recipe/259489/shrimp-fish-stew/",
        text: eatingwellRecipe,
        title: "Shrimp & Fish Stew",
      },
    },
    {
      title: "epicurious",
      src: "https://www.epicurious.com/recipes/food/views/iron-skillet-peach-crisp-56389711",
      expected: {
        sourceSite: "epicurious.com",
        sourceUrl:
          "https://www.epicurious.com/recipes/food/views/iron-skillet-peach-crisp-56389711",
        text: epicuriousRecipe,
        title: "Iron-Skillet Peach Crisp",
      },
    },
    {
      title: "food",
      src: "https://www.food.com/recipe/sonic-strawberry-cheesecake-shake-122785",
      expected: {
        sourceSite: "food.com",
        sourceUrl:
          "https://www.food.com/recipe/sonic-strawberry-cheesecake-shake-122785",
        text: foodRecipe,
        title: "Sonic Strawberry Cheesecake Shake",
      },
    },
    {
      title: "food52",
      src: "https://food52.com/recipes/81226-espresso-caramel-sauce",
      expected: {
        sourceSite: "food52.com",
        sourceUrl: "https://food52.com/recipes/81226-espresso-caramel-sauce",
        text: food52Recipe,
        title: "Espresso Caramel Sauce",
      },
    },
    {
      title: "foodandwine",
      src: "https://www.foodandwine.com/recipes/classic-southern-fried-chicken",
      expected: {
        sourceSite: "foodandwine.com",
        sourceUrl:
          "https://www.foodandwine.com/recipes/classic-southern-fried-chicken",
        text: foodandwineRecipe,
        title: "Classic Southern Fried Chicken",
      },
    },
    {
      title: "foodnetwork",
      src: "https://www.foodnetwork.com/recipes/bobby-flay/perfectly-grilled-steak-recipe-1973350",
      expected: {
        sourceSite: "foodnetwork.com",
        sourceUrl:
          "https://www.foodnetwork.com/recipes/bobby-flay/perfectly-grilled-steak-recipe-1973350",
        text: foodnetworkRecipe,
        title: "Perfectly Grilled Steak",
      },
    },
    {
      title: "seriouseats",
      src: "https://www.seriouseats.com/new-york-style-pizza",
      expected: {
        sourceSite: "seriouseats.com",
        sourceUrl: "https://www.seriouseats.com/new-york-style-pizza",
        text: seriouseatsRecipe,
        title: "New York-Style Pizza",
      },
    },
    {
      title: "simplyrecipes",
      src: "https://www.simplyrecipes.com/recipes/grilled_salmon_with_peach_salsa/",
      expected: {
        sourceSite: "simplyrecipes.com",
        sourceUrl:
          "https://www.simplyrecipes.com/recipes/grilled_salmon_with_peach_salsa/",
        text: simplyrecipesRecipe,
        title: "Grilled Salmon With Peach Salsa",
      },
    },
    {
      title: "tasty",
      src: "https://tasty.co/recipe/chicken-biscuits-bake",
      expected: {
        sourceSite: "tasty.co",
        sourceUrl: "https://tasty.co/recipe/chicken-biscuits-bake",
        text: tastyRecipe,
        title: "Chicken & Biscuits Bake",
      },
    },
    {
      title: "thekitchn",
      src: "https://www.thekitchn.com/recipe-watermelon-mint-frose-233904",
      expected: {
        sourceSite: "thekitchn.com",
        sourceUrl:
          "https://www.thekitchn.com/recipe-watermelon-mint-frose-233904",
        text: thekitchnRecipe,
        title: "Watermelon Mint Frosé",
      },
    },
  ]

  const loadedHtml = (
    await Promise.allSettled(
      cases.map(({ src }) =>
        fetch(src)
          .then((r) => r.text())
          .then((t) => load(t)),
      ),
    )
  ).map((r) => (r.status === "fulfilled" ? r.value : null))

  cases.forEach(({ title, src, expected }, i) => {
    void it(`parses ${title}`, () => {
      const loadedHtmlPage = loadedHtml[i]
      assert.notEqual(loadedHtmlPage, null)

      const parser = selectParser(src)
      assert.notEqual(parser, null)

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const actual = parser!(loadedHtml[i]!, src)

      assert.equal(actual.data.sourceSite, expected.sourceSite)
      assert.equal(actual.data.sourceUrl, expected.sourceUrl)
      assert.equal(actual.data.text, expected.text)
      assert.equal(actual.data.title, expected.title)

      assert.equal(actual.isValid, true)
    })
  })

  void it("returns null if site cannot be parsed", () => {
    const parser = selectParser("https://www.wikipedia.org")

    assert.equal(parser, null)
  })
})
