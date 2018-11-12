const {expect} = require(`chai`)
const request = require(`supertest`)

const app = require(`../../server`)
const db = require(`../../server/db`)
const User = db.model(`user`)
const Recipe = db.model(`recipe`)

const agent = request.agent(app)

describe(`API Route Recipe: /api/recipe`, () => {
  const userCred = {email : `testUser@example.com`, password : `pw`}
  const createRecipe = i => Recipe.create({
    text : `text${i}`,
    title : `title${i}`,
    createdBy : i + 1,
  })

  before(async () => {
    try{
      const promises = []
      for(let i = 0; i < 2; i++){
        promises.push(createRecipe(i))
      }
      promises.push(User.create(userCred))
      await Promise.all(promises)
    }catch(err){
      console.log(err)
    }
  })
  after(async () => {
    try{
      // can't run in parallel for some arcane sequelize reason
      await Recipe.sync({force : true})
      await User.sync({force : true})
    }catch(err){
      console.log(err)
    }
  })

  describe(`/`, () => {
    describe(`GET`, () => {
      it(`returns all the recipes in the database`, async () => {
        const res = await request(app).get(`/api/recipe`)
        expect(res.status).to.equal(200)
        expect(res.body.length).to.equal(2)
      })
    })

    describe(`POST`, () => {
      before(async () => {
        try{
          await agent.post(`/auth/login`).send(userCred)
          await agent.post(`/api/recipe`).send({
            text : `testText1`,
            title : `title`,
            createdBy : 10,
            forkedCount : 10,
          })
        }catch(err){
          console.log(err)
        }
      })

      it(`creates a new recipe in the database`, async () => {
        const recipe = await Recipe.findOne({where : {text : `testText1`}})
        expect(recipe).not.to.be.a(`null`)
      })
      it(`rejects unauthenticated users' attempts`, async () => {
        await agent.post(`/auth/logout`)
        const res = await agent.post(`/api/recipe`).send({text : `testText2`, title : `title`, createdBy : 1})
        const recipe = await Recipe.findOne({where : {text : `testText2`}})
        await agent.post(`/auth/login`).send(userCred)
        expect(res.status).to.equal(401)
        expect(recipe).to.be.a(`null`)
      })
      it(`sets createdBy to the user's ID, even with bad input`, async () => {
        const recipe = await Recipe.findOne({where : {text : `testText1`}})
        expect(recipe.createdBy).to.equal(1)
      })
      it(`ensures forkedCount will use default value of 0, even with bad input`, async () => {
        const recipe = await Recipe.findOne({where : {text : `testText1`}})
        expect(recipe.forkedCount).to.equal(0)
      })
      it(`returns the recipe`, async () => {
      })
    })
  })
})
