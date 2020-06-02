import {
  EntityRepository,
  AbstractRepository,
  getCustomRepository,
} from "typeorm";
import { Recipe } from "../entities";

@EntityRepository(Recipe)
class RecipeRepository extends AbstractRepository<Recipe> {
  private select = () =>
    this.createQueryBuilder("recipe").leftJoinAndSelect("recipe.tags", "tag");

  async insert(recipe: Recipe) {
    const {
      raw: [createdRecipe],
    } = await this.createQueryBuilder("recipe")
      .insert()
      .into(Recipe)
      .values(recipe)
      .returning("*")
      .execute();

    if (recipe.tags) {
      await this.createQueryBuilder("recipe")
        .relation(Recipe, "tags")
        .of(recipe)
        .add(recipe.tags);
    }

    return this.getById(createdRecipe.id);
  }

  async update(
    id: number,
    newValues: { text?: string; title?: string; forkedCount?: number }
  ) {
    const {
      raw: [updatedRecipe],
    } = await this.createQueryBuilder("recipe")
      .update(Recipe)
      .set(newValues)
      .where("id = :id", { id })
      .returning("*")
      .execute();

    return this.getById(updatedRecipe.id);
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
