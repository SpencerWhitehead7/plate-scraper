import { getCleanStrings, getRecipe } from "./helpers";

const allrecipes = ($: CheerioStatic, url: string) => {
  const title = getCleanStrings($, `.headline-wrapper`);
  const ingredients = getCleanStrings($, `.ingredients-item`);
  const instructions = getCleanStrings(
    $,
    `.section-body`,
    `.instructions-section`
  );

  return {
    sourceSite: `allrecipes.com`,
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  };
};

export default allrecipes;
