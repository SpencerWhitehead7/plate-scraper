const {expect} = require(`chai`)
const request = require(`supertest`)

const app = require(`../../server`)
const Recipe = require(`../../server/db`).model(`recipe`)
const User = require(`../../server/db`).model(`user`)

const agent1 = request.agent(app)
const agent2 = request.agent(app)

describe(`API Route Recipe: /api/recipe`, () => {
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

  describe(`/`, () => {
    describe(`GET`, () => {
      it(`returns all recipes`, async () => {
        const res = await request(app).get(`/api/recipe`)
        expect(res.status).to.equal(200)
        expect(res.body.length).to.equal(2)
      })
    })

    describe(`POST`, () => {
      let res = null
      before(async () => {
        try{
          res = await agent1.post(`/api/recipe`).send({
            text : `testText3`,
            title : `title3`,
            createdBy : 10,
            forkedCount : 10,
            userId : 10,
          })
        }catch(err){
          console.log(err)
        }
      })

      it(`creates a recipe`, async () => {
        const recipe = await Recipe.findByPk(3)
        expect(recipe).not.to.be.a(`null`)
      })
      it(`rejects unauthenticated users' attempts`, async () => {
        const failedRes = await request(app).post(`/api/recipe`).send({text : `failedText`, title : `failedText`, createdBy : 1})
        const recipe = await Recipe.findOne({where : {text : `failedText`}})
        expect(failedRes.status).to.equal(401)
        expect(failedRes.text).to.equal(`Not logged in`)
        expect(recipe).to.be.a(`null`)
      })
      it(`sets createdBy to the user's ID, even with bad input`, async () => {
        const recipe = await Recipe.findByPk(3)
        expect(recipe.createdBy).to.equal(1)
      })
      it(`ensures forkedCount will use default value of 0, even with bad input`, async () => {
        const recipe = await Recipe.findByPk(3)
        expect(recipe.forkedCount).to.equal(0)
      })
      it(`sets the recipe's owner to the creator`, async () => {
        const recipe = await Recipe.findByPk(3)
        expect(recipe.userId).to.equal(1)
      })
      it(`returns the recipe`, () => {
        expect(res.status).to.equal(200)
        expect(res.body.id).to.equal(3)
        expect(res.body.text).to.equal(`testText3`)
        expect(res.body.title).to.equal(`title3`)
        expect(res.body.sourceSite).to.equal(`User Upload`)
        expect(res.body.sourceUrl).to.equal(`User Upload`)
        expect(res.body.createdBy).to.equal(1)
        expect(res.body.forkedCount).to.equal(0)
        expect(res.body.userId).to.equal(1)
      })
    })
  })

  describe(`/:id`, () => {
    describe(`GET`, () => {
      it(`returns the recipe with the matching ID`, async () => {
        const res = await request(app).get(`/api/recipe/1`)
        expect(res.status).to.equal(200)
        expect(res.body.id).to.equal(1)
      })
    })

    describe(`PUT`, () => {
      let res = null
      before(async () => {
        try{
          res = await agent1.put(`/api/recipe/3`).send({
            id : 10,
            text : `newText`,
            title : `newTitle`,
            sourceSite : `new site`,
            sourceUrl : `new url`,
            createdBy : 10,
            forkedCount : 10,
            userId : 10,
          })
        }catch(err){
          console.log(err)
        }
      })

      it(`edits a recipe`, async () => {
        const recipe = await Recipe.findByPk(3)
        expect(recipe.text).to.equal(`newText`)
      })
      it(`rejects unauthenticated users' attempts`, async () => {
        const failedRes = await request(app).put(`/api/recipe/3`).send({text : `failedText`})
        const recipe = await Recipe.findOne({where : {text : `failedText`}})
        expect(failedRes.status).to.equal(401)
        expect(failedRes.text).to.equal(`Not logged in`)
        expect(recipe).to.be.a(`null`)
      })
      it(`rejects attempts to edit a recipe the user does not own`, async () => {
        const failedRes = await agent2.put(`/api/recipe/3`).send({text : `failedText`})
        const recipe = await Recipe.findOne({where : {text : `failedText`}})
        expect(failedRes.status).to.equal(401)
        expect(failedRes.text).to.equal(`Permission denied`)
        expect(recipe).to.be.a(`null`)
      })
      it(`allows users to edit only text and title, even if they attempt to edit other fields`, () => {
        expect(res.body.id).to.equal(3)
        expect(res.body.sourceSite).to.equal(`User Upload`)
        expect(res.body.sourceUrl).to.equal(`User Upload`)
        expect(res.body.createdBy).to.equal(1)
        expect(res.body.forkedCount).to.equal(0)
        expect(res.body.userId).to.equal(1)
      })
      it(`returns the recipe`, () => {
        expect(res.status).to.equal(200)
        expect(res.body.id).to.equal(3)
        expect(res.body.text).to.equal(`newText`)
        expect(res.body.title).to.equal(`newTitle`)
        expect(res.body.sourceSite).to.equal(`User Upload`)
        expect(res.body.sourceUrl).to.equal(`User Upload`)
        expect(res.body.createdBy).to.equal(1)
        expect(res.body.forkedCount).to.equal(0)
        expect(res.body.userId).to.equal(1)
      })
    })

    describe(`DELETE`, () => {
      let res = null
      before(async () => {
        try{
          res = await agent1.delete(`/api/recipe/3`)
        }catch(error){
          console.log(error)
        }
      })
      it(`deletes a recipe`, async () => {
        const recipe = await Recipe.findAll()
        expect(res.status).to.equal(200)
        expect(recipe.length).to.equal(2)
      })
      it(`rejects unauthenticated users' attempts`, async () => {
        const failedRes = await request(app).delete(`/api/recipe/2`)
        const recipe = await Recipe.findByPk(2)
        expect(failedRes.status).to.equal(401)
        expect(failedRes.text).to.equal(`Not logged in`)
        expect(recipe).not.to.be.a(`null`)
      })
      it(`rejects attempts to edit a recipe the user does not own`, async () => {
        const failedRes = await agent2.delete(`/api/recipe/2`)
        const recipe = await Recipe.findByPk(2)
        expect(failedRes.status).to.equal(401)
        expect(failedRes.text).to.equal(`Permission denied`)
        expect(recipe).not.to.be.a(`null`)
      })
    })
  })
})
