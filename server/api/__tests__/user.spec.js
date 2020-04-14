const { expect } = require(`chai`)
const request = require(`supertest`)

const app = require(`../..`)
const Recipe = require(`../../db`).model(`recipe`)
const User = require(`../../db`).model(`user`)

const agent1 = request.agent(app)
const agent2 = request.agent(app)

describe(`API Route User: /api/user`, () => {
  const userCred = {
    email: `testUser@example.com`,
    password: `pw`,
    userName: `testUser`,
  }
  const user2Cred = {
    email: `testUser2@example.com`,
    password: `pw`,
    userName: `testUser2`,
  }

  before(async () => {
    try {
      await Recipe.sync({ force: true })
      await User.sync({ force: true })
      await agent1.post(`/auth/signup`).send(userCred)
      await agent2.post(`/auth/signup`).send(user2Cred)
      await agent1.post(`/api/recipe`).send({
        text: `text1`,
        title: `title1`,
      })
      await agent1.post(`/api/recipe`).send({
        text: `text2`,
        title: `title2`,
      })
      await agent1.post(`/api/tag`).send({ name: `testtag`, recipeId: 1 })
      await agent2.post(`/api/recipe`).send({
        text: `text3`,
        title: `title3`,
      })
    } catch (err) {
      console.log(err)
    }
  })
  after(async () => {
    try {
      await Promise.all([
        agent1.post(`/auth/logout`),
        agent2.post(`/auth/logout`),
      ])
      await Recipe.sync({ force: true })
      await User.sync({ force: true })
    } catch (err) {
      console.log(err)
    }
  })

  describe(`/`, () => {
    describe(`PUT`, () => {
      let res = null
      let oldSalt = null
      let newSalt = null
      before(async () => {
        try {
          let user = await User.findOne({ where: { email: `testUser@example.com` } })
          oldSalt = user.dataValues.salt
          res = await agent1.put(`/api/user`).send({
            newInfo: {
              email: `new@example.com`,
              salt: `new salt`,
              id: 10,
            },
            password: `pw`,
          })
          user = await User.findOne({ where: { email: `new@example.com` } })
          newSalt = user.dataValues.salt
        } catch (err) {
          console.log(err)
        }
      })

      it(`edits the logged in user`, async () => {
        const user = await User.findOne({ where: { email: `new@example.com` } })
        expect(user).not.to.be.a(`null`)
      })
      it(`rejects unauthenticated users`, async () => {
        const failedRes = await request(app).put(`/api/user`).send({ email: `failed@example.com` })
        const user = await User.findOne({ where: { email: `failed@example.com` } })
        expect(failedRes.status).to.equal(401)
        expect(failedRes.text).to.equal(`Not logged in`)
        expect(user).to.be.a(`null`)
      })
      it(`requires the user to submit their password to edit their info`, async () => {
        const failedRes1 = await agent1.put(`/api/user`).send({
          newInfo: { email: `new2@example.com` },
          password: `anIncorrectPassword`,
        })
        const failedRes2 = await agent2.put(`/api/user`).send({
          newInfo: { email: `new3@example.com` },
        })
        const failedUser1 = await User.findOne({ where: { email: `new2@example.com` } })
        const failedUser2 = await User.findOne({ where: { email: `new3@example.com` } })
        expect(failedRes1.status).to.equal(401)
        expect(failedRes2.status).to.equal(401)
        expect(failedUser1).to.be.a(`null`)
        expect(failedUser2).to.be.a(`null`)
      })
      it(`does not allow the user to edit their id`, () => {
        expect(res.body.id).to.equal(1)
      })
      it(`does not allow the user to edit salt`, () => {
        expect(oldSalt).to.equal(newSalt)
      })
      it(`returns the user`, () => {
        expect(res.status).to.equal(200)
        expect(res.body.id).to.equal(1)
        expect(res.body.email).to.equal(`new@example.com`)
      })
    })

    describe(`DELETE`, () => {
      let res = null
      before(async () => {
        try {
          res = await agent2.delete(`/api/user`)
        } catch (error) {
          console.log(error)
        }
      })
      it(`deletes the logged in user and their recipes`, async () => {
        const user = await User.findByPk(2)
        const remaining = await Recipe.findAll()
        expect(user).to.be.a(`null`)
        expect(remaining.length).to.equal(2)
      })
      it(`logs the user out`, async () => {
        const failedRes = await agent2.get(`/auth/me`)
        expect(failedRes.body).to.equal(``)
      })
      it(`rejects unauthenticated users`, async () => {
        const failedRes = await request(app).delete(`/api/user`)
        expect(failedRes.status).to.equal(401)
        expect(failedRes.text).to.equal(`Not logged in`)
      })
      it(`returns a 200`, () => {
        expect(res.status).to.equal(200)
      })
    })
  })

  describe(`/:id`, () => {
    let res = null
    before(async () => {
      try {
        res = await request(app).get(`/api/user/1`)
      } catch (err) {
        console.log(err)
      }
    })
    describe(`GET`, () => {
      it(`returns the user and all their recipes and all their recipes' tags`, () => {
        expect(res.status).to.equal(200)
        expect(res.body.email).to.equal(`new@example.com`)
      })
      it(`and all their recipes`, () => {
        expect(res.body.recipes.length).to.equal(2)
      })
      it(`and all their recipes' tags`, () => {
        expect(res.body.recipes[0].tags.length).to.equal(1)
      })
    })
  })
})
