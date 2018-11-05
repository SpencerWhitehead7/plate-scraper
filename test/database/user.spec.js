/* eslint-disable init-declarations */

const {expect} = require(`chai`)
const db = require(`../../server/db`)
const User = db.model(`user`)

const {SUCCESS, ERROR, createTestInstance} = require(`./logic`)

describe(`User model`, () => {
  beforeEach(async () => {
    try{
      await User.sync({force : true})
    }catch(err){
      console.log(err)
    }
  })

  describe(`The User model`, () => {
    it(`the model exists`, () => expect(User).not.to.be.an(`undefined`))
  })

  describe(`Each desired field exists`, () => {
    let test
    before(async () => {
      test = await createTestInstance(User, SUCCESS,
        [`email`, `testUser@example.com`],
        [`password`, `pw`])
    })
    it(`has an email field`, () => expect(test.email).not.to.be.an(`undefined`))
    it(`has a password field`, () => expect(test.password).not.to.be.an(`undefined`))
    it(`has a salt field`, () => expect(test.salt).not.to.be.an(`undefined`))
  })

  describe(`Each field validates and accepts only the correct data types`, () => {
    let testUser
    before(async () => {
      testUser = await createTestInstance(User, SUCCESS,
        [`email`, `testUser@example.com`],
        [`password`, `pw`])
    })
    describe(`Email Field`, () => {
      it(`email field is required`, async () => {
        const test = await createTestInstance(User, ERROR,
          [`password`, `pw`])
        expect(test.errors[0].message).to.equal(`user.email cannot be null`)
      })
      it(`email field accepts only strings`, async () => {
        const test = await createTestInstance(User, ERROR,
          [`email`, []],
          [`password`, `pw`])
        expect(test.errors[0].message).to.equal(`email cannot be an array or an object`)
      })
      it(`email field rejects duplicate emails`, async () => {
        await createTestInstance(User, SUCCESS,
          [`email`, `testUser@example.com`],
          [`password`, `pw`])
        const test = await createTestInstance(User, ERROR,
          [`email`, `testUser@example.com`],
          [`password`, `pw`])
        expect(test.errors[0].message).to.equal(`email must be unique`)
      })
      it(`email field rejects non-email strings`, async () => {
        const test = await createTestInstance(User, ERROR,
          [`email`, `not an email`],
          [`password`, `pw`])
        expect(test.errors[0].message).to.equal(`Validation isEmail on email failed`)
      })
    })

    describe(`Password Field`, () => {
      it(`password field accepts only strings`, async () => {
        const test = await createTestInstance(User, ERROR,
          [`email`, `testUser@example.com`],
          [`password`, []])
        expect(test.errors[0].message).to.equal(`password cannot be an array or an object`)
      })
      it(`password field's contents are hidden in a function`, () => {
        expect(testUser.password).to.be.a(`function`)
      })
    })

    describe(`Salt Field`, () => {
      it(`salt field is a string`, () => {
        expect(testUser.salt()).to.be.a(`string`)
      })
      it(`salt field's contents are hidden in a function`, () => {
        expect(testUser.salt).to.be.a(`function`)
      })
    })
  })

  describe(`Class methods`, () => {
    let testUser
    let secondUser
    before(async () => {
      testUser = await createTestInstance(User, SUCCESS,
        [`email`, `testUser@example.com`],
        [`password`, `pw`])
      secondUser = await createTestInstance(User, SUCCESS,
        [`email`, `secondUser@example.com`],
        [`password`, `pw`])
    })

    describe(`Password behaviors`, () => {
      it(`password field is encrypted with randomized salting and hashing`, () => {
        expect(testUser.password()).not.to.equal(secondUser.password())
      })
      it(`password field is re-encrypted with random salt on update`, async () => {
        const oldPassword = testUser.password()
        try{
          await testUser.update({password : `pw`})
        }catch(error){
          console.log(error)
        }
        expect(testUser.password()).not.to.equal(oldPassword)
      })
    })

    describe(`Salt behaviors`, () => {
      it(`salt field is randomly generated on account creation`, () => {
        expect(testUser.salt()).not.to.equal(secondUser.salt())
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
      testUser = await createTestInstance(User, SUCCESS,
        [`email`, `testUser@example.com`],
        [`password`, `pw`])
    })

    describe(`correctPassword`, () => {
      it(`returns true if the password is correct`, () => {
        expect(testUser.correctPassword(`pw`)).to.be.equal(true)
      })
      it(`returns false if the password is incorrect`, () => {
        expect(testUser.correctPassword(`wrongpw`)).to.be.equal(false)
      })
    })
  })
})
