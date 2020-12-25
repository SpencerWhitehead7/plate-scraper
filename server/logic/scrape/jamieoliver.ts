import { getCleanStrings, getRecipe } from "./helpers";

const jamieoliver = ($: cheerio.Root, url: string) => {
  const title = getCleanStrings($, `h1`);
  const ingredients = getCleanStrings($, `.ingred-list li`);
  const instructions = getCleanStrings($, `.recipeSteps li`);

  return {
    sourceSite: `jamieoliver.com`,
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  };
};

export default jamieoliver;
