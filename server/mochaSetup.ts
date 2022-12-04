import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { Connection, Repository } from "typeorm";

import generateUtils from "./utils";
import { Recipe, Tag, User } from "./db/entities";

chai.use(chaiAsPromised);
export const { expect } = chai;

export let app: any; // actually the result of calling express() but I can't find a type signature for it
export let connection: Connection;

export const userCred = {
  email: "email@provider.com",
  userName: "userName",
  password: "password",
};

export const user2Cred = {
  email: "email2@provider.com",
  userName: "userName2",
  password: "password",
};

let recipeRepo: Repository<Recipe>;
export const factoryRecipe = (values = {}) =>
  recipeRepo.create({
    text: "text",
    title: "title",
    createdBy: 1,
    tags: [],
    ...values,
  });

let tagRepo: Repository<Tag>;
export const factoryTag = (values = {}) =>
  tagRepo.create({
    name: "tag",
    ...values,
  });

let userRepo: Repository<User>;
export const factoryUser = (values = {}) =>
  userRepo.create({
    ...userCred,
    ...values,
  });

export const syncDB = async () => {
  try {
    await connection.synchronize(true);
  } catch (err) {
    console.log(err);
  }
};

before(async () => {
  try {
    ({
      app,
      connection,
      recipeRepo,
      tagRepo,
      userRepo,
    } = await generateUtils());
  } catch (err) {
    console.log(err);
  }
});
