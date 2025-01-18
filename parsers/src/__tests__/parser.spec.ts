import assert from "node:assert/strict"
import { afterEach, before, describe, it } from "node:test"

import { load } from "cheerio"

import { allrecipes } from "../allrecipes"
import { bettycrocker } from "../bettycrocker"
import { bonappetit } from "../bonappetit"
import { budgetbytes } from "../budgetbytes"
import { delish } from "../delish"
import { eatingwell } from "../eatingwell"
import { epicurious } from "../epicurious"
import { food } from "../food"
import { food52 } from "../food52"
import { foodandwine } from "../foodandwine"
import { foodnetwork } from "../foodnetwork"
import type { Parser, RecipeData } from "../helpers"
import { jamieoliver } from "../jamieoliver"
import { myrecipes } from "../myrecipes"
import { seriouseats } from "../seriouseats"
import { simplyrecipes } from "../simplyrecipes"
import { tasty } from "../tasty"
import { thekitchn } from "../thekitchn"
import { yummly } from "../yummly"
import {
  allrecipesRecipe,
  bettycrockerRecipe,
  bonappetitRecipe,
  budgetbytesRecipe,
  delishRecipe,
  eatingwellRecipe,
  epicuriousRecipe,
  food52Recipe,
  foodandwineRecipe,
  foodnetworkRecipe,
  foodRecipe,
  jamieoliverRecipe,
  myrecipesRecipe,
  seriouseatsRecipe,
  simplyrecipesRecipe,
  tastyRecipe,
  thekitchnRecipe,
  yummlyRecipe,
} from "./expectedRecipes"

void describe("Parsers", () => {
  const cases: {
    src: string
    parser: Parser
    expected: RecipeData
    actual?: RecipeData
  }[] = [
    {
      src: "https://www.allrecipes.com/recipe/22918/pop-cake/",
      parser: allrecipes,
      expected: {
        sourceSite: "allrecipes.com",
        sourceUrl: "https://www.allrecipes.com/recipe/22918/pop-cake/",
        text: allrecipesRecipe,
        title: "Pop Cake",
      },
    },
    {
      src: "https://www.bettycrocker.com/recipes/skillet-chicken-stroganoff/4966ef59-6380-49aa-89bf-5bf285b37a44",
      parser: bettycrocker,
      expected: {
        sourceSite: "bettycrocker.com",
        sourceUrl:
          "https://www.bettycrocker.com/recipes/skillet-chicken-stroganoff/4966ef59-6380-49aa-89bf-5bf285b37a44",
        text: bettycrockerRecipe,
        title: "Skillet Chicken Stroganoff",
      },
    },
    {
      src: "https://www.bonappetit.com/recipe/grilled-salmon-with-lemon-sesame-sauce",
      parser: bonappetit,
      expected: {
        sourceSite: "bonappetit.com",
        sourceUrl:
          "https://www.bonappetit.com/recipe/grilled-salmon-with-lemon-sesame-sauce",
        text: bonappetitRecipe,
        title: "Grilled Crispy-Skinned Salmon With Whole Lemon-Sesame Sauce",
      },
    },
    {
      src: "https://www.budgetbytes.com/skillet-cheeseburger-pasta/",
      parser: budgetbytes,
      expected: {
        sourceSite: "budgetbytes.com",
        sourceUrl: "https://www.budgetbytes.com/skillet-cheeseburger-pasta/",
        text: budgetbytesRecipe,
        title: "One Pot Cheeseburger Pasta",
      },
    },
    {
      src: "https://www.delish.com/cooking/recipe-ideas/a42628377/croque-monsieur-breakfast-casserole-recipe/",
      parser: delish,
      expected: {
        sourceSite: "delish.com",
        sourceUrl:
          "https://www.delish.com/cooking/recipe-ideas/a42628377/croque-monsieur-breakfast-casserole-recipe/",
        text: delishRecipe,
        title: "Croque Monsieur Breakfast Casserole",
      },
    },
    {
      src: "https://www.eatingwell.com/recipe/278567/shaved-artichoke-salad-with-shrimp/",
      parser: eatingwell,
      expected: {
        sourceSite: "eatingwell.com",
        sourceUrl:
          "https://www.eatingwell.com/recipe/278567/shaved-artichoke-salad-with-shrimp/",
        text: eatingwellRecipe,
        title: "Shaved Artichoke Salad with Shrimp",
      },
    },
    {
      src: "https://www.epicurious.com/recipes/food/views/iron-skillet-peach-crisp-56389711",
      parser: epicurious,
      expected: {
        sourceSite: "epicurious.com",
        sourceUrl:
          "https://www.epicurious.com/recipes/food/views/iron-skillet-peach-crisp-56389711",
        text: epicuriousRecipe,
        title: "Iron-Skillet Peach Crisp",
      },
    },
    {
      src: "https://www.food.com/recipe/sonic-strawberry-cheesecake-shake-122785",
      parser: food,
      expected: {
        sourceSite: "food.com",
        sourceUrl:
          "https://www.food.com/recipe/sonic-strawberry-cheesecake-shake-122785",
        text: foodRecipe,
        title: "Sonic Strawberry Cheesecake Shake",
      },
    },
    {
      src: "https://food52.com/recipes/81226-espresso-caramel-sauce",
      parser: food52,
      expected: {
        sourceSite: "food52.com",
        sourceUrl: "https://food52.com/recipes/81226-espresso-caramel-sauce",
        text: food52Recipe,
        title: "Espresso Caramel Sauce",
      },
    },
    {
      src: "https://www.foodandwine.com/recipes/classic-southern-fried-chicken",
      parser: foodandwine,
      expected: {
        sourceSite: "foodandwine.com",
        sourceUrl:
          "https://www.foodandwine.com/recipes/classic-southern-fried-chicken",
        text: foodandwineRecipe,
        title: "Classic Southern Fried Chicken",
      },
    },
    {
      src: "https://www.foodnetwork.com/recipes/bobby-flay/perfectly-grilled-steak-recipe-1973350",
      parser: foodnetwork,
      expected: {
        sourceSite: "foodnetwork.com",
        sourceUrl:
          "https://www.foodnetwork.com/recipes/bobby-flay/perfectly-grilled-steak-recipe-1973350",
        text: foodnetworkRecipe,
        title: "Perfectly Grilled Steak",
      },
    },
    {
      src: "https://www.jamieoliver.com/recipes/eggs-recipes/amazing-yorkies/",
      parser: jamieoliver,
      expected: {
        sourceSite: "jamieoliver.com",
        sourceUrl:
          "https://www.jamieoliver.com/recipes/eggs-recipes/amazing-yorkies/",
        text: jamieoliverRecipe,
        title: "Amazing Yorkies",
      },
    },
    {
      src: "https://www.myrecipes.com/recipe/grapefruit-pound-cake",
      parser: myrecipes,
      expected: {
        sourceSite: "myrecipes.com",
        sourceUrl: "https://www.myrecipes.com/recipe/grapefruit-pound-cake",
        text: myrecipesRecipe,
        title: "Grapefruit Pound Cake",
      },
    },
    {
      src: "https://www.seriouseats.com/recipes/2010/10/new-york-style-pizza.html",
      parser: seriouseats,
      expected: {
        sourceSite: "seriouseats.com",
        sourceUrl:
          "https://www.seriouseats.com/recipes/2010/10/new-york-style-pizza.html",
        text: seriouseatsRecipe,
        title: "New York-Style Pizza Recipe",
      },
    },
    {
      src: "https://www.simplyrecipes.com/recipes/grilled_salmon_with_peach_salsa/",
      parser: simplyrecipes,
      expected: {
        sourceSite: "simplyrecipes.com",
        sourceUrl:
          "https://www.simplyrecipes.com/recipes/grilled_salmon_with_peach_salsa/",
        text: simplyrecipesRecipe,
        title: "Grilled Salmon With Peach Salsa",
      },
    },
    {
      src: "https://tasty.co/recipe/chicken-biscuits-bake",
      parser: tasty,
      expected: {
        sourceSite: "tasty.co",
        sourceUrl: "https://tasty.co/recipe/chicken-biscuits-bake",
        text: tastyRecipe,
        title: "Chicken & Biscuits Bake",
      },
    },
    {
      src: "https://www.thekitchn.com/recipe-watermelon-mint-frose-233904",
      parser: thekitchn,
      expected: {
        sourceSite: "thekitchn.com",
        sourceUrl:
          "https://www.thekitchn.com/recipe-watermelon-mint-frose-233904",
        text: thekitchnRecipe,
        title: "Watermelon Mint Frosé",
      },
    },
    {
      src: "https://www.yummly.com/recipe/Balsamic-Mushroom-1951517",
      parser: yummly,
      expected: {
        sourceSite: "yummly.com",
        sourceUrl: "https://www.yummly.com/recipe/Balsamic-Mushroom-1951517",
        text: yummlyRecipe,
        title: "Balsamic Mushroom",
      },
    },
  ]

  let i = 0

  before(async () => {
    const results = (
      await Promise.allSettled(
        cases.map(({ parser, src }) =>
          fetch(src)
            .then((r) => r.text())
            .then((t) => load(t))
            .then(($) => parser($, src)),
        ),
      )
    ).map((r) =>
      r.status === "fulfilled" ? r.value : ({} as unknown as RecipeData),
    )

    cases.forEach((c, i) => {
      c.actual = results[i]
    })
  })

  afterEach(() => {
    i++
  })

  void it("allrecipes", () => {
    assert.deepStrictEqual(cases[i].actual, cases[i].expected)
  })
  void it("bettycrocker", () => {
    assert.deepStrictEqual(cases[i].actual, cases[i].expected)
  })
  void it("bonappetit", () => {
    assert.deepStrictEqual(cases[i].actual, cases[i].expected)
  })
  void it("budgetbytes", () => {
    assert.deepStrictEqual(cases[i].actual, cases[i].expected)
  })
  void it("delish", () => {
    assert.deepStrictEqual(cases[i].actual, cases[i].expected)
  })
  void it("eatingwell", () => {
    assert.deepStrictEqual(cases[i].actual, cases[i].expected)
  })
  void it("epicurious", () => {
    assert.deepStrictEqual(cases[i].actual, cases[i].expected)
  })
  void it("food", () => {
    assert.deepStrictEqual(cases[i].actual, cases[i].expected)
  })
  void it("food52", () => {
    assert.deepStrictEqual(cases[i].actual, cases[i].expected)
  })
  void it("foodandwine", () => {
    assert.deepStrictEqual(cases[i].actual, cases[i].expected)
  })
  void it("foodnetwork", () => {
    assert.deepStrictEqual(cases[i].actual, cases[i].expected)
  })
  void it("jamieoliver", () => {
    assert.deepStrictEqual(cases[i].actual, cases[i].expected)
  })
  void it("myrecipes", () => {
    assert.deepStrictEqual(cases[i].actual, cases[i].expected)
  })
  void it("seriouseats", () => {
    assert.deepStrictEqual(cases[i].actual, cases[i].expected)
  })
  void it("simplyrecipes", () => {
    assert.deepStrictEqual(cases[i].actual, cases[i].expected)
  })
  void it("tasty", () => {
    assert.deepStrictEqual(cases[i].actual, cases[i].expected)
  })
  void it("thekitchn", () => {
    assert.deepStrictEqual(cases[i].actual, cases[i].expected)
  })
  void it("yummly", () => {
    assert.deepStrictEqual(cases[i].actual, cases[i].expected)
  })
})
