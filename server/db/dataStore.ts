import { DataSource } from "typeorm"

import { Session } from "../logic/auth"
import {
  Recipe,
  RecipeSubscriber,
  Tag,
  TagSubscriber,
  User,
  UserSubscriber,
} from "./entities"

let globalDataSource: DataSource

export const getGlobalDataSource = async () => {
  if (globalDataSource === undefined) {
    const isTest = process.env.NODE_ENV === "test"

    globalDataSource = await new DataSource({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "spencer",
      password: "",
      database: `plate-scraper${isTest ? "-test" : ""}`,
      entities: [Recipe, Tag, User, Session],
      subscribers: [RecipeSubscriber, TagSubscriber, UserSubscriber],
      synchronize: isTest,
      dropSchema: isTest,
    }).initialize()
  }

  return globalDataSource
}
