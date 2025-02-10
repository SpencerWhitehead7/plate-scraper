import { allrecipes } from "./allrecipes"
import { bonappetit } from "./bonappetit"
import { budgetbytes } from "./budgetbytes"
import { delish } from "./delish"
import { eatingwell } from "./eatingwell"
import { epicurious } from "./epicurious"
import { food } from "./food"
import { food52 } from "./food52"
import { foodandwine } from "./foodandwine"
import { foodnetwork } from "./foodnetwork"
import { seriouseats } from "./seriouseats"
import { simplyrecipes } from "./simplyrecipes"
import { tasty } from "./tasty"
import { thekitchn } from "./thekitchn"

export const selectParser = (url: string) => {
  if (url.includes("allrecipes.com")) {
    return allrecipes
  } else if (url.includes("bonappetit.com")) {
    return bonappetit
  } else if (url.includes("budgetbytes.com")) {
    return budgetbytes
  } else if (url.includes("delish.com")) {
    return delish
  } else if (url.includes("eatingwell.com")) {
    return eatingwell
  } else if (url.includes("epicurious.com")) {
    return epicurious
  } else if (url.includes("food.com")) {
    return food
  } else if (url.includes("food52.com")) {
    return food52
  } else if (url.includes("foodandwine.com")) {
    return foodandwine
  } else if (url.includes("foodnetwork.com")) {
    return foodnetwork
  } else if (url.includes("seriouseats.com/recipes")) {
    return seriouseats
  } else if (url.includes("simplyrecipes.com")) {
    return simplyrecipes
  } else if (url.includes("tasty.co")) {
    return tasty
  } else if (url.includes("thekitchn.com")) {
    return thekitchn
  } else {
    return null
  }
}
