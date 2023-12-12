export type RecipeData = {
  sourceSite: string
  sourceUrl: string
  text: string
  title: string
}

export const getCleanStrings = (
  $: cheerio.Root,
  selector: string,
  context: string | null = null,
) =>
  (context ? $(selector, context) : $(selector))
    .map((_, e) => $(e).text().replace(/\s+/g, " ").trim())
    .get()
    .filter(Boolean) as string[]

export const getRecipe = (
  url: string,
  title: string[],
  ingredients: string[],
  instructions: string[],
) =>
  [
    `Source: ${url}`,
    title[0],
    "Ingredients",
    ingredients.join("\n"),
    "Instructions",
    ...instructions,
  ].join("\n\n") + "\n"
