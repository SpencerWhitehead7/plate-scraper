const { expect } = require(`chai`)
const request = require(`supertest`)

const app = require(`../..`)
const User = require(`../../db`).model(`user`)

const agent = request.agent(app)

describe(`Auth Route: /auth`, () => {
  const userCred = {
    email: `testUser@example.com`,
    password: `pw`,
    userName: `testUser`,
  }

  beforeEach(async () => {
    try {
      await User.sync({ force: true })
      await agent.post(`/auth/signup`).send(userCred)
    } catch (err) {
      console.log(err)
    }
  })
  afterEach(async () => {
    try {
      await agent.post(`/auth/logout`)
      await User.sync({ force: true })
    } catch (err) {
      console.log(err)
    }
  })

  describe(`/`, () => {
    describe(`GET`, () => {
      it(`if the user is not logged in, it returns 200 with no body`, async () => {
        const res = await request(app).get(`/auth`)
        expect(res.status).to.equal(200)
        expect(res.body).to.equal(``)
      })
      it(`if the user is logged in, it returns 200 with the user's information`, async () => {
        const res = await agent.get(`/auth`)
        expect(res.status).to.equal(200)
        expect(res.body.id).to.equal(1)
      })
    })

    describe(`PUT`, () => {
      it(`edits the logged in user`, async () => {
        const oldUser = await User.findByPk(1)
        const newEmail = `new@example.com`
        const newUserName = `newUserName`
        const newPassword = `newpw`
        await agent.put(`/auth`).send({
          newEmail,
          newUserName,
          newPassword,
          password: userCred.password,
        })
        const editedUser = await User.findByPk(1)
        expect(editedUser.email).not.to.equal(oldUser.email)
        expect(editedUser.userName).not.to.equal(oldUser.userName)
        expect(editedUser.password()).not.to.equal(oldUser.password())
        expect(editedUser.email).to.equal(newEmail)
        expect(editedUser.userName).to.equal(newUserName)
        expect(editedUser.correctPassword(newPassword)).to.be.true
      })
      it(`returns a 401 and does not edit the user if the user sends the wrong confirmation password`, async () => {
        const newEmail = `new@example.com`
        const res = await agent.put(`/auth`).send({ newEmail, password: `wrongpw` })
        const user = await User.findByPk(1)
        expect(user.email).not.to.equal(newEmail)
        expect(res.status).to.equal(401)
        expect(res.text).to.equal(`Unauthorized`)
      })
      it(`returns a 401 if the user is not logged in`, async () => {
        const res = await request(app).put(`/auth`).send({ newEmail: `new@example.com`, password: `pw` })
        expect(res.status).to.equal(401)
        expect(res.text).to.equal(`Not logged in`)
      })
    })
  })

  describe(`/signup`, () => {
    describe(`POST`, () => {
      it(`creates a user with the correct credentials in the database`, async () => {
        const testUser = await User.findByPk(1)
        expect(testUser.email).to.equal(userCred.email)
        expect(testUser.userName).to.equal(userCred.userName)
        expect(testUser.correctPassword(userCred.password)).to.be.true
      })
      it(`also logs that user into the app`, async () => {
        const res = await agent.get(`/auth`)
        expect(res.body.id).to.equal(1)
        expect(res.body.email).to.equal(userCred.email)
        expect(res.body.userName).to.equal(userCred.userName)
      })
      it(`returns a 409 if the user is already logged in`, async () => {
        const res = await agent.post(`/auth/signup`).send(userCred)
        expect(res.status).to.equal(409)
        expect(res.text).to.equal(`Already logged in to an account`)
      })
      it(`returns a 409 if the user already exists`, async () => {
        const res = await request(app).post(`/auth/signup`).send(userCred)
        expect(res.status).to.equal(409)
        expect(res.text).to.equal(`Validation error`)
      })
    })
  })

  describe(`/login`, () => {
    describe(`POST`, () => {
      it(`logs the user in if they provide correct credentials`, async () => {
        await agent.post(`/auth/logout`)
        const res = await agent.post(`/auth/login`).send(userCred)
        expect(res.status).to.equal(200)
        expect(res.body.id).to.equal(1)
      })
      it(`returns a 401 if the user provides incorrect credentials`, async () => {
        await agent.post(`/auth/logout`)
        const res = await agent.post(`/auth/login`).send({ email: `testUser@example.com`, password: `wrongpw` })
        expect(res.status).to.equal(401)
        expect(res.text).to.equal(`Wrong username or password`)
      })
      it(`returns a 409 if the user is already logged in`, async () => {
        const res = await agent.post(`/auth/login`).send(userCred)
        expect(res.status).to.equal(409)
        expect(res.text).to.equal(`Already logged in to an account`)
      })
    })
  })

  describe(`/logout`, () => {
    describe(`POST`, () => {
      it(`logs the user out if the user is logged in`, async () => {
        await agent.post(`/auth/logout`)
        const res = await agent.get(`/auth`)
        expect(res.body).to.equal(``)
      })
      xit(`destroy's the user's session if the user is logged in`, async () => {
        // const res = await agent.post(`/auth/logout`)
        // TODO figure out how to test this
      })
      it(`returns a 204 if the user logged out successfully`, async () => {
        const res = await agent.post(`/auth/logout`)
        expect(res.status).to.equal(204)
      })
      it(`returns a 401 if the user is not logged in`, async () => {
        const res = await request(app).post(`/auth/logout`)
        expect(res.status).to.equal(401)
        expect(res.text).to.equal(`Not logged in`)
      })
    })
  })

  describe(`/destroy`, () => {
    describe(`POST`, () => {
      it(`deletes the logged in user `, async () => {
        const res = await agent.post(`/auth/destroy`).send({ password: userCred.password })
        const user = await User.findByPk(1)
        expect(res.status).to.equal(200)
        expect(user).to.be.null
      })
      it(`logs out the logged in user`, async () => {
        await agent.post(`/auth/destroy`).send({ password: userCred.password })
        const res = await agent.get(`/auth`)
        expect(res.body).to.equal(``)
      })
      it(`returns a 401 and does not delete the user if the user sends the wrong confirmation password`, async () => {
        const res = await agent.post(`/auth/destroy`).send({ password: `wrongpw` })
        const user = await User.findByPk(1)
        expect(user).to.exist
        expect(res.status).to.equal(401)
        expect(res.text).to.equal(`Unauthorized`)
      })
      it(`returns a 401 if the user is not logged in`, async () => {
        const res = await request(app).post(`/auth/destroy`).send({ password: userCred.password })
        expect(res.status).to.equal(401)
        expect(res.text).to.equal(`Not logged in`)
      })
    })
  })
})
