import { expect } from "chai";
import * as request from "supertest";
import {
  syncDB,
  app,
  connection,
  factoryRecipe,
  factoryTag,
  userCred,
  user2Cred,
} from "../../mochaSetup";
import { Recipe, Tag, User } from "../../db/entities";

describe("API Route User: /api/tag", () => {
  const route = "/api/tag";
  let agent: any;

  beforeEach(async () => {
    try {
      await syncDB();
      agent = request.agent(app);
      await agent.post("/api/auth").send(userCred);
      const user = await connection.manager.findOneOrFail(User, 1);
      const recipe = await connection.manager.save(factoryRecipe({ user }));
      await Promise.all(
        [
          factoryTag({ name: "tone", recipes: [recipe] }),
          factoryTag({ name: "ttwo", recipes: [recipe] }),
        ].map((row) => connection.manager.save(row))
      );
    } catch (err) {
      console.log(err);
    }
  });
  afterEach(async () => {
    try {
      await agent.post("/api/auth/logout");
      await syncDB();
    } catch (err) {
      console.log(err);
    }
  });

  describe("/", () => {
    describe("POST", () => {
      it("rejects unauthenticated users' attempts", async () => {
        const recipeBefore = await connection.manager.findOneOrFail(Recipe, 1, {
          relations: ["tags"],
        });
        const failedRes = await request(app)
          .post(route)
          .send({ name: "failedtag", recipeId: 1 });
        const recipeAfter = await connection.manager.findOneOrFail(Recipe, 1, {
          relations: ["tags"],
        });
        const failedTag = await connection.manager.findOne(Tag, 3);

        expect(failedRes.status).to.equal(401);
        expect(failedRes.text).to.equal("Not logged in");
        expect(recipeBefore.tags.length).to.equal(recipeAfter.tags.length);
        expect(failedTag).not.to.exist;
      });
      it("rejects attempts to tag non-existant recipes", async () => {
        const failedRes = await agent
          .post(route)
          .send({ name: "failedtag", recipeId: 2 });
        const failedTag = await connection.manager.findOne(Tag, 3);

        expect(failedRes.status).to.equal(404);
        expect(failedRes.text).to.equal("Recipe not found");
        expect(failedTag).not.to.exist;
      });
      it("rejects attempts of users who are not the recipe's owner", async () => {
        const agent2 = request.agent(app);
        await agent2.post("/api/auth").send(user2Cred);
        const recipeBefore = await connection.manager.findOneOrFail(Recipe, 1, {
          relations: ["tags"],
        });
        const failedRes = await agent2
          .post(route)
          .send({ name: "failedtag", recipeId: 1 });
        const failedTag = await connection.manager.findOne(Tag, 3);
        const recipeAfter = await connection.manager.findOneOrFail(Recipe, 1, {
          relations: ["tags"],
        });

        expect(failedRes.status).to.equal(401);
        expect(failedRes.text).to.equal("Permission denied");
        expect(failedTag).not.to.exist;
        expect(recipeBefore.tags.length).to.equal(recipeAfter.tags.length);
      });
      it("name is lowercased and non-alphas are stripped", async () => {
        await agent.post(route).send({ name: "name &7-Ab", recipeId: 1 });
        const tags = await connection.manager.find(Tag);

        expect(tags.some((tag) => tag.name === "nameab")).to.be.true;
        expect(tags.some((tag) => tag.name === "name &7-Ab")).to.be.false;
      });
      it("if the tag exists, it adds it to the given recipe", async () => {
        const name = "new";
        await connection.manager.save(factoryTag({ name }));
        const recipeBefore = await connection.manager.findOneOrFail(Recipe, 1, {
          relations: ["tags"],
        });
        await agent.post(route).send({ name, recipeId: 1 });
        const recipeAfter = await connection.manager.findOneOrFail(Recipe, 1, {
          relations: ["tags"],
        });

        expect(recipeBefore.tags.length).to.equal(recipeAfter.tags.length - 1);
        expect(recipeBefore.tags.some((tag) => tag.name === name)).to.be.false;
        expect(recipeAfter.tags.some((tag) => tag.name === name)).to.be.true;
      });
      it("if the tag does not exist, it creates the tag and adds it to the given recipe", async () => {
        const name = "new";
        const tagsBefore = await connection.manager.find(Tag);
        const recipeBefore = await connection.manager.findOneOrFail(Recipe, 1, {
          relations: ["tags"],
        });
        await agent.post(route).send({ name, recipeId: 1 });
        const tagsAfter = await connection.manager.find(Tag);
        const recipeAfter = await connection.manager.findOneOrFail(Recipe, 1, {
          relations: ["tags"],
        });

        expect(tagsBefore.length).to.equal(tagsAfter.length - 1);
        expect(tagsBefore.some((tag) => tag.name === name)).to.be.false;
        expect(tagsAfter.some((tag) => tag.name === name)).to.be.true;
        expect(recipeBefore.tags.length).to.equal(recipeAfter.tags.length - 1);
        expect(recipeBefore.tags.some((tag) => tag.name === name)).to.be.false;
        expect(recipeAfter.tags.some((tag) => tag.name === name)).to.be.true;
      });
      it("it returns the updated recipe with its tags", async () => {
        const res = await agent.post(route).send({ name: "new", recipeId: 1 });

        expect(res.status).to.equal(200);
        expect(res.body.id).to.equal(1);
        expect(res.body.tags).to.have.lengthOf(3);
        expect(res.body.tags[res.body.tags.length - 1].name).to.equal("new");
      });
    });
  });

  describe("/:recipeId/:tagId", () => {
    describe("DELETE", () => {
      it("rejects unauthenticated users' attempts", async () => {
        const recipeBefore = await connection.manager.findOneOrFail(Recipe, 1, {
          relations: ["tags"],
        });
        const failedRes = await request(app).delete(`${route}/1/tone`);
        const recipeAfter = await connection.manager.findOneOrFail(Recipe, 1, {
          relations: ["tags"],
        });

        expect(failedRes.status).to.equal(401);
        expect(failedRes.text).to.equal("Not logged in");
        expect(recipeBefore.tags.length).to.equal(recipeAfter.tags.length);
      });
      it("rejects attempts to untag non-existant recipes", async () => {
        const failedRes = await agent.delete(`${route}/2/tone`);
        expect(failedRes.status).to.equal(404);
        expect(failedRes.text).to.equal("Recipe not found");
      });
      it("rejects attempts of users who are not the recipe's owner", async () => {
        const agent2 = request.agent(app);
        await agent2.post("/api/auth").send(user2Cred);
        const recipeBefore = await connection.manager.findOneOrFail(Recipe, 1, {
          relations: ["tags"],
        });
        const failedRes = await agent2.delete(`${route}/1/tone`);
        const recipeAfter = await connection.manager.findOneOrFail(Recipe, 1, {
          relations: ["tags"],
        });

        expect(failedRes.status).to.equal(401);
        expect(failedRes.text).to.equal("Permission denied");
        expect(recipeBefore.tags.length).to.equal(recipeAfter.tags.length);
      });
      it("it removes the tag from the recipe and returns the recipe with its tags", async () => {
        const res = await agent.delete(`${route}/1/ttwo`);

        expect(res.status).to.equal(200);
        expect(res.body.id).to.equal(1);
        expect(res.body.tags).to.have.lengthOf(1);
        expect(res.body.tags[0].name).to.equal(`tone`);
      });
    });
  });
});
