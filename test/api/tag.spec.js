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
  const userCred = {email : `testUser@example.com`, password : `pw`}
  const user2Cred = {email : `testUser2@example.com`, password : `pw`}

  before(async () => {
    try{
      await agent1.post(`/auth/signup`).send(userCred)
      await agent2.post(`/auth/signup`).send(user2Cred)
      await agent1.post(`/api/recipe`).send({
        text : `testText`,
        title : `testTitle`,
      })
      await Tag.create({name : `testone`})
    }catch(err){
      console.log(err)
    }
  })
  after(async () => {
    try{
      await agent1.post(`/auth/logout`)
      await agent2.post(`/auth/logout`)
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
      it(`rejects attempts to tag to a non-existant recipe`, async () => {
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
        const updatedRecipe = await agent1.get(`/api/recipe/1`)
        expect(updatedRecipe.body.tags[1].name).to.equal(`nameab`)
      })
      it(`if the tag does not exist, it creates the tag in the database`, async () => {
        const tag = await Tag.findOne({where : {name : `testtwo`}})
        expect(tag).not.to.be.an(`null`)
      })
      it(`if the tag does exist, it just assigns it to the given recipe`, async () => {
        await agent1.post(`/api/tag`).send({name : `testone`, recipeId : 1})
        const updatedRecipe = await agent1.get(`/api/recipe/1`)
        expect(updatedRecipe.body.tags.length).to.equal(3)
      })
      it(`it assigns the tag to the given recipe and returns the recipe with its tags`, () => {
        expect(res.status).to.equal(200)
        expect(res.body.id).to.equal(1)
        expect(res.body.text).to.equal(`testText`)
        expect(res.body.title).to.equal(`testTitle`)
        expect(res.body.tags[0].id).to.equal(2)
      })
    })
  })
})
