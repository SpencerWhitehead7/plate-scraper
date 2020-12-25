import { getCleanStrings, getRecipe } from "./helpers";

const bettycrocker = ($: cheerio.Root, url: string) => {
  const title = getCleanStrings($, `h1`);
  const ingredients = getCleanStrings($, `.recipePartIngredient`);
  const instructions = getCleanStrings($, `.recipePartStepDescription`);

  return {
    sourceSite: `bettycrocker.com`,
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  };
};

export default bettycrocker;
