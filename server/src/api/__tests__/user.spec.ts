import { expect } from "chai"
import request from "supertest"

import {
  app,
  dataSource,
  factoryRecipe,
  factoryTag,
  factoryUser,
  syncDB,
} from "../../../mochaSetup"
import { User } from "../../db/entities"

describe("API Route User: /api/user", () => {
  const route = "/api/user"

  beforeEach(syncDB)

  afterEach(syncDB)

  describe("/", () => {
    describe("GET", () => {
      it("returns all users", async () => {
        const user = await dataSource.manager.save(factoryUser())

        const res = await request(app).get(route)
        const bodyUsers = res.body as User[]
        expect(res.status).to.equal(200)
        expect(bodyUsers[0].id).to.equal(user.id)
      })
    })
  })

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
