import {
  EntityManager,
  EntityRepository,
  AbstractRepository,
  getConnection,
  getCustomRepository,
} from "typeorm";
import { Recipe, Tag } from "../entities";

@EntityRepository(Recipe)
class RecipeRepository extends AbstractRepository<Recipe> {
  private getTx = (cb: (tx: EntityManager) => Promise<Recipe | undefined>) =>
    getConnection()
      .transaction("SERIALIZABLE", cb);

  private select = (tx?: EntityManager) =>
    (tx
      ? tx.createQueryBuilder(Recipe, "recipe")
      : this.createQueryBuilder("recipe")
    )
      .leftJoinAndSelect("recipe.tags", "tag");

  private insertTags = (tx: EntityManager, tagNames: string[] = []) => tx.createQueryBuilder(Tag, "tag")
    .insert()
    .into(Tag)
    .values(tagNames.map((name) => ({ name })))
    .onConflict("DO NOTHING")
    .execute();

  private insertCb = async (
    tx: EntityManager,
    recipeData: {
      text: string;
      title: string;
      sourceSite?: string;
      sourceUrl?: string;
      createdBy: number;
      userId: number;
      tags?: string[];
    }) => {
    const { tags, ...santizedRecipeData } = recipeData;

    const [createdRecipe] = await Promise.all([
      tx.createQueryBuilder(Recipe, "recipe")
        .insert()
        .into(Recipe)
        .values(santizedRecipeData)
        .returning("*")
        .execute(),
      this.insertTags(tx, tags),
    ]);

    if (tags) {
      await tx.createQueryBuilder(Recipe, "recipe")
        .relation(Recipe, "tags")
        .of(createdRecipe.generatedMaps[0])
        .add(tags);
    }

    return await this.getById(createdRecipe.identifiers[0].id as number, tx) ?? undefined;
  }

  private updateCb = async (
    tx: EntityManager,
    id: number,
    updatedRecipeData: {
      text?: string;
      title?: string;
      tags?: string[];
      forkedCount?: number;
    }) => {
    const { tags, ...santizedUpdatedRecipeData } = updatedRecipeData;

    await Promise.all([
      tx.createQueryBuilder(Recipe, "recipe")
        .update(Recipe)
        .set(santizedUpdatedRecipeData)
        .where("id = :id", { id })
        .execute(),
      this.insertTags(tx, tags)
    ]);

    if (tags) {
      const updatedRecipe = await this.getById(id, tx);

      const newTagsSet = new Set(tags);
      // remove all the recipe's tags that updatedValues.tags doesn't have
      await tx.createQueryBuilder(Recipe, "recipe")
        .relation(Recipe, "tags")
        .of(updatedRecipe)
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .remove(updatedRecipe!.tags.filter((tag) => !newTagsSet.has(tag.name)));

      // add all the tags in updatedValues.tags that the recipe doesn't already have
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const currentTagsSet = new Set(updatedRecipe!.tags.map(({ name }) => name));
      await tx.createQueryBuilder(Recipe, "recipe")
        .relation(Recipe, "tags")
        .of(updatedRecipe)
        .add(tags.filter((tagName) => !currentTagsSet.has(tagName)));

      // // all this BS is because createQueryBuilder doesn't support joining for updates
      // // ironically, there's a much simpler way to do this with the ORM API, but I was like
      // // "No I want to use the query builder for everything to practice sql" and
      // // have ended up using their crappy abstraction instead of their good one
      // // because they don't support what I need in the sql query builder
      // const originalRecipe = await this.getById(id);
      // const updatedRecipe = { ...originalRecipe, ...updatedValues };
      // return this.repository.save(updatedRecipe);
    }

    return await this.getById(id, tx) ?? undefined;
  }

  insert(
    recipeData: {
      text: string;
      title: string;
      sourceSite?: string;
      sourceUrl?: string;
      createdBy: number;
      userId: number;
      tags?: string[];
    },
    tx?: EntityManager,
  ) {
    return tx
      ? this.insertCb(tx, recipeData)
      : this.getTx(tx => this.insertCb(tx, recipeData));
  }

  update(
    id: number,
    updatedRecipeData: {
      text?: string;
      title?: string;
      tags?: string[];
      forkedCount?: number;
    },
    tx?: EntityManager,
  ) {
    return tx
      ? this.updateCb(tx, id, updatedRecipeData)
      : this.getTx(tx => this.updateCb(tx, id, updatedRecipeData));
  }

  fork(originalRecipe: Recipe, userId: number) {
    return this.getTx(async tx => {
      const recipe = await this.insert({
        ...originalRecipe,
        tags: originalRecipe.tags.map(({ name }) => name),
        userId,
      }, tx);
      if (originalRecipe.userId !== userId) {
        await this.update(originalRecipe.id, { forkedCount: originalRecipe.forkedCount + 1 }, tx);
      }
      return recipe ?? undefined
    })
  }

  delete(id: number) {
    return this.createQueryBuilder("recipe")
      .delete()
      .from(Recipe)
      .where("id = :id", { id })
      .execute();
  }

  getById(id: number, tx?: EntityManager) {
    return this.select(tx)
      .where("recipe.id = :id", { id })
      .getOne();
  }

  getByTagNames(tagNames: string[]) {
    return this.select()
      .where("tag.name IN (:...tagNames)", { tagNames })
      .getMany();
  }

  getAll() {
    return this.select()
      .getMany();
  }
}

export const recipeRepository = getCustomRepository(RecipeRepository);
