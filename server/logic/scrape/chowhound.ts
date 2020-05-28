import { getCleanStrings, getRecipe } from "./helpers";

const chowhound = ($: CheerioStatic, url: string) => {
  const title = getCleanStrings($, `h1`);
  const ingredients = getCleanStrings($, `.freyja_box.freyja_box81 ul li`);
  const instructions = getCleanStrings(
    $,
    `.freyja_box.freyja_box82 ol li`,
    null,
    [[/^[\s\d]+/]]
  ); // to deal with leading numbers/spaces

  return {
    sourceSite: `chowhound.com`,
    sourceUrl: url,
    title: title[0],
    recipe: getRecipe(url, title, ingredients, instructions),
  };
};

export default chowhound;
