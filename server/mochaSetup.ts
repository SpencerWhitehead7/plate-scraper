import crypto from "node:crypto"
import http from "node:http"

import * as chai from "chai"
import chaiAsPromised from "chai-as-promised"
import { DataSource, Repository } from "typeorm"

import { initialize } from "./src/app"
import { getGlobalDataSource } from "./src/db/dataStore"
import { Recipe, Tag, User } from "./src/db/entities"
import { PORT, SESSION_SECRET } from "./src/env"

chai.use(chaiAsPromised)
export const { expect } = chai

let server: http.Server
export let dataSource: DataSource

export const BASE_ROUTE = `http://localhost:${PORT}`

export const userCred = {
  email: "email@provider.com",
  userName: "userName",
  password: "password",
}

export const user2Cred = {
  email: "email2@provider.com",
  userName: "userName2",
  password: "password2",
}

export const getAuthCookie = (user: User, refreshTrigger: number = 0) => {
  const sessionData = { userId: user.id, refreshTrigger }
  const session = Buffer.from(JSON.stringify(sessionData)).toString("base64")

  const sig = crypto
    .createHmac("sha1", SESSION_SECRET)
    .update(`session=${session}`)
    .digest("base64")
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .replace(/\/|\+|=/g, (c) => ({ "/": "_", "+": "-", "=": "" })[c]!)

  return {
    Cookie: `session=${session}; session.sig=${sig}`,
  }
}

export const syncDB = () => dataSource.synchronize(true)

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

before(async () => {
  dataSource = await getGlobalDataSource()
  recipeRepo = dataSource.getRepository(Recipe)
  tagRepo = dataSource.getRepository(Tag)
  userRepo = dataSource.getRepository(User)
  server = (await initialize()).listen(PORT)
})

after(() => {
  void dataSource.destroy()
  server.close()
})
