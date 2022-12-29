import { expect } from "chai"
import request from "supertest"

import { User } from "../../db/entities"
import {
  app,
  dataSource,
  factoryRecipe,
  factoryTag,
  factoryUser,
  syncDB,
} from "../../mochaSetup"

describe("API Route User: /api/user", () => {
  const route = "/api/user"
  beforeEach(syncDB)
  afterEach(syncDB)

  describe("/:id", () => {
    describe("GET", () => {
      it("returns the user, their recipes, and their recipes' tags", async () => {
        const user = await dataSource.manager.save(factoryUser())
        const recipe = await dataSource.manager.save(factoryRecipe({ user }))
        await dataSource.manager.save(factoryTag({ recipes: [recipe] }))

        const res = await request(app).get(`${route}/1`)
        const bodyUser = res.body as User
        expect(res.status).to.equal(200)
        expect(bodyUser.id).to.equal(user.id)
        expect(bodyUser.email).to.equal(user.email)
        expect(bodyUser.userName).to.equal(user.userName)
        expect(bodyUser.recipes).to.have.lengthOf(1)
        expect(bodyUser.recipes[0].tags).to.have.lengthOf(1)
      })
      it("returns 404 if the user cannot be found", async () => {
        const res = await request(app).get(`${route}/1`)

        expect(res.status).to.equal(404)
      })
    })
  })
})
