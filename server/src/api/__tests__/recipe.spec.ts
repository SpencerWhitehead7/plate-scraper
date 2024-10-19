import { expect } from "chai"
import request from "supertest"

import {
  app,
  dataSource,
  factoryRecipe,
  factoryTag,
  syncDB,
  user2Cred,
  userCred,
} from "../../../mochaSetup"
import { Recipe, Tag, User } from "../../db/entities"

describe("API Route Recipe: /api/recipe", () => {
  const route = "/api/recipe"

  let agent: request.SuperAgentTest

  let user: User

  beforeEach(async () => {
    try {
      await syncDB()
      agent = request.agent(app)
      await agent.post("/api/auth").send(userCred)
      user = await dataSource.manager.findOneByOrFail(User, { id: 1 })
    } catch (err) {
      console.log(err)
    }
  })

  afterEach(async () => {
    try {
      await agent.post("/api/auth/logout")
      await syncDB()
    } catch (err) {
      console.log(err)
    }
  })

  describe("/", () => {
    describe("GET", () => {
      let recipe1: Recipe
      let recipe2: Recipe
      let recipe3: Recipe
      let recipe4: Recipe
      let recipe5: Recipe
      beforeEach(async () => {
        try {
          ;[recipe1, recipe2, recipe3, recipe4, recipe5] = await Promise.all(
            [
              factoryRecipe({ user }),
              factoryRecipe({ user }),
              factoryRecipe({ user }),
              factoryRecipe({ user }),
              factoryRecipe({ user }),
            ].map((r) => dataSource.manager.save(r)),
          )
          await Promise.all(
            [
              factoryTag({ name: "tone", recipes: [recipe1, recipe2] }),
              factoryTag({ name: "ttwo", recipes: [recipe2] }),
              factoryTag({ name: "tthree", recipes: [recipe3] }),
              factoryTag({ name: "tfour", recipes: [recipe4] }),
            ].map((r) => dataSource.manager.save(r)),
          )
        } catch (err) {
          console.log(err)
        }
      })

      it("returns all recipes, including tags, if no recipes are queried by tag", async () => {
        const res = await request(app).get(route)
        const bodyRecipes = res.body as Recipe[]
        expect(res.status).to.equal(200)
        expect(bodyRecipes.map((r) => r.id)).to.have.members([
          recipe1.id,
          recipe2.id,
          recipe3.id,
          recipe4.id,
          recipe5.id,
        ])
        bodyRecipes.forEach((r) => {
          expect(r.tags).to.exist
        })
      })
      it("returns all recipes, including tags, which have a tag that matches a queried tag", async () => {
        const res = await request(app).get(`${route}?0=tone&1=tthree`)
        const bodyRecipes = res.body as Recipe[]
        expect(res.status).to.equal(200)
        expect(bodyRecipes.map((r) => r.id)).have.members([
          recipe1.id,
          recipe2.id,
          recipe3.id,
        ])
        bodyRecipes.forEach((r) => {
          expect(r.tags).to.exist
        })
      })
      it("sanitizes tags", async () => {
        const res = await request(app).get(`${route}?0=T_one-1`)
        const bodyRecipes = res.body as Recipe[]
        expect(res.status).to.equal(200)
        expect(bodyRecipes.map((r) => r.id)).have.members([
          recipe1.id,
          recipe2.id,
        ])
      })
      it("does not return duplicate recipes", async () => {
        const res = await request(app).get(`${route}?0=tone&1=ttwo`)
        const bodyRecipes = res.body as Recipe[]
        expect(res.status).to.equal(200)
        expect(bodyRecipes.length).to.equal(2)
        expect(bodyRecipes[0].id).not.to.equal(bodyRecipes[1].id)
      })
      it("handles searching for tags that do not exist", async () => {
        const res = await request(app).get(`${route}?0=nonexistant`)
        expect(res.status).to.equal(200)
        expect(res.body).to.be.empty
      })
    })

    describe("POST", () => {
      it("creates a recipe, assigning and creating new tags if necessary", async () => {
        await dataSource.manager.save(factoryTag({ name: "tone" }))

        await agent.post(route).send({
          ...factoryRecipe(),
          tags: ["tone", "ttwo"],
        })
        const recipe = await dataSource.manager.findOneOrFail(Recipe, {
          where: { id: 1 },
          relations: { tags: true },
        })
        expect(recipe).to.exist
        expect(recipe.tags.map((t) => t.name)).to.have.members(["tone", "ttwo"])
      })
      it("sanitizes tags", async () => {
        await agent.post(route).send({
          ...factoryRecipe(),
          tags: [" T1 one ", "T2 two_T3 three"],
        })
        const tagOne = dataSource.manager.findOneByOrFail(Tag, {
          name: "tone",
        })
        const tagTwo = dataSource.manager.findOneByOrFail(Tag, {
          name: "ttwotthree",
        })
        expect(await tagOne).to.exist
        expect(await tagTwo).to.exist
      })
      it("rejects unauthenticated users' attempts", async () => {
        const failedRes = await request(app).post(route).send(factoryRecipe())
        const recipe = await dataSource.manager.findOneBy(Recipe, { id: 1 })
        expect(failedRes.status).to.equal(401)
        expect(recipe).not.to.exist
      })
      it("sets createdBy to the user's ID, even with bad input", async () => {
        await agent.post(route).send(factoryRecipe({ createdBy: 2 }))
        const recipe = await dataSource.manager.findOneByOrFail(Recipe, {
          id: 1,
        })
        expect(recipe.createdBy).to.equal(1)
      })
      it("ensures forkedCount will use default value of 0, even with bad input", async () => {
        await agent.post(route).send(factoryRecipe({ forkedCount: 2 }))
        const recipe = await dataSource.manager.findOneByOrFail(Recipe, {
          id: 1,
        })
        expect(recipe.forkedCount).to.equal(0)
      })
      it("sets the recipe's owner to the creator", async () => {
        await agent.post(route).send(factoryRecipe())
        const recipe = await dataSource.manager.findOneByOrFail(Recipe, {
          id: 1,
        })
        expect(recipe.userId).to.equal(1)
      })
      it("returns the recipe, including tags", async () => {
        const res = await agent.post(route).send({
          ...factoryRecipe(),
          tags: ["tone"],
        })
        const bodyRecipe = res.body as Recipe
        expect(res.status).to.equal(200)
        expect(bodyRecipe.id).to.equal(1)
        expect(bodyRecipe.text).to.equal("text")
        expect(bodyRecipe.title).to.equal("title")
        expect(bodyRecipe.sourceSite).to.equal("upload")
        expect(bodyRecipe.sourceUrl).to.equal("upload")
        expect(bodyRecipe.createdBy).to.equal(1)
        expect(bodyRecipe.forkedCount).to.equal(0)
        expect(bodyRecipe.tags.map((t) => t.name)).to.have.members(["tone"])
      })
    })
  })

  describe("/fork/:id", () => {
    describe("POST", () => {
      let agent2: request.SuperAgentTest

      beforeEach(async () => {
        agent2 = request.agent(app)
        await agent2.post("/api/auth").send(user2Cred)
        await agent.post(route).send(factoryRecipe())
      })

      afterEach(async () => {
        await agent2.post("/api/auth/logout")
      })

      it("makes a copy of the recipe and saves it to the user's account", async () => {
        await agent2.post(`${route}/fork/1`)
        const user2 = await dataSource.manager.findOneOrFail(User, {
          where: { id: 2 },
          relations: { recipes: true },
        })
        expect(user2.recipes.length).to.equal(1)
        expect(user2.recipes[0].createdBy).to.equal(1)
      })
      it("the copy inherits the original's tags", async () => {
        const original = await dataSource.manager.findOneByOrFail(Recipe, {
          id: 1,
        })
        const originalTag = await dataSource.manager.save(
          factoryTag({ name: "tone", recipes: [original] }),
        )

        await agent2.post(`${route}/fork/1`)
        const copy = await dataSource.manager.findOneOrFail(Recipe, {
          where: { id: 2 },
          relations: { tags: true },
        })
        expect(copy.tags.map((t) => t.name)).to.have.members([originalTag.name])
      })
      it("rejects unauthenticated users", async () => {
        const failedRes = await request(app).post(`${route}/fork/1`)
        expect(failedRes.status).to.equal(401)
      })
      it("rejects attempts to fork non-existant recipes", async () => {
        const failedRes = await agent2.post(`${route}/fork/100`)
        expect(failedRes.status).to.equal(404)
      })
      it("if the user is not the recipe's creator, it increments the recipe's forkedCount", async () => {
        await agent2.post(`${route}/fork/1`)
        const original = await dataSource.manager.findOneByOrFail(Recipe, {
          id: 1,
        })
        const copy = await dataSource.manager.findOneByOrFail(Recipe, { id: 2 })
        expect(original.forkedCount).to.equal(1)
        expect(copy.forkedCount).to.equal(0)
      })
      it("if the user is the recipe's creator, it does not increment the recipe's forkedCount", async () => {
        await agent.post(`${route}/fork/1`)
        const original = await dataSource.manager.findOneByOrFail(Recipe, {
          id: 1,
        })
        const copy = await dataSource.manager.findOneByOrFail(Recipe, { id: 2 })
        expect(original.forkedCount).to.equal(0)
        expect(copy.forkedCount).to.equal(0)
      })
      it("returns the forked recipe, including tags", async () => {
        const res = await agent2.post(`${route}/fork/1`)
        const copy = await dataSource.manager.findOneByOrFail(Recipe, { id: 2 })
        const bodyRecipe = res.body as Recipe
        expect(bodyRecipe.id).to.equal(copy.id)
        expect(bodyRecipe.tags).to.have.members([])
      })
    })
  })

  describe("/:id", () => {
    describe("GET", () => {
      it("returns the recipe with the matching ID, including tags", async () => {
        await dataSource.manager.save(factoryRecipe({ user }))

        const res = await request(app).get(`${route}/1`)
        const bodyRecipe = res.body as Recipe
        expect(res.status).to.equal(200)
        expect(bodyRecipe.id).to.equal(1)
        expect(bodyRecipe.tags).to.have.members([])
      })
      it("returns 404 if the recipe cannot be found", async () => {
        const res = await request(app).get(`${route}/1`)
        expect(res.status).to.equal(404)
      })
    })

    describe("PUT", () => {
      it("edits a recipe, including creating, setting, and unsetting tags", async () => {
        await agent.post(route).send(factoryRecipe())
        const original = await dataSource.manager.findOneByOrFail(Recipe, {
          id: 1,
        })
        await Promise.all(
          [
            factoryTag({ name: "tone", recipes: [original] }),
            factoryTag({ name: "ttwo" }),
          ].map((r) => dataSource.manager.save(r)),
        )

        await agent.put(`${route}/1`).send({
          text: "newText",
          title: "newTitle",
          tags: ["ttwo", "tthree"],
        })
        const edited = await dataSource.manager.findOneOrFail(Recipe, {
          where: { id: 1 },
          relations: { tags: true },
        })
        expect(edited.text).to.equal("newText")
        expect(edited.title).to.equal("newTitle")
        expect(edited.tags.map((t) => t.name)).to.have.members([
          "ttwo",
          "tthree",
        ])
      })
      it("handles partial updates", async () => {
        await agent.post(route).send(factoryRecipe())
        const original = await dataSource.manager.findOneByOrFail(Recipe, {
          id: 1,
        })

        await agent.put(`${route}/1`).send({ text: "newText" })
        const edited = await dataSource.manager.findOneByOrFail(Recipe, {
          id: 1,
        })
        expect(edited.text).to.equal("newText")
        expect(edited.title).to.equal(original.title)
      })
      it("sanitizes tags", async () => {
        await agent.post(route).send(factoryRecipe())

        await agent
          .put(`${route}/1`)
          .send({ tags: [" T1 one ", "T2 two_T3 three"] })
        const tagOne = await dataSource.manager.findOneByOrFail(Tag, {
          name: "tone",
        })
        const tagTwo = await dataSource.manager.findOneByOrFail(Tag, {
          name: "ttwotthree",
        })
        expect(tagOne).to.exist
        expect(tagTwo).to.exist
      })
      it("rejects attempts to edit a recipe that does not exist", async () => {
        const failedRes = await agent
          .put(`${route}/1`)
          .send({ text: "failedText" })
        expect(failedRes.status).to.equal(404)
      })
      it("rejects unauthenticated users' attempts", async () => {
        await agent.post(route).send(factoryRecipe())
        const recipeBefore = await dataSource.manager.findOneByOrFail(Recipe, {
          id: 1,
        })

        const failedRes = await request(app)
          .put(`${route}/1`)
          .send({ text: "failedText" })
        const recipeAfter = await dataSource.manager.findOneByOrFail(Recipe, {
          id: 1,
        })
        expect(failedRes.status).to.equal(401)
        expect(recipeBefore).to.deep.equal(recipeAfter)
      })
      it("rejects attempts to edit a recipe the user does not own", async () => {
        await agent.post(route).send(factoryRecipe())
        const agent2 = request.agent(app)
        await agent2.post("/api/auth").send(user2Cred)
        const recipeBefore = await dataSource.manager.findOneByOrFail(Recipe, {
          id: 1,
        })

        const failedRes = await agent2
          .put(`${route}/1`)
          .send({ text: "failedText" })
        const recipeAfter = await dataSource.manager.findOneByOrFail(Recipe, {
          id: 1,
        })
        expect(failedRes.status).to.equal(403)
        expect(recipeBefore).to.deep.equal(recipeAfter)
      })
      it("allows users to edit only text, title, and tags", async () => {
        await agent.post(route).send(factoryRecipe())
        const recipeBefore = await dataSource.manager.findOneByOrFail(Recipe, {
          id: 1,
        })

        await agent.put(`${route}/1`).send({
          id: 10,
          sourceSite: "new site",
          sourceUrl: "new url",
          createdBy: 10,
          forkedCount: 10,
          userId: 10,
        })
        const recipeAfter = await dataSource.manager.findOneByOrFail(Recipe, {
          id: 1,
        })
        expect(recipeBefore.id).to.equal(recipeAfter.id)
        expect(recipeBefore.sourceSite).to.equal(recipeAfter.sourceSite)
        expect(recipeBefore.sourceUrl).to.equal(recipeAfter.sourceUrl)
        expect(recipeBefore.createdBy).to.equal(recipeAfter.createdBy)
        expect(recipeBefore.forkedCount).to.equal(recipeAfter.forkedCount)
        expect(recipeBefore.userId).to.equal(recipeAfter.userId)
      })
      it("returns the recipe, including tags", async () => {
        await agent.post(route).send(factoryRecipe())

        const res = await agent
          .put(`${route}/1`)
          .send({ text: "newText", title: "newTitle", tags: [] })
        const bodyRecipe = res.body as Recipe
        expect(res.status).to.equal(200)
        expect(bodyRecipe.id).to.equal(1)
        expect(bodyRecipe.text).to.equal("newText")
        expect(bodyRecipe.title).to.equal("newTitle")
        expect(bodyRecipe.sourceSite).to.equal("upload")
        expect(bodyRecipe.sourceUrl).to.equal("upload")
        expect(bodyRecipe.createdBy).to.equal(1)
        expect(bodyRecipe.forkedCount).to.equal(0)
        expect(bodyRecipe.tags).to.have.members([])
      })
    })

    describe("DELETE", () => {
      it("deletes a recipe", async () => {
        await agent.post(route).send(factoryRecipe())
        const recipe = await dataSource.manager.findOneByOrFail(Recipe, {
          id: 1,
        })

        const res = await agent.delete(`${route}/1`)
        const noRecipe = await dataSource.manager.findOneBy(Recipe, { id: 1 })
        expect(res.status).to.equal(200)
        expect(recipe).to.exist
        expect(noRecipe).not.to.exist
      })
      it("rejects unauthenticated users' attempts", async () => {
        await agent.post(route).send(factoryRecipe())

        const failedRes = await request(app).delete(`${route}/1`)
        const recipe = await dataSource.manager.findOneByOrFail(Recipe, {
          id: 1,
        })
        expect(failedRes.status).to.equal(401)
        expect(recipe).to.exist
      })
      it("rejects attempts to delete a recipe that does not exist", async () => {
        const failedRes = await agent.delete(`${route}/1`)
        expect(failedRes.status).to.equal(404)
      })
      it("rejects attempts to delete a recipe the user does not own", async () => {
        await agent.post(route).send(factoryRecipe())
        const agent2 = request.agent(app)
        await agent2.post("/api/auth").send(user2Cred)

        const failedRes = await agent2.delete(`${route}/1`)
        const recipe = await dataSource.manager.findOneByOrFail(Recipe, {
          id: 1,
        })
        expect(failedRes.status).to.equal(403)
        expect(recipe).to.exist
      })
    })
  })
})
