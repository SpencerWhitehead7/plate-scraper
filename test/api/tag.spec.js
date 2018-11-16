const {expect} = require(`chai`)
const request = require(`supertest`)

const app = require(`../../server`)
const Recipe = require(`../../server/db`).model(`recipe`)
const RecipeTraits = require(`../../server/db`).model(`recipeTraits`)
const Tag = require(`../../server/db`).model(`tag`)
const User = require(`../../server/db`).model(`user`)

const agent1 = request.agent(app)
const agent2 = request.agent(app)

describe(`API Route User: /api/tag`, () => {
  const userCred = {
    email : `testUser@example.com`,
    password : `pw`,
    userName : `testUser`,
  }
  const user2Cred = {
    email : `testUser2@example.com`,
    password : `pw`,
    userName : `testUser2`,
  }

  before(async () => {
    try{
      await Recipe.sync({force : true})
      await RecipeTraits.sync({force : true})
      await Tag.sync({force : true})
      await User.sync({force : true})
      await Promise.all([
        agent1.post(`/auth/signup`).send(userCred),
        agent2.post(`/auth/signup`).send(user2Cred),
      ])
      await Promise.all([
        agent1.post(`/api/recipe`).send({
          text : `text`,
          title : `title`,
        }),
        Tag.create({name : `testone`}),
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
      await RecipeTraits.sync({force : true})
      await Tag.sync({force : true})
      await User.sync({force : true})
    }catch(err){
      console.log(err)
    }
  })

  describe(`/`, () => {
    describe(`POST`, () => {
      let res = null
      before(async () => {
        try{
          res = await agent1.post(`/api/tag`).send({name : `testtwo`, recipeId : 1})
        }catch(error){
          console.log(error)
        }
      })
      // flowchart style, not priority style
      it(`rejects unauthenticated users' attempts`, async () => {
        const failedRes = await request(app).post(`/api/tag`).send({name : `failedtest`, recipeId : 1})
        const failedTag = await Tag.findOne({where : {name : `failedtest`}})
        expect(failedRes.status).to.equal(401)
        expect(failedRes.text).to.equal(`Not logged in`)
        expect(failedTag).to.be.a(`null`)
      })
      it(`rejects attempts to tag non-existant recipes`, async () => {
        const failedRes = await agent1.post(`/api/tag`).send({name : `failedtest`, recipeId : 2})
        const failedTag = await Tag.findOne({where : {name : `failedtest`}})
        expect(failedRes.status).to.equal(500)
        expect(failedRes.text).to.equal(`No such recipe`)
        expect(failedTag).to.be.a(`null`)
      })
      it(`rejects attempts of users who are not the recipe's owner`, async () => {
        const failedRes = await agent2.post(`/api/tag`).send({name : `failedtest`, recipeId : 1})
        const failedTag = await Tag.findOne({where : {name : `failedtest`}})
        expect(failedRes.status).to.equal(401)
        expect(failedRes.text).to.equal(`Permission denied`)
        expect(failedTag).to.be.a(`null`)
      })
      it(`name is lowercased and non-alphas are stripped`, async () => {
        await agent1.post(`/api/tag`).send({name : `name &7-Ab`, recipeId : 1})
        const updatedRecipe = await agent1.get(`/api/recipe/byid/1`)
        expect(updatedRecipe.body.tags[1].name).to.equal(`nameab`)
      })
      it(`if the tag does not exist, it creates the tag in the database`, async () => {
        const tag = await Tag.findOne({where : {name : `testtwo`}})
        expect(tag).not.to.be.an(`null`)
      })
      it(`if the tag does exist, it just assigns it to the given recipe`, async () => {
        await agent1.post(`/api/tag`).send({name : `testone`, recipeId : 1})
        const updatedRecipe = await agent1.get(`/api/recipe/byid/1`)
        expect(updatedRecipe.body.tags.length).to.equal(3)
      })
      it(`it assigns the tag to the given recipe and returns the updated recipe with its tags`, () => {
        expect(res.status).to.equal(200)
        expect(res.body.id).to.equal(1)
        expect(res.body.text).to.equal(`text`)
        expect(res.body.title).to.equal(`title`)
        expect(res.body.tags[0].id).to.equal(2)
      })
    })
  })

  describe(`/:recipeId/:tagId`, () => {
    describe(`DELETE`, () => {
      let res = null
      before(async () => {
        try{
          res = await agent1.delete(`/api/tag/1/3`)
        }catch(error){
          console.log(error)
        }
      })
      // flowchart style, not priority style
      it(`rejects unauthenticated users' attempts`, async () => {
        const failedRes = await request(app).delete(`/api/tag/1/2`)
        const failedRecipe = await Recipe.findByPk(1, {include : [Tag]})
        expect(failedRes.status).to.equal(401)
        expect(failedRes.text).to.equal(`Not logged in`)
        expect(failedRecipe.dataValues.tags.length).to.equal(2)
      })
      it(`rejects attempts to untag non-existant recipes`, async () => {
        const failedRes = await agent1.delete(`/api/tag/2/1`)
        expect(failedRes.status).to.equal(500)
        expect(failedRes.text).to.equal(`No such recipe`)
      })
      it(`rejects attempts of users who are not the recipe's owner`, async () => {
        const failedRes = await agent2.delete(`/api/tag/1/2`)
        expect(failedRes.status).to.equal(401)
        expect(failedRes.text).to.equal(`Permission denied`)
      })
      it(`it removes the tag from the recipe and returns the recipe with its tags`, () => {
        expect(res.status).to.equal(200)
        expect(res.body.id).to.equal(1)
        expect(res.body.text).to.equal(`text`)
        expect(res.body.title).to.equal(`title`)
        expect(res.body.tags.length).to.equal(2)
      })
    })
  })
})
