import {
  AbstractRepository,
  EntityRepository,
  getCustomRepository,
} from "typeorm"

import { User } from "../entities"

@EntityRepository(User)
class UserRepository extends AbstractRepository<User> {
  async insert(userData: {
    email: string
    userName: string
    password: string
  }) {
    const createdUser = await this.createQueryBuilder("user")
      .insert()
      .into(User)
      .values(userData)
      .returning("*")
      .execute()

    return this.getByIdWithRecipes(createdUser.identifiers[0].id as number)
  }

  async update(
    id: number,
    updatedUserData: {
      email?: string
      userName?: string
      password?: string
    }
  ) {
    await this.createQueryBuilder("user")
      .update(User)
      .set(updatedUserData)
      .where("id = :id", { id })
      .execute()

    return this.getByIdWithRecipes(id)
  }

  delete(user: User) {
    return this.createQueryBuilder("user")
      .delete()
      .from(User)
      .where("id = :id", { id: user.id })
      .execute()
  }

  getReqUser(id: number) {
    return this.createQueryBuilder("user")
      .select()
      .where("user.id = :id", { id })
      .getOne()
  }

  getById(id: number) {
    return this.createQueryBuilder("user")
      .where("user.id = :id", { id })
      .getOne()
  }

  getByIdWithRecipes(id: number) {
    return this.createQueryBuilder("user")
      .leftJoinAndSelect("user.recipes", "recipe")
      .leftJoinAndSelect("recipe.tags", "tag")
      .where("user.id = :id", { id })
      .getOne()
  }

  getByIdWithAuth(id: number) {
    return this.createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.id = :id", { id })
      .getOne()
  }

  getByEmailWithAuth(email: string) {
    return this.createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.email = :email", { email })
      .getOne()
  }
}

export const userRepository = getCustomRepository(UserRepository)
