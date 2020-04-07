const { expect } = require(`chai`)
const request = require(`supertest`)

const app = require(`../../server`)
const User = require(`../../server/db`).model(`user`)

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

  describe(`/signup`, () => {
    describe(`POST`, () => {
      it(`creates a user with the correct credentials in the database`, async () => {
        const testUser = await User.findOne({ where: { email: userCred.email } })
        expect(testUser.email).to.equal(userCred.email)
      })
      it(`also logs that user into the app`, async () => {
        const res = await agent.get(`/auth/me`)
        expect(res.status).to.equal(200)
      })
      it(`strips any spaces from the userName`, async () => {
        const res = await agent.get(`/auth/me`)
        expect(res.body.userName).to.equal(`testUser`)
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
        // using a one-off results in a lasting row in the sessions db
        await agent.post(`/auth/logout`)
        const res = await agent.post(`/auth/login`).send(userCred)
        expect(res.status).to.equal(200)
        expect(res.body.id).to.equal(1)
        expect(res.body.email).to.equal(`testUser@example.com`)
      })
      it(`returns a 401 if the user provides incorrect credentials`, async () => {
        const res = await request(app).post(`/auth/login`).send({ email: `testUser@example.com`, password: `wrongpw` })
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
        const res = await agent.get(`/auth/me`)
        expect(res.body).to.equal(``)
      })
      xit(`destroy's the user's session if the user is logged in`, async () => {
        // const res = await agent.post(`/auth/logout`)
        // TODO figure out how to test this
      })
      it(`redirects the user to the main page if the user is logged in`, async () => {
        const res = await agent.post(`/auth/logout`)
        expect(res.status).to.equal(302)
        expect(res.header[`location`]).to.equal(`/`)
      })
      it(`returns a 401 if the user is not logged in`, async () => {
        const res = await request(app).post(`/auth/logout`)
        expect(res.status).to.equal(401)
        expect(res.text).to.equal(`Not logged in`)
      })
    })
  })

  describe(`the /me route`, () => {
    describe(`GET`, () => {
      it(`if the user is not logged in, it returns 200 with no body`, async () => {
        const res = await request(app).get(`/auth/me`)
        expect(res.status).to.equal(200)
        expect(res.body).to.equal(``)
      })
      it(`if the user is logged in, it returns 200 with the user's information`, async () => {
        const res = await agent.get(`/auth/me`)
        expect(res.status).to.equal(200)
        expect(res.body.id).to.equal(1)
        expect(res.body.email).to.equal(`testUser@example.com`)
      })
    })
  })
})
