import {
  EntityRepository,
  AbstractRepository,
  getCustomRepository,
} from "typeorm";
import { Recipe, Tag, User } from "../entities";

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
    user: User;
    tags: Tag[];
  }) {
    const { tags } = recipeData;
    delete recipeData.tags;

    const {
      raw: [createdRecipe],
    } = await this.createQueryBuilder("recipe")
      .insert()
      .into(Recipe)
      .values(recipeData)
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
