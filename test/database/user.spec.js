const {expect} = require(`chai`)
const db = require(`../../server/db`)
const User = db.model(`user`)

describe(`User model`, () => {
  describe(`The User model`, () => {
    it(`The model exists`, () => expect(User).not.to.be.an(`undefined`))
  })

  describe(`Each desired field exists`, () => {
    let TU
    before(async () => {
      try{
        await db.sync({force : true})
        TU = await User.create({
          email : `T@E.com`,
          password : `pw`,
        })
      }catch(error){
        console.log(error)
      }
    })
    it(`has an email field`, () => expect(TU.email).not.to.be.an(`undefined`))
    it(`has a password field`, () => expect(TU.password).not.to.be.an(`undefined`))
    it(`has a salt field`, () => expect(TU.salt).not.to.be.an(`undefined`))
  })

  describe(`Each field accepts only the correct data types`, () => {
    let TU
    before(async () => {
      try{
        await db.sync({force : true})
        TU = await User.create({email : `T@E.com`, password : `pw`})
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
        await User.create({email : `T@E.com`, password : `pw`})
      }catch(error){
        testVal = error
      }
      expect(testVal.errors[0].message).to.equal(`email must be unique`)
    })
    it(`email field rejects non-email strings`, async () => {
      let testVal
      try{
        await TU.update({email : `not an email`})
      }catch(error){
        testVal = error
      }
      expect(testVal.errors[0].message).to.equal(`Validation isEmail on email failed`)
    })

    it(`password field accepts only strings`, async () => {
      let testVal
      try{
        await TU.update({password : []})
      }catch(error){
        testVal = error
      }
      expect(testVal.errors[0].message).to.equal(`password cannot be an array or an object`)
    })
    it(`password field's contents are hidden in a function`, () => {
      expect(TU.password).to.be.a(`function`)
    })

    it(`salt field is a string`, () => {
      expect(TU.salt()).to.be.a(`string`)
    })
    it(`salt field's contents are hidden in a function`, () => {
      expect(TU.salt).to.be.a(`function`)
    })
  })

  describe(`Class methods`, () => {
    let TU
    before(async () => {
      await db.sync({force : true})
      TU = await User.create({
        email : `T@E.com`,
        password : `pw`,
      })
    })

    describe(`password`, () => {
      it(`password field is encrypted with randomized salting and hashing`, async () => {
        let first
        let second
        try{
          first = await User.create({
            email : `first@e.com`,
            password : `pw`,
          })
          second = await User.create({
            email : `second@e.com`,
            password : `pw`,
          })
        }catch(error){
          console.log(error)
        }
        expect(first.password()).not.to.equal(second.password())
      })
      it(`password field is re-encrypted on update`, async () => {
        const oldPassword = TU.password()
        try{
          await TU.update({password : `pw`})
        }catch(error){
          console.log(error)
        }
        expect(TU.password()).not.to.equal(oldPassword)
      })
    })

    describe(`salt`, () => {
      it(`salt field is randomly generated on account creation`, async () => {
        let first
        let second
        try{
          first = await User.create({
            email : `third@e.com`,
            password : `pw`,
          })
          second = await User.create({
            email : `fourth@e.com`,
            password : `pw`,
          })
        }catch(error){
          console.log(error)
        }
        expect(first.salt()).not.to.equal(second.salt())
      })
      it(`salt field is randomly regenerated on password update`, async () => {
        const oldSalt = TU.salt()
        try{
          await TU.update({password : `pw`})
        }catch(error){
          console.log(error)
        }
        expect(TU.salt()).not.to.equal(oldSalt)
      })
    })
  })

  describe(`Instance methods`, () => {
    let TU
    before(async () => {
      await db.sync({force : true})
      TU = await User.create({
        email : `T@E.com`,
        password : `pw`,
      })
    })

    describe(`correctPassword`, () => {
      it(`returns true if the password is correct`, () => {
        expect(TU.correctPassword(`pw`)).to.be.equal(true)
      })
      it(`returns false if the password is incorrect`, () => {
        expect(TU.correctPassword(`wrongpw`)).to.be.equal(false)
      })
    })
  })
})
