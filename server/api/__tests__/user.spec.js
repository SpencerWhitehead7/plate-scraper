const { expect } = require(`chai`)
const request = require(`supertest`)

const app = require(`../..`)
const Recipe = require(`../../db`).model(`recipe`)
const User = require(`../../db`).model(`user`)

const agent1 = request.agent(app)

describe(`API Route User: /api/user`, () => {
  const userCred = {
    email: `testUser@example.com`,
    password: `pw`,
    userName: `testUser`,
  }

  before(async () => {
    try {
      await Recipe.sync({ force: true })
      await User.sync({ force: true })
      await agent1.post(`/auth/signup`).send(userCred)
      await agent1.post(`/api/recipe`).send({
        text: `text1`,
        title: `title1`,
      })
      await agent1.post(`/api/tag`).send({ name: `testtag`, recipeId: 1 })
    } catch (err) {
      console.log(err)
    }
  })
  after(async () => {
    try {
      await agent1.post(`/auth/logout`)
      await Recipe.sync({ force: true })
      await User.sync({ force: true })
    } catch (err) {
      console.log(err)
    }
  })

  describe(`/:id`, () => {
    describe(`GET`, () => {
      it(`returns the user, their recipes, and their recipes' tags`, async () => {
        const res = await request(app).get(`/api/user/1`)
        expect(res.status).to.equal(200)
        expect(res.body.id).to.equal(1)
        expect(res.body.email).to.equal(`testUser@example.com`)
        expect(res.body.userName).to.equal(`testUser`)
        expect(res.body.recipes).to.have.lengthOf(1)
        expect(res.body.recipes[0].tags).to.have.lengthOf(1)
      })
    })
  })
})
