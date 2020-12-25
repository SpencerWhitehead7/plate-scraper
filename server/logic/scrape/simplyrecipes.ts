import { getCleanStrings, getRecipe } from "./helpers";

const simplyrecipes = ($: cheerio.Root, url: string) => {
  const title = getCleanStrings($, `h1`);
  const ingredients = getCleanStrings($, `.ingredient`);
  const instructions = getCleanStrings(
    $,
    `.entry-details.recipe-method.instructions p`,
    null,
    [[/^[\s\d]+/]]
  ); // to deal with leading numbers/spaces

  return {
    sourceSite: `simplyrecipes.com`,
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  };
};

export default simplyrecipes;
