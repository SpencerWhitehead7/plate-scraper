import {
  EntityRepository,
  AbstractRepository,
  getCustomRepository,
} from "typeorm";

import { User } from "../entities";

@EntityRepository(User)
class UserRepository extends AbstractRepository<User> {
  private select = () =>
    this.createQueryBuilder("user")
      .leftJoinAndSelect("user.recipes", "recipe")
      .leftJoinAndSelect("recipe.tags", "tag");

  private selectWithAuth = () =>
    this.select()
      .addSelect("user.password");

  async insert(userData: {
    email: string,
    userName: string,
    password: string,
  }) {
    const createdUser = await this.createQueryBuilder("user")
      .insert()
      .into(User)
      .values(userData)
      .returning("*")
      .execute();

    return this.getById(createdUser.identifiers[0].id);
  }

  async update(
    id: number,
    updatedUserData: {
      email?: string;
      userName?: string;
      password?: string;
    }
  ) {
    await this.createQueryBuilder("user")
      .update(User)
      .set(updatedUserData)
      .where("id = :id", { id })
      .execute();

    return this.getById(id);
  }

  delete(user: User) {
    return this.createQueryBuilder("user")
      .delete()
      .from(User)
      .where("id = :id", { id: user.id })
      .execute();
  }

  getReqUser(id: number) {
    return this.createQueryBuilder("user")
      .select()
      .where("user.id = :id", { id })
      .getOne();
  }

  getById(id: number) {
    return this.select()
      .where("user.id = :id", { id })
      .getOne();
  }

  getByIdWithAuth(id: number) {
    return this.selectWithAuth()
      .where("user.id = :id", { id })
      .getOne();
  }

  getByEmail(email: string) {
    return this.select()
      .where("user.email = :email", { email })
      .getOne();
  }

  getByEmailWithAuth(email: string) {
    return this.selectWithAuth()
      .where("user.email = :email", { email })
      .getOne();
  }
}

export default getCustomRepository(UserRepository);
