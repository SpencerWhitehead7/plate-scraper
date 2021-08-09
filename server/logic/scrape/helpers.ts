export const getCleanStrings = (
  $: cheerio.Root,
  selector: string,
  context: string | null = null,
  additionalCleaners: [RegExp, string?][] = []
) =>
  (context ? $(selector, context) : $(selector))
    .map(function (this: void) {
      let res = $(this).text().trim().replace(/\s+/g, " ");

      additionalCleaners.forEach(([filter, replacer = ""]) => {
        res = res.replace(filter, replacer);
      });

      return res;
    })
    .get()
    .filter(Boolean);

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
    ingredients.join('\n'),
    "Instructions",
    ...instructions,
  ].join(`\n\n`) + '\n';
