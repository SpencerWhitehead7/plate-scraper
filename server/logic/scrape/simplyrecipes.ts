import { getCleanStrings, getRecipe } from "./helpers";

const simplyrecipes = ($: CheerioStatic, url: string) => {
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
    title: title[0],
    recipe: getRecipe(url, title, ingredients, instructions),
  };
};

export default simplyrecipes;
