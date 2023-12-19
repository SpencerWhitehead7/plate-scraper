/* global chrome:false */
import $ from "jquery"
import {
  allrecipes,
  bettycrocker,
  bonappetit,
  budgetbytes,
  delish,
  eatingwell,
  epicurious,
  food,
  food52,
  foodandwine,
  foodnetwork,
  jamieoliver,
  myrecipes,
  seriouseats,
  simplyrecipes,
  tasty,
  thekitchn,
  yummly,
} from "plate-scraper-parsers"

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { url } = message.tab
  const recipe = (() => {
    if (url.includes("allrecipes.com")) {
      return allrecipes($, url)
    } else if (url.includes("bettycrocker.com")) {
      return bettycrocker($, url)
    } else if (url.includes("bonappetit.com")) {
      return bonappetit($, url)
    } else if (url.includes("budgetbytes.com")) {
      return budgetbytes($, url)
    } else if (url.includes("delish.com")) {
      return delish($, url)
    } else if (url.includes("eatingwell.com")) {
      return eatingwell($, url)
    } else if (url.includes("epicurious.com")) {
      return epicurious($, url)
    } else if (url.includes("food.com")) {
      return food($, url)
    } else if (url.includes("food52.com")) {
      return food52($, url)
    } else if (url.includes("foodandwine.com")) {
      return foodandwine($, url)
    } else if (url.includes("foodnetwork.com")) {
      return foodnetwork($, url)
    } else if (url.includes("jamieoliver.com")) {
      return jamieoliver($, url)
    } else if (url.includes("myrecipes.com")) {
      return myrecipes($, url)
    } else if (url.includes("seriouseats.com/recipes")) {
      return seriouseats($, url)
    } else if (url.includes("simplyrecipes.com")) {
      return simplyrecipes($, url)
    } else if (url.includes("tasty.co")) {
      return tasty($, url)
    } else if (url.includes("thekitchn.com")) {
      return thekitchn($, url)
    } else if (url.includes("yummly.com")) {
      return yummly($, url)
      // Deals with edge case seriousEats pages
    } else if (url.includes("seriouseats.com")) {
      return {
        error:
          "Make sure your url is seriouseats.com/recipes, not just seriouseats.com",
      }
    } else {
      return { error: "No domain matched" }
    }
  })()

  sendResponse(recipe)
})
