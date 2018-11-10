/* eslint-disable init-declarations */

const {expect} = require(`chai`)
const request = require(`supertest`)
const app = require(`../../server`)
const db = require(`../../server/db`)
const User = db.model(`user`)
const Recipe = db.model(`recipe`)

describe(`API Route: /api/recipe`, () => {
  before(async () => {
    try{
      await User.sync({force : true})
      await Recipe.sync({force : true}) // can't run in parallel for arcance sequelize reasons
      const recipe1Promise = Recipe.create({text : `text1`, title : `title1`, sourceSite : `sourceSite1`, sourceUrl : `SourceUrl1`, createdBy : 1})
      const recipe2Promise = Recipe.create({text : `text2`, title : `title2`, sourceSite : `sourceSite2`, sourceUrl : `SourceUrl2`, createdBy : 2})
      const recipe3Promise = Recipe.create({text : `text3`, title : `title3`, sourceSite : `sourceSite3`, sourceUrl : `SourceUrl3`, createdBy : 3})
      const user1Promise = User.create({email : `testUser1@example.com`, password : `pw`})
      const user2Promise = User.create({email : `testUser2@example.com`, password : `pw`})
      const [recipe1, recipe2, recipe3] = await Promise.all([recipe1Promise, recipe2Promise, recipe3Promise, user1Promise, user2Promise])
      const recipe1SetUserPromise = recipe1.setUser(1)
      const recipe2SetUserPromise = recipe2.setUser(2)
      const recipe3SetUserPromise = recipe3.setUser(2)
      await Promise.all([recipe1SetUserPromise, recipe2SetUserPromise, recipe3SetUserPromise])
    }catch(err){
      console.log(err)
    }
  })

  describe(`the / route`, () => {
    describe(`GET`, () => {
      it(`returns all the recipes in the database`, async () => {
        const res = await request(app).get(`/api/recipe`)
        expect(res.body.length).to.equal(3)
      })
    })
  })
})
