import { DataSource } from "typeorm"

import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
  ENV,
  ENVS,
} from "../env"
import {
  Recipe,
  RecipeSubscriber,
  Tag,
  TagSubscriber,
  User,
  UserSubscriber,
} from "./entities"

let globalDataSource: DataSource | undefined

export const getGlobalDataSource = async () => {
  if (globalDataSource === undefined) {
    globalDataSource = await new DataSource({
      type: "postgres",
      host: DB_HOST,
      port: DB_PORT,
      database: DB_DATABASE,
      username: DB_USERNAME,
      password: DB_PASSWORD,
      entities: [Recipe, Tag, User],
      subscribers: [RecipeSubscriber, TagSubscriber, UserSubscriber],
      synchronize: ENV === ENVS.TEST,
      dropSchema: ENV === ENVS.TEST,
    }).initialize()
  }

  return globalDataSource
}
