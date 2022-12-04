import {
  expect,
  syncDB,
  connection,
  factoryRecipe,
  factoryTag,
  factoryUser,
} from "../../../mochaSetup";
import { Recipe } from "../recipe";
import { Tag } from "../tag";
import { User } from "../user";

describe("Relations", () => {
  let user: User;
  beforeEach(async () => {
    try {
      await syncDB();
      user = await connection.manager.save(factoryUser());
    } catch (err) {
      console.log(err);
    }
  });
  afterEach(syncDB);

  it("The User-Recipe one-many relation exists", async () => {
    await Promise.all(
      [factoryRecipe({ user }), factoryRecipe({ user })].map((row) =>
        connection.manager.save(row)
      )
    );

    const savedUser = await connection.manager.findOneOrFail(User, {
      where: { id: 1 },
      relations: { recipes: true },
    });

    expect(savedUser.recipes.map(({ id }) => id)).to.deep.equal([1, 2]);
  });

  it("The Recipe-Tag many-many relation exists", async () => {
    const getAllRecipeTagJoinRowsTag = async () =>
      await connection.manager
        .createQueryBuilder()
        .select("tag")
        .from(Tag, "tag")
        .innerJoinAndSelect("tag.recipes", "recipe")
        .getMany();

    const getAllRecipeTagJoinRowsRecipe = async () =>
      await connection.manager
        .createQueryBuilder()
        .select("recipe")
        .from(Recipe, "recipe")
        .innerJoinAndSelect("recipe.tags", "tag")
        .getMany();

    const [tag1, tag2] = await Promise.all(
      [factoryTag({ name: "abc" }), factoryTag({ name: "def" })].map((row) =>
        connection.manager.save(row)
      )
    );

    await Promise.all(
      [
        factoryRecipe({ user, tags: [tag1, tag2] }),
        factoryRecipe({ user, tags: [tag1, tag2] }),
      ].map((row) => connection.manager.save(row))
    );

    const tags = await getAllRecipeTagJoinRowsTag();
    const recipes = await getAllRecipeTagJoinRowsRecipe();

    expect(tags).to.have.lengthOf(2);
    tags.forEach((tag) => {
      expect(new Set(tag.recipes.map(({ id }) => id))).to.deep.equal(
        new Set([1, 2])
      );
    });
    expect(recipes).to.have.lengthOf(2);
    recipes.forEach((recipe) => {
      expect(new Set(recipe.tags.map(({ name }) => name))).to.deep.equal(
        new Set(["abc", "def"])
      );
    });
  });
});
