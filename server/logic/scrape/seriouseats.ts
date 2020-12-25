import { getCleanStrings, getRecipe } from "./helpers";

const seriousEats = ($: cheerio.Root, url: string) => {
  const title = getCleanStrings($, `h1`);
  const ingredients = getCleanStrings($, `.ingredient`);
  const instructions = getCleanStrings($, `.recipe-procedure-text`);

  return {
    sourceSite: `seriouseats.com`,
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  };
};

export default seriousEats;
