import { getCleanStrings, getRecipe } from "./helpers";

const allrecipes = ($: CheerioStatic, url: string) => {
  let title;
  let ingredients;
  let instructions;

  // two known recipe page templates; one without a main, one with
  if (!$(`main`).length) {
    title = getCleanStrings($, `h1`);
    ingredients = getCleanStrings($, `.checkList__line label`).slice(0, -2); // to deal with some HTML BS
    instructions = getCleanStrings($, `.recipe-directions__list--item`);
  } else {
    title = getCleanStrings($, `.headline-wrapper`);
    ingredients = getCleanStrings($, `.ingredients-item`);
    instructions = getCleanStrings($, `.section-body`, `.instructions-section`);
  }

  return {
    sourceSite: `allrecipes.com`,
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  };
};

export default allrecipes;
