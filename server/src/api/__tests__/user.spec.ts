import { expect } from "chai"

import {
  BASE_ROUTE,
  dataSource,
  factoryRecipe,
  factoryTag,
  factoryUser,
  syncDB,
  user2Cred,
  userCred,
} from "../../../mochaSetup"
import { User } from "../../db/entities"

describe("API Route User: /api/user", () => {
  const route = BASE_ROUTE + "/api/user"

  beforeEach(async () => {
    await syncDB()
  })

  describe("/", () => {
    describe("GET", () => {
      it("returns all users", async () => {
        const [user1, user2] = await Promise.all(
          [factoryUser(userCred), factoryUser(user2Cred)].map((u) =>
            dataSource.manager.save(u),
          ),
        )

        const res = await fetch(route)
        const body = (await res.json()) as User[]

        expect(res.status).to.equal(200)
        expect(body).to.have.lengthOf(2)
        expect(body[0].id).to.equal(user1.id)
        expect(body[1].id).to.equal(user2.id)
      })
    })
  })

  describe("/:id", () => {
    describe("GET", () => {
      it("returns the user, their recipes, and their recipes' tags", async () => {
        const user = await dataSource.manager.save(factoryUser())
        const recipe = await dataSource.manager.save(factoryRecipe({ user }))
        await dataSource.manager.save(factoryTag({ recipes: [recipe] }))

        const res = await fetch(route + "/1")
        const body = (await res.json()) as User

        expect(res.status).to.equal(200)
        expect(body.id).to.equal(user.id)
        expect(body.recipes).to.have.lengthOf(1)
        expect(body.recipes[0].tags).to.have.lengthOf(1)
      })

      it("404s if the user does not exist", async () => {
        const res = await fetch(route + "/1")

        expect(res.status).to.equal(404)
      })
    })
  })
})
