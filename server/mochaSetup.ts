import "mocha"

import * as chai from "chai"
import chaiAsPromised from "chai-as-promised"
import { DataSource, Repository } from "typeorm"

import { initialize } from "./src/app"
import { getGlobalDataSource } from "./src/db/dataStore"
import { Recipe, Tag, User } from "./src/db/entities"

chai.use(chaiAsPromised)
export const { expect } = chai

export let app: Express.Application
export let dataSource: DataSource

export const userCred = {
  email: "email@provider.com",
  userName: "userName",
  password: "password",
}

export const user2Cred = {
  email: "email2@provider.com",
  userName: "userName2",
  password: "password",
}

let recipeRepo: Repository<Recipe>
export const factoryRecipe = (values: Partial<Recipe> = {}) =>
  recipeRepo.create({
    text: "text",
    title: "title",
    createdBy: 1,
    tags: [],
    ...values,
  })

let tagRepo: Repository<Tag>
export const factoryTag = (values: Partial<Tag> = {}) =>
  tagRepo.create({
    name: "tag",
    ...values,
  })

let userRepo: Repository<User>
export const factoryUser = (values: Partial<User> = {}) =>
  userRepo.create({
    ...userCred,
    ...values,
  })

export const syncDB = async () => {
  try {
    await dataSource.synchronize(true)
  } catch (err) {
    console.error(err)
  }
}

before(async () => {
  try {
    dataSource = await getGlobalDataSource()
    recipeRepo = dataSource.getRepository(Recipe)
    tagRepo = dataSource.getRepository(Tag)
    userRepo = dataSource.getRepository(User)
    app = await initialize(dataSource)
  } catch (err) {
    console.error(err)
  }
})
