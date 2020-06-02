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

    await this.createQueryBuilder("tag")
      .relation(Tag, "recipes")
      .of(tag)
      .add(recipes);
  }

  async getOrInsert(tagNames: string[]) {
    if (tagNames.length) {
      await this.createQueryBuilder("tag")
        .insert()
        .into(Tag)
        .values(tagNames.map((name) => ({ name })))
        .onConflict(`DO NOTHING`)
        .execute();

      return this.createQueryBuilder("tag")
        .where("name IN (:...tagNames)", { tagNames })
        .getMany();
    } else {
      return [];
    }
  }

  remove(tagName: string, recipes: Recipe[]) {
    return this.createQueryBuilder("tag")
      .relation(Tag, "recipes")
      .of(tagName)
      .remove(recipes);
  }
}

export default getCustomRepository(TagRepository);
