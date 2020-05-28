import { getCleanStrings, getRecipe } from "./helpers";

const eatingwell = ($: CheerioStatic, url: string) => {
  let title;
  let ingredients;
  let instructions;

  // two known recipe page templates; one without a main with that class, one with
  if ($(`body`).hasClass(`template-recipe`)) {
    title = getCleanStrings($, `.headline-wrapper`);
    ingredients = getCleanStrings($, `.ingredients-item`);
    instructions = getCleanStrings($, `.section-body`, `.instructions-section`);
  } else {
    title = getCleanStrings($, `.hideOnTabletToDesktop`);
    ingredients = getCleanStrings($, `.checkListListItem.checkListLine span`);
    instructions = getCleanStrings($, `.recipeDirectionsListItem`);
  }
  return {
    sourceSite: `eatingwell.com`,
    sourceUrl: url,
    title: title[0],
    recipe: getRecipe(url, title, ingredients, instructions),
  };
};

export default eatingwell;