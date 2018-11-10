/* eslint-disable init-declarations */

const {expect} = require(`chai`)
const request = require(`supertest`)

const app = require(`../../server`)
const db = require(`../../server/db`)
const User = db.model(`user`)

const agent = request.agent(app)
const userCred = {email : `testUser@example.com`, password : `pw`}

describe(`Auth Route: /auth`, () => {
  before(async () => {
    try{
      await User.sync({force : true})
    }catch(err){
      console.log(err)
    }
  })

  describe(`the /me route`, () => {
    before(async () => {
      try{
        await User.create(userCred)
      }catch(err){
        console.log(err)
      }
    })
    after(async () => {
      try{
        await agent.post(`/auth/logout`)
        await User.sync({force : true})
      }catch(err){
        console.log(err)
      }
    })

    describe(`GET`, () => {
      it(`if the user is not logged in, it returns a 401 error`, async () => {
        let res
        try{
          res = await agent.get(`/auth/me`)
        }catch(err){
          console.log(err)
        }
        expect(res.status).to.equal(401)
        expect(res.text).to.equal(`Not logged in`)
      })
      it(`if the user is logged in, it returns the user's information`, async () => {
        let res
        try{
          await agent.post(`/auth/login`).send(userCred)
          res = await agent.get(`/auth/me`)
        }catch(err){
          console.log(err)
        }
        expect(res.status).to.equal(200)
        expect(res.body.id).to.equal(1)
        expect(res.body.email).to.equal(`testUser@example.com`)
      })
    })
  })

  // describe(`the /signup route`, () => {
  //   describe(`POST`, () => {
  //     let testUser
  //     before(async () => {
  //       try{
  //         await agent
  //           .post(`/auth/signup`)
  //           .send(userCred)
  //         testUser = await User.findOne({where : {email : `testUser@example.com`}})
  //       }catch(err){
  //         console.log(err)
  //       }
  //     })
  //     it(`creates a user in the database with the correct credentials`, () => {
  //       expect(testUser.email).to.equal(`testUser@example.com`)
  //     })
  //     it(`also logs that user into the app`, async () => {
  //       try{
  //         testUser = await agent.get(`/auth/me`)
  //       }catch(err){
  //         console.log(err)
  //       }
  //       expect(testUser).not.to.be.an(`undefined`)
  //     })
  //   })
  // })
})
