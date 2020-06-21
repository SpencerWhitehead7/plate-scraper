export const getCleanStrings = (
  $: CheerioStatic,
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
    .filter((string) => Boolean(string));

export const getRecipe = (
  url: string,
  title: string[],
  ingredients: string[],
  instructions: string[]
) =>
  [
    `Source: ${url}`,
    "",
    title[0],
    "",
    "Ingredients",
    "",
    ...ingredients,
    "",
    "Instructions",
    "",
    ...instructions.reduce((formattedInstructions: string[], instruction) => {
      formattedInstructions.push(instruction);
      formattedInstructions.push("");
      return formattedInstructions;
    }, []), // each instruction with a line break between
  ].join(`\n`);
