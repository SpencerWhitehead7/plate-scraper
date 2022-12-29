import { DataSource, Repository } from "typeorm"

import { getGlobalDataSource } from "../dataStore"
import { User } from "../entities"

class UserRepository {
  private dataSource: DataSource
  private repo: Repository<User>

  constructor() {
    getGlobalDataSource()
      .then((gds) => {
        this.dataSource = gds
        this.repo = gds.getRepository(User)
      })
      .catch(console.error)
  }

  async insert(userData: {
    email: string
    userName: string
    password: string
  }) {
    const createdUser = await this.repo
      .createQueryBuilder("user")
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
    await this.repo
      .createQueryBuilder("user")
      .update(User)
      .set(updatedUserData)
      .where("id = :id", { id })
      .execute()

    return this.getByIdWithRecipes(id)
  }

  delete(user: User) {
    return this.repo
      .createQueryBuilder("user")
      .delete()
      .from(User)
      .where("id = :id", { id: user.id })
      .execute()
  }

  getReqUser(id: number) {
    return this.repo
      .createQueryBuilder("user")
      .select()
      .where("user.id = :id", { id })
      .getOne()
  }

  getById(id: number) {
    return this.repo
      .createQueryBuilder("user")
      .where("user.id = :id", { id })
      .getOne()
  }

  getByIdWithRecipes(id: number) {
    return this.repo
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.recipes", "recipe")
      .leftJoinAndSelect("recipe.tags", "tag")
      .where("user.id = :id", { id })
      .getOne()
  }

  getByIdWithAuth(id: number) {
    return this.repo
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.id = :id", { id })
      .getOne()
  }

  getByEmailWithAuth(email: string) {
    return this.repo
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.email = :email", { email })
      .getOne()
  }
}

export const userRepository = new UserRepository()
