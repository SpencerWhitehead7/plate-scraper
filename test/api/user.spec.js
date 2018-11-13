const {expect} = require(`chai`)
const request = require(`supertest`)

const app = require(`../../server`)
const User = require(`../../server/db`).model(`user`)
const Recipe = require(`../../server/db`).model(`recipe`)

const agent1 = request.agent(app)
const agent2 = request.agent(app)

describe(`API Route User: /api/user`, () => {
  const userCred = {email : `testUser@example.com`, password : `pw`}
  const user2Cred = {email : `testUser2@example.com`, password : `pw`}

  before(async () => {
    try{
      await agent1.post(`/auth/signup`).send(userCred)
      await agent2.post(`/auth/signup`).send(user2Cred)
      await agent1.post(`/api/recipe`).send({
        text : `testText1`,
        title : `title1`,
      })
      await agent1.post(`/api/recipe`).send({
        text : `testText2`,
        title : `title2`,
      })
    }catch(err){
      console.log(err)
    }
  })
  after(async () => {
    try{
      await agent1.post(`/auth/logout`)
      await agent2.post(`/auth/logout`)
      await Recipe.sync({force : true})
      await User.sync({force : true})
    }catch(err){
      console.log(err)
    }
  })

  describe(`/:id`, () => {
    describe(`GET`, () => {
      let res = null
      before(async () => {
        try{
          res = await request(app).get(`/api/user/1`)
        }catch(error){
          console.log(error)
        }
      })

      it(`returns the user`, () => {
        expect(res.status).to.equal(200)
        expect(res.body.email).to.equal(`testUser@example.com`)
      })
      it(`and all their recipes`, () => {
        expect(res.body.recipes.length).to.equal(2)
      })
    })

    describe(`PUT`, () => {
      let res = null
      let oldSalt = null
      let newSalt = null
      before(async () => {
        try{
          let user = await User.findOne({where : {email : `testUser@example.com`}})
          oldSalt = user.dataValues.salt
          res = await agent1.put(`/api/user/1`).send({
            email : `new@example.com`,
            salt : `new salt`,
          })
          user = await User.findOne({where : {email : `new@example.com`}})
          newSalt = user.dataValues.salt
        }catch(err){
          console.log(err)
        }
      })

      it(`edits a user`, async () => {
        const user = await User.findOne({where : {email : `new@example.com`}})
        expect(user).not.to.be.a(`null`)
      })
      it(`rejects unauthenticated users' attempts`, async () => {
        const failedRes = await request(app).put(`/api/user/1`).send({email : `failed@example.com`})
        const user = await User.findOne({where : {email : `failed@example.com`}})
        expect(failedRes.status).to.equal(401)
        expect(failedRes.text).to.equal(`Not logged in`)
        expect(user).to.be.a(`null`)
      })
      it(`rejects attempts to edit users other than the logged in user`, async () => {
        const failedRes = await agent2.put(`/api/user/1`).send({email : `failed@example.com`})
        const user = await User.findOne({where : {email : `failed@example.com`}})
        expect(failedRes.status).to.equal(401)
        expect(failedRes.text).to.equal(`Permission denied`)
        expect(user).to.be.a(`null`)
      })
      it(`does not allow you to edit the user's salt`, () => {
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
          res = await agent1.delete(`/api/user/1`)
        }catch(error){
          console.log(error)
        }
      })
      it(`deletes a user`, async () => {
        const user = await User.findByPk(1)
        expect(res.status).to.equal(200)
        expect(user).to.be.a(`null`)
      })
    })
  })
})
