export type RecipeData = {
  sourceSite: string
  sourceUrl: string
  text: string
  title: string
}

export const getCleanStrings = (
  $: cheerio.Root,
  selector: string,
  context: string | null = null
) =>
  (context ? $(selector, context) : $(selector))
    .map(function (this: void) {
      return $(this).text().trim().replace(/\s+/g, " ")
    })
    .get()
    .filter(Boolean) as string[]

export const getRecipe = (
  url: string,
  title: string[],
  ingredients: string[],
  instructions: string[]
) =>
  [
    `Source: ${url}`,
    title[0],
    "Ingredients",
    ingredients.join("\n"),
    "Instructions",
    ...instructions,
  ].join("\n\n") + "\n"
