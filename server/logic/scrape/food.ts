import { getCleanStrings, getRecipe } from "./helpers";

const food = ($: cheerio.Root, url: string) => {
  const title = getCleanStrings($, `h1`);
  const ingredients = getCleanStrings($, `.recipe-ingredients__item`);
  const instructions = getCleanStrings($, `.recipe-directions__step`);

  return {
    sourceSite: `food.com`,
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  };
};

export default food;
