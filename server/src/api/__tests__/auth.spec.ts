import { expect } from "chai"

import {
  BASE_ROUTE,
  dataSource,
  factoryUser,
  getAuthCookie,
  syncDB,
  userCred,
} from "../../../mochaSetup"
import { User } from "../../db/entities"
import { Session } from "../../logic/auth"

export const getSession = (
  res: Response,
): Session | Record<PropertyKey, never> => {
  const setCookies = res.headers.get("Set-Cookie")?.split(",") || []
  const sessionCookie = setCookies.find((c) => c.startsWith("session="))
  const sessionKV = sessionCookie?.split(";")[0]
  const sessionV = sessionKV?.split("=")[1]

  return sessionV ? (JSON.parse(atob(sessionV)) as Session) : {}
}

describe("API Route Auth: /api/auth", () => {
  const route = BASE_ROUTE + "/api/auth"

  const getUserWithAuth = async (id: number) =>
    await dataSource.manager
      .createQueryBuilder()
      .select("user")
      .from(User, "user")
      .addSelect("user.password")
      .where("id = :id", { id })
      .getOne()

  beforeEach(async () => {
    await syncDB()
  })

  describe("/", () => {
    describe("GET", () => {
      it("returns the logged in user", async () => {
        const user = await dataSource.manager.save(factoryUser())

        const res = await fetch(route, {
          headers: {
            ...getAuthCookie(user),
          },
        })
        const body = (await res.json()) as User

        expect(res.status).to.equal(200)

        expect(body.id).to.equal(user.id)
      })

      it("triggers a refresh to extend user's session", async () => {
        const user = await dataSource.manager.save(factoryUser())

        const res1 = await fetch(route, {
          headers: {
            ...getAuthCookie(user),
          },
        })
        const { refreshTrigger: refreshTrigger1 } = getSession(res1)
        expect(res1.status).to.equal(200)
        expect(refreshTrigger1).to.equal(1)

        const res2 = await fetch(route, {
          headers: {
            ...getAuthCookie(user, refreshTrigger1),
          },
        })
        const { refreshTrigger: refreshTrigger2 } = getSession(res2)
        expect(res2.status).to.equal(200)
        expect(refreshTrigger2).to.equal(0)

        const res3 = await fetch(route, {
          headers: {
            ...getAuthCookie(user, refreshTrigger2),
          },
        })
        const { refreshTrigger: refreshTrigger3 } = getSession(res3)
        expect(res3.status).to.equal(200)
        expect(refreshTrigger3).to.equal(1)
      })

      it("401s if the user is not authenticated", async () => {
        const res = await fetch(route)

        expect(res.status).to.equal(401)
      })
    })

    describe("POST", () => {
      it("creates a user with the correct credentials and logs them in", async () => {
        const res = await fetch(route, {
          method: "POST",
          body: JSON.stringify(userCred),
          headers: { "content-type": "application/json" },
        })
        const body = (await res.json()) as User
        const { userId } = getSession(res)

        const user = await getUserWithAuth(body.id)

        expect(res.status).to.equal(200)

        expect(user?.email).to.equal(userCred.email)
        expect(user?.userName).to.equal(userCred.userName)
        expect(await user?.checkPassword(userCred.password)).to.be.true

        expect(userId).to.equal(body.id)
      })

      it("409s if the user is already logged in", async () => {
        const user = await dataSource.manager.save(factoryUser())

        const res = await fetch(route, {
          method: "POST",
          body: JSON.stringify(userCred),
          headers: {
            "content-type": "application/json",
            ...getAuthCookie(user),
          },
        })

        expect(res.status).to.equal(409)
      })

      it("500s and noops if the user already exists", async () => {
        await dataSource.manager.save(factoryUser())

        const res = await fetch(route, {
          method: "POST",
          body: JSON.stringify(userCred),
          headers: {
            "content-type": "application/json",
          },
        })

        const userCount = await dataSource.manager.count(User)

        expect(res.status).to.equal(500)

        expect(userCount).to.equal(1)
      })
    })

    describe("PUT", () => {
      it("edits and returns the logged in user", async () => {
        const user = await dataSource.manager.save(factoryUser())
        const oldUser = await getUserWithAuth(user.id)

        const newEmail = "new@example.com"
        const newUserName = "newUserName"
        const newPassword = "newpw"

        const res = await fetch(route, {
          method: "PUT",
          body: JSON.stringify({
            password: userCred.password,
            updatedUserData: {
              email: newEmail,
              userName: newUserName,
              password: newPassword,
            },
          }),
          headers: {
            "content-type": "application/json",
            ...getAuthCookie(user),
          },
        })
        const body = (await res.json()) as User

        const editedUser = await getUserWithAuth(user.id)

        expect(res.status).to.equal(200)

        expect(editedUser?.email).not.to.equal(oldUser?.email)
        expect(editedUser?.userName).not.to.equal(oldUser?.userName)
        expect(editedUser?.password).not.to.equal(oldUser?.password)

        expect(editedUser?.email).to.equal(newEmail)
        expect(editedUser?.userName).to.equal(newUserName)
        expect(await editedUser?.checkPassword(newPassword)).to.be.true

        expect(body.id).to.equal(user.id)
        expect(body.email).to.equal(newEmail)
        expect(body.userName).to.equal(newUserName)
        expect(body.password).not.to.exist
      })

      it("handles partial updates", async () => {
        const user = await dataSource.manager.save(factoryUser())
        const oldUser = await getUserWithAuth(user.id)

        const newEmail = "new@example.com"

        const res = await fetch(route, {
          method: "PUT",
          body: JSON.stringify({
            password: userCred.password,
            updatedUserData: {
              email: newEmail,
            },
          }),
          headers: {
            "content-type": "application/json",
            ...getAuthCookie(user),
          },
        })
        const body = (await res.json()) as User

        const editedUser = await getUserWithAuth(user.id)

        expect(res.status).to.equal(200)

        expect(editedUser?.email).not.to.equal(oldUser?.email)
        expect(editedUser?.email).to.equal(newEmail)
        expect(body.email).to.equal(newEmail)
      })

      it("401 and noops if the confirmation password is wrong", async () => {
        const user = await dataSource.manager.save(factoryUser())
        const oldUser = await getUserWithAuth(user.id)

        const newEmail = "new@example.com"

        const res = await fetch(route, {
          method: "PUT",
          body: JSON.stringify({
            password: "wrongpw",
            updatedUserData: {
              email: newEmail,
            },
          }),
          headers: {
            "content-type": "application/json",
            ...getAuthCookie(user),
          },
        })

        const editedUser = await getUserWithAuth(user.id)

        expect(res.status).to.equal(401)

        expect(editedUser?.email).to.equal(oldUser?.email)
        expect(editedUser?.email).not.to.equal(newEmail)
      })

      it("401s and noops if the user is not authenticated", async () => {
        const user = await dataSource.manager.save(factoryUser())
        const oldUser = await getUserWithAuth(user.id)

        const newEmail = "new@example.com"

        const res = await fetch(route, {
          method: "PUT",
          body: JSON.stringify({
            password: userCred.password,
            updatedUserData: {
              email: newEmail,
            },
          }),
          headers: {
            "content-type": "application/json",
          },
        })

        const editedUser = await getUserWithAuth(user.id)

        expect(res.status).to.equal(401)

        expect(editedUser?.email).to.equal(oldUser?.email)
        expect(user.email).not.to.equal(newEmail)
      })
    })

    describe("DELETE", () => {
      it("deletes the logged in user and logs them out", async () => {
        const user = await dataSource.manager.save(factoryUser())

        const res = await fetch(route, {
          method: "DELETE",
          body: JSON.stringify({
            password: userCred.password,
          }),
          headers: {
            "content-type": "application/json",
            ...getAuthCookie(user),
          },
        })
        const { userId } = getSession(res)

        const deletedUser = await getUserWithAuth(user.id)

        expect(res.status).to.equal(204)

        expect(deletedUser).not.to.exist
        expect(userId).not.to.exist
      })

      it("401s and noops if the confirmation password is wrong", async () => {
        const user = await dataSource.manager.save(factoryUser())

        const res = await fetch(route, {
          method: "DELETE",
          body: JSON.stringify({
            password: "wrongpw",
          }),
          headers: {
            "content-type": "application/json",
            ...getAuthCookie(user),
          },
        })

        const unchangedUser = await getUserWithAuth(user.id)

        expect(res.status).to.equal(401)

        expect(unchangedUser).to.exist
      })

      it("401s and noops if the user is not authenticated", async () => {
        const user = await dataSource.manager.save(factoryUser())

        const res = await fetch(route, {
          method: "DELETE",
          body: JSON.stringify({
            password: userCred.password,
          }),
          headers: {
            "content-type": "application/json",
          },
        })

        const unchangedUser = await getUserWithAuth(user.id)

        expect(res.status).to.equal(401)

        expect(unchangedUser).to.exist
      })
    })
  })

  describe("/session", () => {
    describe("POST", () => {
      it("logs the user in and returns them", async () => {
        const user = await dataSource.manager.save(factoryUser())

        const res = await fetch(route + "/session", {
          method: "POST",
          body: JSON.stringify(userCred),
          headers: {
            "content-type": "application/json",
          },
        })
        const body = (await res.json()) as User
        const { userId } = getSession(res)

        expect(res.status).to.equal(200)

        expect(userId).to.equal(user.id)
        expect(body.id).to.equal(user.id)
      })

      it("401s and noops if credentials are incorrect", async () => {
        await dataSource.manager.save(factoryUser())

        const res = await fetch(route + "/session", {
          method: "POST",
          body: JSON.stringify({ ...userCred, password: "wrongpw" }),
          headers: {
            "content-type": "application/json",
          },
        })
        const { userId } = getSession(res)

        expect(res.status).to.equal(401)

        expect(userId).not.to.exist
      })

      it("409s and noops if the user is already logged in", async () => {
        const user = await dataSource.manager.save(factoryUser())

        const res = await fetch(route + "/session", {
          method: "POST",
          body: JSON.stringify(userCred),
          headers: {
            "content-type": "application/json",
            ...getAuthCookie(user),
          },
        })
        const { userId } = getSession(res)

        expect(res.status).to.equal(409)

        expect(userId).not.to.exist
      })
    })

    describe("DELETE", () => {
      it("logs the user out", async () => {
        const user = await dataSource.manager.save(factoryUser())

        const res = await fetch(route + "/session", {
          method: "DELETE",
          body: JSON.stringify(userCred),
          headers: {
            "content-type": "application/json",
            ...getAuthCookie(user),
          },
        })
        const { userId } = getSession(res)

        expect(res.status).to.equal(204)

        expect(userId).not.to.exist
      })

      it("401s if the user is not logged in", async () => {
        const res = await fetch(route + "/session", {
          method: "DELETE",
          body: JSON.stringify(userCred),
          headers: {
            "content-type": "application/json",
          },
        })

        expect(res.status).to.equal(401)
      })
    })
  })
})
