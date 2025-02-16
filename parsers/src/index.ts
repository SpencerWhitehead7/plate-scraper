export type RecipeData = {
  sourceSite: string
  sourceUrl: string
  text: string
  title: string
}

export type Recipe = {
  isValid: boolean
  data: RecipeData
}

const getRecipe = ({
  sourceSite,
  sourceUrl,
  ingredients,
  instructions,
  title,
}: {
  sourceSite: string
  sourceUrl: string
  ingredients: string[]
  instructions: string[]
  title: string
}): Recipe => ({
  // this doesn't cover all **nearly** the ways the parser can be wrong, but no
  // title, or ingredients, or instructions is a sure sign _something's_ broken
  isValid:
    title.length > 0 && ingredients.length > 0 && instructions.length > 0,
  data: {
    sourceSite,
    sourceUrl,
    text:
      [
        `Source: ${sourceUrl}`,
        title,
        "Ingredients",
        ingredients.join("\n"),
        "Instructions",
        instructions.join("\n\n"),
      ].join("\n\n") + "\n",
    title,
  },
})

export type Parser = ($: cheerio.Root, url: string) => Recipe

const getCleanStrings = (
  $: cheerio.Root,
  selector: string,
  context?: string,
): string[] =>
  (context ? $(selector, context) : $(selector))
    .map((_, e) => $(e).text().replace(/\s+/g, " ").trim())
    .get()
    .filter(Boolean) as string[]

const allrecipes: Parser = ($, url) =>
  getRecipe({
    sourceSite: "allrecipes.com",
    sourceUrl: url,
    ingredients: getCleanStrings(
      $,
      "li",
      "ul.mm-recipes-structured-ingredients__list",
    ),
    instructions: getCleanStrings($, "li > p", "div.mm-recipes-steps__content"),
    title: getCleanStrings($, "h1")[0],
  })

const bonappetit: Parser = ($, url) =>
  getRecipe({
    // I cannot believe how awful their html is
    sourceSite: "bonappetit.com",
    sourceUrl: url,
    // this bullshit is because the ingredient quantities and names are in different tags
    // they can both be retrieved in one pass, but then they need to be knitted together
    ingredients: $("*", ".List-iSNGTT")
      .map((_, e) => $(e).text().trim().replace(/\s+/g, " "))
      .get() // this chunk is just getCleanStrings without the filter for empty strings
      // some ingredients do not have a quantity (ie, asking for just pepper)
      // and filtering them out wrecks the even-number-quantity, odd-number-name indexing
      .reduce<string[]>((acc, curr, i, arr) => {
        if (i % 2 === 0) acc.push(`${curr} ${arr[i + 1]}`.trim())
        return acc
      }, []),
    instructions: getCleanStrings($, "p", "li[class^=InstructionListWrapper]"),
    title: getCleanStrings($, "h1")[0],
  })

const budgetbytes: Parser = ($, url) =>
  getRecipe({
    sourceSite: "budgetbytes.com",
    sourceUrl: url,
    ingredients: getCleanStrings($, "li", "ul[class*=wprm-recipe-ingredients]"),
    instructions: getCleanStrings(
      $,
      "li",
      "ul[class*=wprm-recipe-instructions]",
    ),
    title: getCleanStrings($, "h1")[0],
  })

const cookingnytimes: Parser = ($, url) =>
  getRecipe({
    sourceSite: "cooking.nytimes.com",
    sourceUrl: url,
    ingredients: getCleanStrings(
      $,
      "ul > li",
      "div[class*=recipebody_ingredients-block]",
    ),
    instructions: getCleanStrings(
      $,
      "ol > li p",
      "div[class*=recipebody_prep-block]",
    ),
    title: getCleanStrings($, "h1")[0],
  })

const delish: Parser = ($, url) =>
  getRecipe({
    sourceSite: "delish.com",
    sourceUrl: url,
    ingredients: getCleanStrings($, "li", "ul[class*=ingredient-lists]"),
    instructions: $("li", "ul[class*=directions]")
      .slice(1)
      .map((_, e) =>
        $(e)
          .contents()
          .filter((_, e) => e.type === "text")
          .text()
          .trim()
          .replace(/\s+/g, " "),
      )
      .get() as string[],
    title: getCleanStrings($, "h1")[0],
  })

const eatingwell: Parser = ($, url) =>
  getRecipe({
    sourceSite: "eatingwell.com",
    sourceUrl: url,
    ingredients: getCleanStrings(
      $,
      "li",
      "ul.mm-recipes-structured-ingredients__list",
    ),
    instructions: getCleanStrings($, "li > p", "div.mm-recipes-steps__content"),
    title: getCleanStrings($, "h1")[0],
  })

const epicurious: Parser = ($, url) =>
  getRecipe({
    sourceSite: "epicurious.com",
    sourceUrl: url,
    ingredients: getCleanStrings($, "*", "div[class*=List-iSNGTT]"),
    instructions: getCleanStrings(
      $,
      "p",
      "div[data-testid=InstructionsWrapper]",
    ),
    title: getCleanStrings($, "h1")[0],
  })

const food: Parser = ($, url) =>
  getRecipe({
    sourceSite: "food.com",
    sourceUrl: url,
    ingredients: getCleanStrings($, "li", ".ingredient-list"),
    instructions: getCleanStrings($, "li", ".direction-list"),
    title: getCleanStrings($, "h1")[0],
  })

const food52: Parser = ($, url) =>
  getRecipe({
    sourceSite: "food52.com",
    sourceUrl: url,
    ingredients: getCleanStrings($, "li", ".recipe__list--ingredients"),
    instructions: getCleanStrings($, "li", ".recipe__list--steps"),
    title: getCleanStrings($, "h1")[0],
  })

const foodandwine: Parser = ($, url) =>
  getRecipe({
    sourceSite: "foodandwine.com",
    sourceUrl: url,
    ingredients: getCleanStrings($, "li", "ul[class*=ingredients]"),
    instructions: getCleanStrings($, "li", "ol"),
    title: getCleanStrings($, "h1")[0],
  })

const foodnetwork: Parser = ($, url) =>
  getRecipe({
    sourceSite: "foodnetwork.com",
    sourceUrl: url,
    ingredients: getCleanStrings($, "p[class=o-Ingredients__a-Ingredient]"),
    instructions: getCleanStrings($, "li[class=o-Method__m-Step]"),
    title: getCleanStrings($, "h1")[0],
  })

const seriouseats: Parser = ($, url) =>
  getRecipe({
    sourceSite: "seriouseats.com",
    sourceUrl: url,
    ingredients: getCleanStrings($, ".structured-ingredients__list-item"),
    instructions: getCleanStrings($, "p", "ol[class*=mntl-sc-block-group--OL]"),
    title: getCleanStrings($, "h1")[0],
  })

const simplyrecipes: Parser = ($, url) =>
  getRecipe({
    sourceSite: "simplyrecipes.com",
    sourceUrl: url,
    ingredients: getCleanStrings($, "p", "div.structured-ingredients"),
    instructions: getCleanStrings(
      $,
      "p",
      "div.structured-project__steps",
    ).slice(0, -1), // the last step is always some bullshit rate and review cta
    title: getCleanStrings($, "h1")[0],
  })

const tasty: Parser = ($, url) =>
  getRecipe({
    sourceSite: "tasty.co",
    sourceUrl: url,
    ingredients: getCleanStrings($, "li[class*=ingredient]"),
    instructions: getCleanStrings($, "li", "ol[class*=prep-steps]").slice(
      0,
      -2,
    ), // the last two steps are always "Enjoy!" and some bullshit download their app cta
    title: getCleanStrings($, "h1")[0],
  })

const thekitchn: Parser = ($, url) =>
  getRecipe({
    sourceSite: "thekitchn.com",
    sourceUrl: url,
    ingredients: getCleanStrings($, ".Recipe__ingredient"),
    instructions: getCleanStrings($, ".Recipe__instructionStep"),
    title: getCleanStrings($, ".Recipe__title")[0],
  })

export const selectParser = (url: string) => {
  if (url.includes("allrecipes.com")) {
    return allrecipes
  } else if (url.includes("bonappetit.com")) {
    return bonappetit
  } else if (url.includes("budgetbytes.com")) {
    return budgetbytes
  } else if (url.includes("cooking.nytimes.com")) {
    return cookingnytimes
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
  } else if (url.includes("seriouseats.com")) {
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
