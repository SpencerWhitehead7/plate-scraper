import { expect } from "chai"
import request from "supertest"

import { app, dataSource, syncDB, userCred } from "../../../mochaSetup"
import { User } from "../../db/entities"
import { Session } from "../../logic/auth"

describe("API Route Auth: /api/auth", () => {
  const route = "/api/auth"

  let agent: request.SuperAgentTest

  const getUserWithAuth = async () =>
    await dataSource.manager
      .createQueryBuilder()
      .select("user")
      .from(User, "user")
      .addSelect("user.password")
      .where("id = :id", { id: 1 })
      .getOne()

  beforeEach(async () => {
    try {
      await syncDB()
      agent = request.agent(app)
      await agent.post(route).send(userCred)
    } catch (err) {
      console.log(err)
    }
  })

  afterEach(async () => {
    try {
      await agent.delete(`${route}/session`)
      await syncDB()
    } catch (err) {
      console.log(err)
    }
  })

  describe("/", () => {
    describe("GET", () => {
      it("if the user is not logged in, it returns 200 with no body", async () => {
        const res = await request(app).get(route)
        expect(res.status).to.equal(200)
        expect(res.body).to.be.null
      })
      it("if the user is logged in, it returns 200 with the user's information", async () => {
        const res = await agent.get(route)
        const bodyUser = res.body as User
        expect(res.status).to.equal(200)
        expect(bodyUser.id).to.equal(1)
      })
    })

    describe("POST", () => {
      it("creates a user with the correct credentials in the database", async () => {
        const user = await getUserWithAuth()
        expect(user?.email).to.equal(userCred.email)
        expect(user?.userName).to.equal(userCred.userName)
        expect(await user?.checkPassword(userCred.password)).to.be.true
      })
      it("also logs that user into the app", async () => {
        const res = await agent.get(route)
        const bodyUser = res.body as User
        expect(bodyUser.id).to.equal(1)
        expect(bodyUser.email).to.equal(userCred.email)
        expect(bodyUser.userName).to.equal(userCred.userName)
      })
      it("returns a 409 if the user is already logged in", async () => {
        const res = await agent.post(route).send(userCred)
        expect(res.status).to.equal(409)
      })
      it("returns a 500 if the user already exists", async () => {
        const res = await request(app).post(route).send(userCred)
        expect(res.status).to.equal(500)
      })
    })

    describe("PUT", () => {
      it("edits and returns the logged in user", async () => {
        const oldUser = await getUserWithAuth()
        const newEmail = "new@example.com"
        const newUserName = "newUserName"
        const newPassword = "newpw"
        const res = await agent.put(route).send({
          newEmail,
          newUserName,
          newPassword,
          password: userCred.password,
        })
        const bodyUser = res.body as User
        const editedUser = await getUserWithAuth()
        expect(editedUser?.email).not.to.equal(oldUser?.email)
        expect(editedUser?.userName).not.to.equal(oldUser?.userName)
        expect(editedUser?.password).not.to.equal(oldUser?.password)
        expect(editedUser?.email).to.equal(newEmail)
        expect(editedUser?.userName).to.equal(newUserName)
        expect(await editedUser?.checkPassword(newPassword)).to.be.true
        expect(bodyUser.email).to.equal(newEmail)
        expect(bodyUser.userName).to.equal(newUserName)
        expect(bodyUser.password).not.to.exist
      })
      it("handles partial updates", async () => {
        const oldUser = await getUserWithAuth()
        const newEmail = "new@example.com"
        const res = await agent.put(route).send({
          newEmail,
          password: userCred.password,
        })
        const bodyUser = res.body as User
        const editedUser = await getUserWithAuth()
        expect(editedUser?.email).not.to.equal(oldUser?.email)
        expect(editedUser?.userName).to.equal(oldUser?.userName)
        expect(editedUser?.password).to.equal(oldUser?.password)
        expect(editedUser?.email).to.equal(newEmail)
        expect(await editedUser?.checkPassword(userCred.password)).to.be.true
        expect(bodyUser.email).to.equal(newEmail)
        expect(bodyUser.userName).to.equal(oldUser?.userName)
        expect(bodyUser.password).not.to.exist
      })
      it("returns a 401 and does not edit the user if the user sends the wrong confirmation password", async () => {
        const newEmail = "new@example.com"
        const res = await agent
          .put(route)
          .send({ newEmail, password: "wrongpw" })
        const user = await dataSource.manager.findOneByOrFail(User, { id: 1 })
        expect(user.email).not.to.equal(newEmail)
        expect(res.status).to.equal(401)
      })
      it("returns a 401 if the user is not logged in", async () => {
        const newEmail = "new@example.com"
        const res = await request(app)
          .put(route)
          .send({ newEmail, password: "pw" })
        const user = await dataSource.manager.findOneByOrFail(User, { id: 1 })
        expect(user.email).not.to.equal(newEmail)
        expect(res.status).to.equal(401)
      })
    })

    describe("DELETE", () => {
      it("deletes the logged in user ", async () => {
        const res = await agent
          .delete(route)
          .send({ password: userCred.password })
        const user = await dataSource.manager.findOneBy(User, { id: 1 })
        expect(res.status).to.equal(204)
        expect(user).not.to.exist
      })
      it("logs out the logged in user", async () => {
        await agent.delete(route).send({ password: userCred.password })
        const res = await agent.get(route)
        expect(res.body).to.be.null
      })
      it("returns a 401 and does not delete the user if the user sends the wrong confirmation password", async () => {
        const res = await agent.delete(route).send({ password: "wrongpw" })
        const user = await dataSource.manager.findOneBy(User, { id: 1 })
        expect(user).to.exist
        expect(res.status).to.equal(401)
      })
      it("returns a 401 if the user is not logged in", async () => {
        const res = await request(app)
          .delete(route)
          .send({ password: userCred.password })
        expect(res.status).to.equal(401)
      })
    })
  })

  describe("/session", () => {
    describe("POST", () => {
      it("logs the user in if they provide correct credentials and returns the user", async () => {
        await agent.delete(`${route}/session`)

        const res = await agent.post(`${route}/session`).send(userCred)
        const bodyUser = res.body as User
        expect(res.status).to.equal(200)
        expect(bodyUser.id).to.equal(1)
      })
      it("returns a 401 if the user provides incorrect credentials", async () => {
        await agent.delete(`${route}/session`)
        const res = await agent
          .post(`${route}/session`)
          .send({ ...userCred, password: "wrongpw" })
        expect(res.status).to.equal(401)
      })
      it("returns a 409 if the user is already logged in", async () => {
        const res = await agent.post(`${route}/session`).send(userCred)
        expect(res.status).to.equal(409)
      })
    })

    describe("DELETE", () => {
      it("logs the user out if the user is logged in", async () => {
        const res = await agent.delete(`${route}/session`)
        const loggedInUser = await agent.get(route)
        expect(res.status).to.equal(204)
        expect(loggedInUser.body).to.be.null
      })
      it("destroy's the user's session if the user is logged in", async () => {
        const oneLoggedInSession = await dataSource.manager.find(Session)
        await agent.delete(`${route}/session`)
        const noLoggedInSessions = await dataSource.manager.find(Session)

        expect(oneLoggedInSession).to.have.lengthOf(1)
        expect(noLoggedInSessions).to.have.lengthOf(0)
      })
      it("returns a 401 if the user is not logged in", async () => {
        const res = await request(app).delete(`${route}/session`)
        expect(res.status).to.equal(401)
      })
    })
  })
})
