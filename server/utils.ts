import { ConnectionOptions, getRepository } from "typeorm"

import {
  Recipe,
  RecipeSubscriber,
  Tag,
  TagSubscriber,
  User,
  UserSubscriber,
} from "./db/entities"
import boot from "./index"
import { Session } from "./logic/auth"

export const generateConnectionOptions = (): ConnectionOptions => {
  const isTest = process.env.NODE_ENV === "test"

  return {
    type: "postgres",
    host: "localhost",
    // port: "5432",
    username: "spencer",
    password: "",
    database: `plate-scraper${isTest ? "-test" : ""}`,
    entities: [Recipe, Tag, User, Session],
    subscribers: [RecipeSubscriber, TagSubscriber, UserSubscriber],
    synchronize: isTest,
    dropSchema: isTest,
  }
}

export const generateUtils = async () => {
  const { app, connection } = (await boot()) ?? {}

  if (!app || !connection) throw Error("failed to boot")

  return {
    app,
    connection,
    recipeRepo: getRepository(Recipe),
    tagRepo: getRepository(Tag),
    userRepo: getRepository(User),
  }
}
