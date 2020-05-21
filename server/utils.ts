import { getRepository, ConnectionOptions } from "typeorm";
import {
  Recipe,
  RecipeSubscriber,
  Tag,
  TagSubscriber,
  User,
  UserSubscriber,
} from "./db/entities";
const boot = require("./index");

export const generateConnectionOptions = (): ConnectionOptions => {
  const isTest = process.env.NODE_ENV === "test";

  return {
    type: "postgres",
    host: "localhost",
    // port: "5432",
    username: "spencer",
    password: "",
    database: `plate-scraper${isTest ? `-test` : ``}`,
    entities: [Recipe, Tag, User],
    subscribers: [RecipeSubscriber, TagSubscriber, UserSubscriber],
    synchronize: isTest,
    dropSchema: isTest,
  };
};

const generateUtils = async () => {
  const { app, connection } = await boot();

  return {
    app,
    connection,
    recipeRepo: getRepository(Recipe),
    tagRepo: getRepository(Tag),
    userRepo: getRepository(User),
  };
};

export default generateUtils;
