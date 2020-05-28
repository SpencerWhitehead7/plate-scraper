import { getCleanStrings, getRecipe } from "./helpers";

const food = ($: CheerioStatic, url: string) => {
  const title = getCleanStrings($, `h1`);
  const ingredients = getCleanStrings($, `.recipe-ingredients__item`);
  const instructions = getCleanStrings($, `.recipe-directions__step`);

  return {
    sourceSite: `food.com`,
    sourceUrl: url,
    title: title[0],
    recipe: getRecipe(url, title, ingredients, instructions),
  };
};

export default food;
