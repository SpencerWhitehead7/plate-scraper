import { getCleanStrings, getRecipe } from "./helpers";

const seriousEats = ($: CheerioStatic, url: string) => {
  const title = getCleanStrings($, `h1`);
  const ingredients = getCleanStrings($, `.ingredient`);
  const instructions = getCleanStrings($, `.recipe-procedure-text`);

  return {
    sourceSite: `seriouseats.com`,
    sourceUrl: url,
    title: title[0],
    recipe: getRecipe(url, title, ingredients, instructions),
  };
};

export default seriousEats;
