import {
  EntityRepository,
  AbstractRepository,
  getCustomRepository,
} from "typeorm";
import { Tag } from "../entities";

@EntityRepository(Tag)
class TagRepository extends AbstractRepository<Tag> {
  async getOrInsert(tagNames: string[]) {
    await this.createQueryBuilder("tag")
      .insert()
      .into(Tag)
      .values(tagNames.map((name) => ({ name })))
      .onConflict(`DO NOTHING`)
      .execute();

    return this.createQueryBuilder("tag")
      .where("name IN (:...tagNames)", { tagNames })
      .getMany();
  }
}

export default getCustomRepository(TagRepository);
