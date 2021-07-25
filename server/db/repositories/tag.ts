import {
  EntityRepository,
  AbstractRepository,
  getCustomRepository,
} from "typeorm";
import { Tag } from "../entities";

@EntityRepository(Tag)
class TagRepository extends AbstractRepository<Tag> {
  async getOrInsert(tagNames: string[]) {
    if (tagNames.length) {
      await this.createQueryBuilder("tag")
        .insert()
        .into(Tag)
        .values(tagNames.map((name) => ({ name })))
        .onConflict("DO NOTHING")
        .execute();

      return this.createQueryBuilder("tag")
        .where("name IN (:...tagNames)", { tagNames })
        .getMany();
    } else {
      return [];
    }
  }
}

export default getCustomRepository(TagRepository);
