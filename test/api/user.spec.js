const {expect} = require(`chai`)
const request = require(`supertest`)

const app = require(`../../server`)
const Recipe = require(`../../server/db`).model(`recipe`)
const User = require(`../../server/db`).model(`user`)

const agent1 = request.agent(app)
const agent2 = request.agent(app)

describe(`API Route User: /api/user`, () => {
  const userCred = {email : `testUser@example.com`, password : `pw`}
  const user2Cred = {email : `testUser2@example.com`, password : `pw`}

  before(async () => {
    try{
      await Recipe.sync({force : true})
      await User.sync({force : true})
      await Promise.all([
        agent1.post(`/auth/signup`).send(userCred),
        agent2.post(`/auth/signup`).send(user2Cred),
      ])
      await Promise.all([
        agent1.post(`/api/recipe`).send({
          text : `text1`,
          title : `title1`,
        }),
        agent1.post(`/api/recipe`).send({
          text : `text2`,
          title : `title2`,
        }),
        agent2.post(`/api/recipe`).send({
          text : `text3`,
          title : `title3`,
        }),
      ])
    }catch(err){
      console.log(err)
    }
  })
  after(async () => {
    try{
      await Promise.all([
        agent1.post(`/auth/logout`),
        agent2.post(`/auth/logout`),
      ])
      await Recipe.sync({force : true})
      await User.sync({force : true})
    }catch(err){
      console.log(err)
    }
  })

  describe(`/`, () => {
    describe(`PUT`, () => {
      let res = null
      let oldSalt = null
      let newSalt = null
      before(async () => {
        try{
          let user = await User.findOne({where : {email : `testUser@example.com`}})
          oldSalt = user.dataValues.salt
          res = await agent1.put(`/api/user`).send({
            email : `new@example.com`,
            salt : `new salt`,
          })
          user = await User.findOne({where : {email : `new@example.com`}})
          newSalt = user.dataValues.salt
        }catch(err){
          console.log(err)
        }
      })

      it(`edits the logged in user`, async () => {
        const user = await User.findOne({where : {email : `new@example.com`}})
        expect(user).not.to.be.a(`null`)
      })
      it(`rejects unauthenticated users`, async () => {
        const failedRes = await request(app).put(`/api/user`).send({email : `failed@example.com`})
        const user = await User.findOne({where : {email : `failed@example.com`}})
        expect(failedRes.status).to.equal(401)
        expect(failedRes.text).to.equal(`Not logged in`)
        expect(user).to.be.a(`null`)
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
        try{
          res = await agent2.delete(`/api/user`)
        }catch(error){
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
        expect(failedRes.status).to.equal(401)
        expect(failedRes.text).to.equal(`Not logged in`)
      })
      it(`rejects unauthenticated users`, async () => {
        const failedRes = await request(app).delete(`/api/user`)
        expect(failedRes.status).to.equal(401)
        expect(failedRes.text).to.equal(`Not logged in`)
      })
      it(`redirects the user to the main page`, () => {
        expect(res.status).to.equal(302)
        expect(res.header[`location`]).to.equal(`/`)
      })
    })
  })

  describe(`/:id`, () => {
    describe(`GET`, () => {
      it(`returns the user and all their recipes`, async () => {
        const res = await request(app).get(`/api/user/1`)
        expect(res.status).to.equal(200)
        expect(res.body.email).to.equal(`new@example.com`)
        expect(res.body.recipes.length).to.equal(2)
      })
    })
  })
})
