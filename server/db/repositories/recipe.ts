import {
  EntityRepository,
  AbstractRepository,
  getCustomRepository,
} from "typeorm";
import { Recipe, Tag } from "../entities";

@EntityRepository(Recipe)
class RecipeRepository extends AbstractRepository<Recipe> {
  private select = () =>
    this.createQueryBuilder("recipe").leftJoinAndSelect("recipe.tags", "tag");

  async insert(recipeData: {
    text: string;
    title: string;
    sourceSite?: string;
    sourceUrl?: string;
    createdBy: number;
    forkedCount: number;
    userId: number;
    tags: Tag[];
  }) {
    const { tags, ...santizedRecipeData } = recipeData;

    const {
      raw: [createdRecipe],
    } = await this.createQueryBuilder("recipe")
      .insert()
      .into(Recipe)
      .values(santizedRecipeData)
      .returning("*")
      .execute();

    if (tags.length) {
      await this.createQueryBuilder("recipe")
        .relation(Recipe, "tags")
        .of(createdRecipe)
        .add(tags);
    }

    return this.getById(createdRecipe.id);
  }

  async update(
    id: number,
    updatedRecipeData: {
      text?: string;
      title?: string;
      tags?: Tag[];
      forkedCount?: number;
    }
  ) {
    const { tags, ...santizedUpdatedRecipeData } = updatedRecipeData;

    await this.createQueryBuilder("recipe")
      .update(Recipe)
      .set(santizedUpdatedRecipeData)
      .where("id = :id", { id })
      .execute();

    if (tags) {
      const updatedRecipe = await this.getById(id);

      const newTagsSet = new Set(tags);
      // remove all the recipe's tags that updatedValues.tags doesn't have
      await this.createQueryBuilder("recipe")
        .relation(Recipe, "tags")
        .of(updatedRecipe)
        .remove(updatedRecipe!.tags.filter((tag) => !newTagsSet.has(tag)));

      // add all the tags in updatedValues.tags that the recipe doesn't already have
      const currentTagsSet = new Set(updatedRecipe!.tags);
      await this.createQueryBuilder("recipe")
        .relation(Recipe, "tags")
        .of(updatedRecipe)
        .add(tags.filter((tag) => !currentTagsSet.has(tag)));
    }

    return this.getById(id);
    // // all this BS is because createQueryBuilder doesn't support joining for updates
    // // ironically, there's a much simpler way to do this with the ORM API, but I was like
    // // "No I want to use the query builder for everything to practice sql" and
    // // have ended up using their crappy abstraction instead of their good one
    // // because they don't support what I need in the sql query builder
    // const originalRecipe = await this.getById(id);
    // const updatedRecipe = { ...originalRecipe, ...updatedValues };
    // return this.repository.save(updatedRecipe);
  }

  delete(id: number) {
    return this.createQueryBuilder("recipe")
      .delete()
      .from(Recipe)
      .where("id = :id", { id })
      .execute();
  }

  getById(id: number) {
    return this.select().where("recipe.id = :id", { id }).getOne();
  }

  getByTagNames(tagNames: string[]) {
    return this.select()
      .where("tag.name IN (:...tagNames)", { tagNames })
      .getMany();
  }

  getAll() {
    return this.select().getMany();
  }
}

export default getCustomRepository(RecipeRepository);
