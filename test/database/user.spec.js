const {expect} = require(`chai`)
const db = require(`../../server/db`)
const User = db.model(`user`)

describe(`User model`, () => {
  describe(`The User model`, () => {
    it(`The model exists`, () => expect(User).not.to.be.an(`undefined`))
  })

  describe(`Each desired field exists`, () => {
    let testUser
    before(async () => {
      try{
        await db.sync({force : true})
        testUser = await User.create({
          email : `testUser@example.com`,
          password : `pw`,
        })
      }catch(error){
        console.log(error)
      }
    })

    it(`has an email field`, () => expect(testUser.email).not.to.be.an(`undefined`))
    it(`has a password field`, () => expect(testUser.password).not.to.be.an(`undefined`))
    it(`has a salt field`, () => expect(testUser.salt).not.to.be.an(`undefined`))
  })

  describe(`Each field accepts only the correct data types`, () => {
    let testUser
    before(async () => {
      try{
        await db.sync({force : true})
        testUser = await User.create({email : `testUser@example.com`, password : `pw`})
      }catch(error){
        console.log(error)
      }
    })

    it(`email field is required`, async () => {
      let testVal
      try{
        await User.create({password : `pw`})
      }catch(error){
        testVal = error
      }
      expect(testVal.errors[0].message).to.equal(`user.email cannot be null`)
    })
    it(`email field accepts only strings`, async () => {
      let testVal
      try{
        await User.create({email : [], password : `pw`})
      }catch(error){
        testVal = error
      }
      expect(testVal.errors[0].message).to.equal(`email cannot be an array or an object`)
    })
    it(`email field rejects duplicate emails`, async () => {
      let testVal
      try{
        await User.create({email : `testUser@example.com`, password : `pw`})
      }catch(error){
        testVal = error
      }
      expect(testVal.errors[0].message).to.equal(`email must be unique`)
    })
    it(`email field rejects non-email strings`, async () => {
      let testVal
      try{
        await testUser.update({email : `not an email`})
      }catch(error){
        testVal = error
      }
      expect(testVal.errors[0].message).to.equal(`Validation isEmail on email failed`)
    })

    it(`password field accepts only strings`, async () => {
      let testVal
      try{
        await testUser.update({password : []})
      }catch(error){
        testVal = error
      }
      expect(testVal.errors[0].message).to.equal(`password cannot be an array or an object`)
    })
    it(`password field's contents are hidden in a function`, () => {
      expect(testUser.password).to.be.a(`function`)
    })

    it(`salt field is a string`, () => {
      expect(testUser.salt()).to.be.a(`string`)
    })
    it(`salt field's contents are hidden in a function`, () => {
      expect(testUser.salt).to.be.a(`function`)
    })
  })

  describe(`Class methods`, () => {
    let testUser
    before(async () => {
      await db.sync({force : true})
      testUser = await User.create({
        email : `testUser@example.com`,
        password : `pw`,
      })
    })

    describe(`password`, () => {
      it(`password field is encrypted with randomized salting and hashing`, async () => {
        let firstUser
        let secondUser
        try{
          firstUser = await User.create({
            email : `firstAddress@example.com`,
            password : `pw`,
          })
          secondUser = await User.create({
            email : `secondAddress@example.com`,
            password : `pw`,
          })
        }catch(error){
          console.log(error)
        }
        expect(firstUser.password()).not.to.equal(secondUser.password())
      })
      it(`password field is re-encrypted on update`, async () => {
        const oldPassword = testUser.password()
        try{
          await testUser.update({password : `pw`})
        }catch(error){
          console.log(error)
        }
        expect(testUser.password()).not.to.equal(oldPassword)
      })
    })

    describe(`salt`, () => {
      it(`salt field is randomly generated on account creation`, async () => {
        let firstUser
        let secondUser
        try{
          firstUser = await User.create({
            email : `third@example.com`,
            password : `pw`,
          })
          secondUser = await User.create({
            email : `fourth@example.com`,
            password : `pw`,
          })
        }catch(error){
          console.log(error)
        }
        expect(firstUser.salt()).not.to.equal(secondUser.salt())
      })
      it(`salt field is randomly regenerated on password update`, async () => {
        const oldSalt = testUser.salt()
        try{
          await testUser.update({password : `pw`})
        }catch(error){
          console.log(error)
        }
        expect(testUser.salt()).not.to.equal(oldSalt)
      })
    })
  })

  describe(`Instance methods`, () => {
    let testUser
    before(async () => {
      await db.sync({force : true})
      testUser = await User.create({
        email : `testUser@example.com`,
        password : `pw`,
      })
    })

    describe(`correctPassword`, () => {
      it(`retestUserrns true if the password is correct`, () => {
        expect(testUser.correctPassword(`pw`)).to.be.equal(true)
      })
      it(`retestUserrns false if the password is incorrect`, () => {
        expect(testUser.correctPassword(`wrongpw`)).to.be.equal(false)
      })
    })
  })
})
