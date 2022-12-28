import { load } from "cheerio"

import { scrapeFailedErr, siteInvalidErr } from "../errors"

import allrecipes from "./allrecipes"
import bettycrocker from "./bettycrocker"
import bonappetit from "./bonappetit"
import chowhound from "./chowhound"
import cookinglight from "./cookinglight"
import eatingwell from "./eatingwell"
import epicurious from "./epicurious"
import food from "./food"
// import food52 from "./food52"; // uncomment if I ever get it working
import foodandwine from "./foodandwine"
import foodnetwork from "./foodnetwork"
import jamieoliver from "./jamieoliver"
import myrecipes from "./myrecipes"
import seriousEats from "./seriouseats"
import simplyrecipes from "./simplyrecipes"

// import thekitchn from "./thekitchn"; // uncomment if I ever get it working

export const scrape = async (url: string) => {
  const res = await fetch(url)
  const html = await res.text()
  const $ = load(html)
  let recipe

  if (url.includes("allrecipes.com")) {
    recipe = allrecipes($, url)
  } else if (url.includes("bettycrocker.com")) {
    recipe = bettycrocker($, url)
  } else if (url.includes("bonappetit.com")) {
    recipe = bonappetit($, url)
  } else if (url.includes("chowhound.com")) {
    recipe = chowhound($, url)
  } else if (url.includes("cookinglight.com")) {
    recipe = cookinglight($, url)
  } else if (url.includes("eatingwell.com")) {
    recipe = eatingwell($, url)
  } else if (url.includes("epicurious.com")) {
    recipe = epicurious($, url)
  } else if (url.includes("food.com")) {
    recipe = food($, url)
    // } else if (url.includes("food52.com")) { // uncomment if I ever get it working
    //   recipe = food52($, url)
  } else if (url.includes("foodandwine.com")) {
    recipe = foodandwine($, url)
  } else if (url.includes("foodnetwork.com")) {
    recipe = foodnetwork($, url)
  } else if (url.includes("jamieoliver.com")) {
    recipe = jamieoliver($, url)
  } else if (url.includes("myrecipes.com")) {
    recipe = myrecipes($, url)
  } else if (url.includes("seriouseats.com/recipes")) {
    recipe = seriousEats($, url)
  } else if (url.includes("simplyrecipes.com")) {
    recipe = simplyrecipes($, url)
    // } else if (url.includes("thekitchn.com")) { // uncomment if I ever get it working
    //   recipe = thekitchn($, url)
  } else {
    throw siteInvalidErr
  }

  // this doesn't cover all _nearly_ the ways the parser can be wrong
  // but no title, no ingredients, or no instructions is a sure sign _something's_ broken
  const compressedText = recipe.text.replace(/\s/g, "")
  const hasNoTitle = !recipe.title
  const hasNoIngredients = compressedText.includes("IngredientsInstructions")
  const hasNoInstructions = compressedText.endsWith("Instructions")
  if (hasNoTitle || hasNoIngredients || hasNoInstructions) throw scrapeFailedErr

  return recipe
}
