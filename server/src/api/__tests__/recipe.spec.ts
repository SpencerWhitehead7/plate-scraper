import { expect } from "chai"

import {
  BASE_ROUTE,
  dataSource,
  factoryRecipe,
  factoryTag,
  factoryUser,
  getAuthCookie,
  syncDB,
  user2Cred,
  userCred,
} from "../../../mochaSetup"
import { Recipe, Tag, User } from "../../db/entities"

describe("API Route Recipe: /api/recipe", () => {
  const route = BASE_ROUTE + "/api/recipe"

  beforeEach(async () => {
    await syncDB()
  })

  describe("/", () => {
    describe("GET", () => {
      let recipe1: Recipe
      let recipe2: Recipe
      let recipe3: Recipe
      let recipe4: Recipe
      let recipe5: Recipe

      beforeEach(async () => {
        const user = await dataSource.manager.save(factoryUser())
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
      })

      it("returns all recipes, including tags", async () => {
        const res = await fetch(route)
        const body = (await res.json()) as Recipe[]

        const tagNamesByRecipeId = body.reduce<Record<string, string[]>>(
          (acc, r) => {
            acc[r.id] = r.tags.map((t) => t.name)
            return acc
          },
          {},
        )
        expect(res.status).to.equal(200)
        expect(body.map((r) => r.id)).to.have.members([
          recipe1.id,
          recipe2.id,
          recipe3.id,
          recipe4.id,
          recipe5.id,
        ])
        expect(tagNamesByRecipeId[recipe1.id]).to.have.members(["tone"])
        expect(tagNamesByRecipeId[recipe2.id]).to.have.members(["tone", "ttwo"])
        expect(tagNamesByRecipeId[recipe3.id]).to.have.members(["tthree"])
        expect(tagNamesByRecipeId[recipe4.id]).to.have.members(["tfour"])
        expect(tagNamesByRecipeId[recipe5.id]).to.have.members([])
      })

      it("returns recipes that match queried tags, including tags", async () => {
        const res = await fetch(route + "?0=tone&1=tthree")
        const body = (await res.json()) as Recipe[]

        const tagNamesByRecipeId = body.reduce<Record<string, string[]>>(
          (acc, r) => {
            acc[r.id] = r.tags.map((t) => t.name)
            return acc
          },
          {},
        )
        expect(res.status).to.equal(200)
        expect(body.map((r) => r.id)).have.members([
          recipe1.id,
          recipe2.id,
          recipe3.id,
        ])
        expect(tagNamesByRecipeId[recipe1.id]).to.have.members(["tone"])
        expect(tagNamesByRecipeId[recipe2.id]).to.have.members(["tone", "ttwo"])
        expect(tagNamesByRecipeId[recipe3.id]).to.have.members(["tthree"])
      })

      it("sanitizes tags", async () => {
        const res = await fetch(route + "?0=T_one-1")
        const body = (await res.json()) as Recipe[]

        expect(res.status).to.equal(200)
        expect(body.map((r) => r.id)).have.members([recipe1.id, recipe2.id])
      })

      it("does not return duplicate recipes", async () => {
        const res = await fetch(route + "?0=tone&1=ttwo")
        const body = (await res.json()) as Recipe[]

        expect(res.status).to.equal(200)
        expect(body.length).to.equal(2)
        expect(body[0].id).not.to.equal(body[1].id)
      })

      it("handles searching for tags that do not exist", async () => {
        const res = await fetch(route + "?0=nonexistant")
        const body = (await res.json()) as Recipe[]

        expect(res.status).to.equal(200)
        expect(body).to.be.empty
      })
    })

    describe("POST", () => {
      let user: User

      beforeEach(async () => {
        user = await dataSource.manager.save(factoryUser())
      })

      it("creates a recipe with tags for the user and returns it", async () => {
        await dataSource.manager.save(factoryTag({ name: "tone" }))

        const res = await fetch(route, {
          method: "POST",
          body: JSON.stringify({
            ...factoryRecipe(),
            tags: ["tone", "ttwo"],
          }),
          headers: {
            "content-type": "application/json",
            ...getAuthCookie(user),
          },
        })
        const body = (await res.json()) as Recipe

        const recipe = await dataSource.manager.findOneOrFail(Recipe, {
          where: { id: body.id },
          relations: { tags: true },
        })

        expect(res.status).to.equal(200)

        expect(recipe).to.exist
        expect(recipe.userId).to.equal(user.id)
        expect(recipe.text).to.equal("text")
        expect(recipe.title).to.equal("title")
        expect(recipe.sourceSite).to.equal("upload")
        expect(recipe.sourceUrl).to.equal("upload")
        expect(recipe.createdBy).to.equal(user.id)
        expect(recipe.forkedCount).to.equal(0)
        expect(recipe.tags.map((t) => t.name)).to.have.members(["tone", "ttwo"])
      })

      it("sanitizes tags", async () => {
        const res = await fetch(route, {
          method: "POST",
          body: JSON.stringify({
            ...factoryRecipe(),
            tags: [" T1 one ", "T2 two_T3 three"],
          }),
          headers: {
            "content-type": "application/json",
            ...getAuthCookie(user),
          },
        })

        const tagOne = dataSource.manager.findOneByOrFail(Tag, {
          name: "tone",
        })
        const tagTwo = dataSource.manager.findOneByOrFail(Tag, {
          name: "ttwotthree",
        })

        expect(res.status).to.equal(200)
        expect(await tagOne).to.exist
        expect(await tagTwo).to.exist
      })

      it("401s and noops if the user is not authenticated", async () => {
        const res = await fetch(route, {
          method: "POST",
          body: JSON.stringify({
            ...factoryRecipe(),
          }),
          headers: {
            "content-type": "application/json",
          },
        })

        const recipeCount = await dataSource.manager.count(Recipe)

        expect(res.status).to.equal(401)

        expect(recipeCount).to.equal(0)
      })

      it("sets createdBy to the user's ID, even with bad input", async () => {
        const res = await fetch(route, {
          method: "POST",
          body: JSON.stringify({
            ...factoryRecipe({ createdBy: user.id + 1 }),
          }),
          headers: {
            "content-type": "application/json",
            ...getAuthCookie(user),
          },
        })
        const body = (await res.json()) as Recipe

        const recipe = await dataSource.manager.findOneByOrFail(Recipe, {
          id: body.id,
        })

        expect(res.status).to.equal(200)
        expect(recipe.createdBy).to.equal(user.id)
      })

      it("sets forkedCount to 0, even with bad input", async () => {
        const res = await fetch(route, {
          method: "POST",
          body: JSON.stringify({
            ...factoryRecipe({ forkedCount: 1 }),
          }),
          headers: {
            "content-type": "application/json",
            ...getAuthCookie(user),
          },
        })
        const body = (await res.json()) as Recipe

        const recipe = await dataSource.manager.findOneByOrFail(Recipe, {
          id: body.id,
        })

        expect(res.status).to.equal(200)
        expect(recipe.forkedCount).to.equal(0)
      })
    })

    describe("/fork/:id", () => {
      describe("POST", () => {
        let userCreator: User
        let userForker: User
        let originalRecipe: Recipe
        let originalTag: Tag

        beforeEach(async () => {
          userCreator = await dataSource.manager.save(factoryUser(userCred))
          userForker = await dataSource.manager.save(factoryUser(user2Cred))
          originalRecipe = await dataSource.manager.save(
            factoryRecipe({ user: userCreator }),
          )
          originalTag = await dataSource.manager.save(
            factoryTag({ name: "tone", recipes: [originalRecipe] }),
          )
        })

        it("copies the recipe with tags to the user's account and returns it", async () => {
          const res = await fetch(route + `/fork/${originalRecipe.id}`, {
            method: "POST",
            headers: {
              ...getAuthCookie(userForker),
            },
          })
          const body = (await res.json()) as Recipe

          const forkedRecipe = await dataSource.manager.findOneOrFail(Recipe, {
            where: { id: body.id },
            relations: { user: true, tags: true },
          })

          expect(res.status).to.equal(200)

          expect(forkedRecipe.forkedCount).to.equal(0)
          expect(forkedRecipe.sourceSite).to.equal(originalRecipe.sourceSite)
          expect(forkedRecipe.sourceUrl).to.equal(originalRecipe.sourceUrl)
          expect(forkedRecipe.text).to.equal(originalRecipe.text)
          expect(forkedRecipe.title).to.equal(originalRecipe.title)
          expect(forkedRecipe.tags.map((t) => t.name)).to.have.members([
            originalTag.name,
          ])
          expect(forkedRecipe.user.id).to.equal(userForker.id)
          expect(forkedRecipe.createdBy).to.equal(userCreator.id)
        })

        it("401s and noops if the user is not authenticated", async () => {
          const res = await fetch(route + `/fork/${originalRecipe.id}`, {
            method: "POST",
          })

          const recipeCount = await dataSource.manager.count(Recipe)

          expect(res.status).to.equal(401)

          expect(recipeCount).to.equal(1)
        })

        it("404s if the recipe does not exist", async () => {
          const res = await fetch(route + "/fork/100", {
            method: "POST",
            headers: {
              ...getAuthCookie(userForker),
            },
          })

          const recipeCount = await dataSource.manager.count(Recipe)

          expect(res.status).to.equal(404)

          expect(recipeCount).to.equal(1)
        })

        it("increments the original recipe's forkedCount if the user is not the recipe's creator", async () => {
          const res = await fetch(route + `/fork/${originalRecipe.id}`, {
            method: "POST",
            headers: {
              ...getAuthCookie(userForker),
            },
          })

          const updatedRecipe = await dataSource.manager.findOneByOrFail(
            Recipe,
            { id: originalRecipe.id },
          )

          expect(res.status).to.equal(200)

          expect(updatedRecipe.forkedCount).to.equal(1)
        })

        it("does not increment the recipe's forkedCount if the user is not the recipe's creator", async () => {
          const res = await fetch(route + `/fork/${originalRecipe.id}`, {
            method: "POST",
            headers: {
              ...getAuthCookie(userCreator),
            },
          })

          const unchangedRecipe = await dataSource.manager.findOneByOrFail(
            Recipe,
            { id: originalRecipe.id },
          )

          expect(res.status).to.equal(200)

          expect(unchangedRecipe.forkedCount).to.equal(0)
        })
      })
    })

    describe("/:id", () => {
      describe("GET", () => {
        it("returns the recipe, including tags", async () => {
          const user = await dataSource.manager.save(factoryUser(user2Cred))
          const recipe = await dataSource.manager.save(factoryRecipe({ user }))
          const tag = await dataSource.manager.save(
            factoryTag({ name: "tone", recipes: [recipe] }),
          )

          const res = await fetch(route + `/${recipe.id}`)
          const body = (await res.json()) as Recipe

          expect(res.status).to.equal(200)

          expect(body.id).to.equal(recipe.id)
          expect(body.tags.map((t) => t.name)).to.have.members([tag.name])
        })

        it("404s if the recipe does not exist", async () => {
          const res = await fetch(route + "/100")

          expect(res.status).to.equal(404)
        })
      })

      describe("PUT", () => {
        let user: User
        let recipe: Recipe

        beforeEach(async () => {
          user = await dataSource.manager.save(factoryUser())
          recipe = await dataSource.manager.save(factoryRecipe({ user }))
        })

        it("edits and returns a recipe, including tags", async () => {
          await Promise.all(
            [
              factoryTag({ name: "tone", recipes: [recipe] }),
              factoryTag({ name: "ttwo" }),
            ].map((r) => dataSource.manager.save(r)),
          )

          const newText = "newText"
          const newTitle = "newTitle"
          const newTags = ["ttwo", "tthree"]

          const res = await fetch(route + `/${recipe.id}`, {
            method: "PUT",
            body: JSON.stringify({
              text: newText,
              title: newTitle,
              tags: newTags,
            }),
            headers: {
              "content-type": "application/json",
              ...getAuthCookie(user),
            },
          })
          const body = (await res.json()) as Recipe

          const editedRecipe = await dataSource.manager.findOneOrFail(Recipe, {
            where: { id: recipe.id },
            relations: { tags: true },
          })

          expect(res.status).to.equal(200)

          expect(editedRecipe.text).not.to.equal(recipe.text)
          expect(editedRecipe.title).not.to.equal(recipe.title)
          expect(editedRecipe.tags.map((t) => t.name)).not.to.have.members(
            recipe.tags.map((t) => t.name),
          )

          expect(editedRecipe.text).to.equal(newText)
          expect(editedRecipe.title).to.equal(newTitle)
          expect(editedRecipe.tags.map((t) => t.name)).to.have.members(newTags)

          expect(body.id).to.equal(editedRecipe.id)
          expect(body.text).to.equal(newText)
          expect(body.title).to.equal(newTitle)
          expect(body.tags.map((t) => t.name)).to.have.members(newTags)
        })

        it("handles partial updates", async () => {
          const newText = "newText"

          const res = await fetch(route + `/${recipe.id}`, {
            method: "PUT",
            body: JSON.stringify({
              text: newText,
            }),
            headers: {
              "content-type": "application/json",
              ...getAuthCookie(user),
            },
          })
          const body = (await res.json()) as Recipe

          const editedRecipe = await dataSource.manager.findOneOrFail(Recipe, {
            where: { id: recipe.id },
            relations: { tags: true },
          })

          expect(res.status).to.equal(200)

          expect(editedRecipe.text).not.to.equal(recipe.text)
          expect(editedRecipe.text).to.equal(newText)
          expect(body.text).to.equal(newText)
        })

        it("sanitizes tags", async () => {
          const res = await fetch(route + `/${recipe.id}`, {
            method: "PUT",
            body: JSON.stringify({
              tags: [" T1 one ", "T2 two_T3 three"],
            }),
            headers: {
              "content-type": "application/json",
              ...getAuthCookie(user),
            },
          })

          const tagOne = await dataSource.manager.findOneByOrFail(Tag, {
            name: "tone",
          })
          const tagTwo = await dataSource.manager.findOneByOrFail(Tag, {
            name: "ttwotthree",
          })

          expect(res.status).to.equal(200)

          expect(tagOne).to.exist
          expect(tagTwo).to.exist
        })

        it("404s if the recipe does not exist", async () => {
          const res = await fetch(route + "/100", {
            method: "PUT",
            body: JSON.stringify({
              text: "newText",
            }),
            headers: {
              "content-type": "application/json",
              ...getAuthCookie(user),
            },
          })
          expect(res.status).to.equal(404)
        })

        it("401s and noops if the user is not authenticated", async () => {
          const newText = "newText"

          const res = await fetch(route + `/${recipe.id}`, {
            method: "PUT",
            body: JSON.stringify({
              text: newText,
            }),
            headers: {
              "content-type": "application/json",
            },
          })

          const unchangedRecipe = await dataSource.manager.findOneByOrFail(
            Recipe,
            { id: recipe.id },
          )
          expect(res.status).to.equal(401)

          expect(recipe.text).to.equal(unchangedRecipe.text)
        })

        it("403s and noops if the user does not own the recipe", async () => {
          const otherUser = await dataSource.manager.save(
            factoryUser(user2Cred),
          )

          const res = await fetch(route + `/${recipe.id}`, {
            method: "PUT",
            body: JSON.stringify({
              text: "newText",
            }),
            headers: {
              "content-type": "application/json",
              ...getAuthCookie(otherUser),
            },
          })

          const unchangedRecipe = await dataSource.manager.findOneByOrFail(
            Recipe,
            { id: recipe.id },
          )

          expect(res.status).to.equal(403)

          expect(recipe.text).to.equal(unchangedRecipe.text)
        })

        it("allows users to edit only text, title, and tags", async () => {
          const res = await fetch(route + `/${recipe.id}`, {
            method: "PUT",
            body: JSON.stringify({
              id: 10,
              sourceSite: "new site",
              sourceUrl: "new url",
              createdBy: 10,
              forkedCount: 10,
              userId: 10,
            }),
            headers: {
              "content-type": "application/json",
              ...getAuthCookie(user),
            },
          })

          const editedRecipe = await dataSource.manager.findOneByOrFail(
            Recipe,
            { id: 1 },
          )

          expect(res)
          expect(recipe.id).to.equal(editedRecipe.id)
          expect(recipe.sourceSite).to.equal(editedRecipe.sourceSite)
          expect(recipe.sourceUrl).to.equal(editedRecipe.sourceUrl)
          expect(recipe.createdBy).to.equal(editedRecipe.createdBy)
          expect(recipe.forkedCount).to.equal(editedRecipe.forkedCount)
          expect(recipe.userId).to.equal(editedRecipe.userId)
        })
      })
    })

    describe("DELETE", () => {
      let user: User
      let recipe: Recipe

      beforeEach(async () => {
        user = await dataSource.manager.save(factoryUser())
        recipe = await dataSource.manager.save(factoryRecipe({ user }))
      })

      it("deletes a recipe", async () => {
        const res = await fetch(route + `/${recipe.id}`, {
          method: "DELETE",
          headers: {
            ...getAuthCookie(user),
          },
        })

        const deletedRecipe = await dataSource.manager.findOneBy(Recipe, {
          id: recipe.id,
        })

        expect(res.status).to.equal(200)

        expect(deletedRecipe).not.to.exist
      })

      it("401s and noops if the user is not authenticated", async () => {
        const res = await fetch(route + `/${recipe.id}`, {
          method: "DELETE",
        })

        const unchangedRecipe = await dataSource.manager.findOneBy(Recipe, {
          id: recipe.id,
        })

        expect(res.status).to.equal(401)

        expect(unchangedRecipe).to.exist
      })

      it("404s if the recipe does not exist", async () => {
        const failedRes = await fetch(route + "/100", {
          method: "DELETE",
          headers: {
            ...getAuthCookie(user),
          },
        })

        expect(failedRes.status).to.equal(404)
      })

      it("403s and noops if the user does not own the recipe", async () => {
        const otherUser = await dataSource.manager.save(factoryUser(user2Cred))

        const res = await fetch(route + `/${recipe.id}`, {
          method: "DELETE",
          headers: {
            ...getAuthCookie(otherUser),
          },
        })

        const unchangedRecipe = await dataSource.manager.findOneBy(Recipe, {
          id: recipe.id,
        })

        expect(res.status).to.equal(403)

        expect(unchangedRecipe).to.exist
      })
    })
  })
})
