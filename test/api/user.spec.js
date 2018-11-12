const {expect} = require(`chai`)
const request = require(`supertest`)

const app = require(`../../server`)
const User = require(`../../server/db`).model(`user`)
const Recipe = require(`../../server/db`).model(`recipe`)

const agent1 = request.agent(app)

describe(`API Route Recipe: /api/recipe`, () => {
  const userCred = {email : `testUser@example.com`, password : `pw`}

  before(async () => {
    try{
      await agent1.post(`/auth/signup`).send(userCred)
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
      // can't run in parallel for some arcane sequelize reason
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
          console.log(res.body)
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
  })
})

