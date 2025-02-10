export type RecipeData = {
  sourceSite: string
  sourceUrl: string
  text: string
  title: string
}

export type Parser = ($: cheerio.Root, url: string) => RecipeData

const getCleanStrings = (
  $: cheerio.Root,
  selector: string,
  context?: string,
): string[] =>
  (context ? $(selector, context) : $(selector))
    .map((_, e) => $(e).text().replace(/\s+/g, " ").trim())
    .get()
    .filter(Boolean) as string[]

const getRecipe = (
  url: string,
  title: string[],
  ingredients: string[],
  instructions: string[],
): string =>
  [
    `Source: ${url}`,
    title[0],
    "Ingredients",
    ingredients.join("\n"),
    "Instructions",
    ...instructions,
  ].join("\n\n") + "\n"

const allrecipes: Parser = ($, url) => {
  const title = getCleanStrings($, "h1")
  const ingredients = getCleanStrings(
    $,
    ".mntl-structured-ingredients__list-item",
  )
  const instructions = getCleanStrings(
    $,
    ".comp.mntl-sc-block.mntl-sc-block-html",
  )

  return {
    sourceSite: "allrecipes.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}

const bonappetit: Parser = ($, url) => {
  // I cannot believe how awful their html is
  const title = getCleanStrings($, "h1")
  // this bullshit is because the ingredient quantities and names are in different tags
  // they can both be retrieved in one pass, but then they need to be knitted together
  const ingredients = $("*", ".List-iSNGTT")
    .map((_, e) => $(e).text().trim().replace(/\s+/g, " "))
    .get() // this chunk is just getCleanStrings without the filter for empty strings
    // some ingredients do not have a quantity (ie, asking for just pepper)
    // and filtering them out wrecks the even-number-quantity, odd-number-name indexing
    .reduce<string[]>((acc, curr, i, arr) => {
      if (i % 2 === 0) acc.push(`${curr} ${arr[i + 1]}`.trim())
      return acc
    }, [])
  const instructions = getCleanStrings(
    $,
    "p",
    "li[class^=InstructionListWrapper]",
  )

  return {
    sourceSite: "bonappetit.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}

const budgetbytes: Parser = ($, url) => {
  const title = getCleanStrings($, "h1")
  const ingredients = getCleanStrings(
    $,
    "li",
    "ul[class*=wprm-recipe-ingredients]",
  )
  const instructions = getCleanStrings(
    $,
    "li",
    "ul[class*=wprm-recipe-instructions]",
  )

  return {
    sourceSite: "budgetbytes.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}

const delish: Parser = ($, url) => {
  const title = getCleanStrings($, "h1")
  const ingredients = getCleanStrings($, "li", "ul[class*=ingredient-lists]")
  const instructions = $("li", "ol[class*=et3p2gv0]")
    .map((_, e) => {
      return $(e)
        .contents()
        .filter((_, e) => e.type === "text")
        .text()
        .trim()
        .replace(/\s+/g, " ")
    })
    .get() as string[]

  return {
    sourceSite: "delish.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}

const eatingwell: Parser = ($, url) => {
  const title = getCleanStrings($, "h1")
  const ingredients = getCleanStrings(
    $,
    ".mntl-structured-ingredients__list-item",
  )
  const instructions = getCleanStrings(
    $,
    ".comp .mntl-sc-block .mntl-sc-block-html",
  )

  return {
    sourceSite: "eatingwell.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}

const epicurious: Parser = ($, url) => {
  const title = getCleanStrings($, "h1")
  const ingredients = getCleanStrings($, "*", "div[class*=List-iSNGTT]")
  const instructions = getCleanStrings(
    $,
    "p",
    "div[data-testid=InstructionsWrapper]",
  )

  return {
    sourceSite: "epicurious.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}

const food: Parser = ($, url) => {
  const title = getCleanStrings($, "h1")
  const ingredients = getCleanStrings($, "li", ".ingredient-list")
  const instructions = getCleanStrings($, "li", ".direction-list")

  return {
    sourceSite: "food.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}

const food52: Parser = ($, url) => {
  const title = getCleanStrings($, "h1")
  const ingredients = getCleanStrings($, "li", ".recipe__list--ingredients")
  const instructions = getCleanStrings($, "li", ".recipe__list--steps")

  return {
    sourceSite: "food52.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}

const foodandwine: Parser = ($, url) => {
  const title = getCleanStrings($, "h1")
  const ingredients = getCleanStrings($, "li", "ul[class*=ingredients]")
  const instructions = getCleanStrings($, "li", "ol")

  return {
    sourceSite: "foodandwine.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}

const foodnetwork: Parser = ($, url) => {
  const title = getCleanStrings($, "h1")
  const ingredients = getCleanStrings($, "p[class=o-Ingredients__a-Ingredient]")
  const instructions = getCleanStrings($, "li[class=o-Method__m-Step]")

  return {
    sourceSite: "foodnetwork.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}

const seriouseats: Parser = ($, url) => {
  const title = getCleanStrings($, "h1")
  const ingredients = getCleanStrings($, ".structured-ingredients__list-item")
  const instructions = getCleanStrings(
    $,
    "p",
    "ol[class*=mntl-sc-block-group--OL]",
  )

  return {
    sourceSite: "seriouseats.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}

const simplyrecipes: Parser = ($, url) => {
  const title = getCleanStrings($, "h1")
  const ingredients = getCleanStrings($, ".structured-ingredients__list-item")
  const instructions = getCleanStrings($, ".mntl-sc-block-group--LI > p")

  return {
    sourceSite: "simplyrecipes.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}

const tasty: Parser = ($, url) => {
  const title = getCleanStrings($, "h1")
  const ingredients = getCleanStrings($, "li[class*=ingredient]")
  const instructions = getCleanStrings($, "li", "ol[class*=prep-steps]").slice(
    0,
    -2,
  ) // the last two steps are always "Enjoy!" and some bullshit about downloading their app

  return {
    sourceSite: "tasty.co",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}

const thekitchn: Parser = ($, url) => {
  const title = getCleanStrings($, ".Recipe__title")
  const ingredients = getCleanStrings($, ".Recipe__ingredient")
  const instructions = getCleanStrings($, ".Recipe__instructionStep")

  return {
    sourceSite: "thekitchn.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}

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
