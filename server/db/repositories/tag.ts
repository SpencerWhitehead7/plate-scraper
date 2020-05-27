import {
  EntityRepository,
  AbstractRepository,
  getCustomRepository,
} from "typeorm";
import { Tag, Recipe } from "../entities";

@EntityRepository(Tag)
class TagRepository extends AbstractRepository<Tag> {
  async insert(name: string, recipes: Recipe[]) {
    let tag = await this.createQueryBuilder("tag")
      .select()
      .where("name = :name", { name })
      .getOne();

    if (!tag) {
      ({
        raw: [tag],
      } = await this.createQueryBuilder("tag")
        .insert()
        .into(Tag)
        .values({ name, recipes })
        .returning("*")
        .execute());
    }

    this.createQueryBuilder("tag")
      .relation(Tag, "recipes")
      .of(tag)
      .add(recipes);
  }

  remove(tagId: number, recipes: Recipe[]) {
    return this.createQueryBuilder("tag")
      .relation(Tag, "recipes")
      .of(tagId)
      .remove(recipes);
  }
}

export default getCustomRepository(TagRepository);
