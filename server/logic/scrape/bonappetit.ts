import { getCleanStrings, getRecipe } from "./helpers";

const bonappetit = ($: CheerioStatic, url: string) => {
  const title = getCleanStrings($, `h1`);
  const ingredients = getCleanStrings($, `.ingredients__text`);
  const instructions = getCleanStrings($, `.step`);

  return {
    sourceSite: `bonappetit.com`,
    sourceUrl: url,
    title: title[0],
    recipe: getRecipe(url, title, ingredients, instructions),
  };
};

export default bonappetit;
