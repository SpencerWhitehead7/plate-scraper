const chai = require(`chai`)
const chaiAsPromised = require(`chai-as-promised`)
const Recipe = require(`../../server/db`).model(`recipe`)
const User = require(`../../server/db`).model(`user`)

chai.use(chaiAsPromised)
const expect = chai.expect

describe(`The User model`, () => {
  let testUser = null
  let secondUser = null
  before(async () => {
    try {
      await Recipe.sync({ force: true })
      await User.sync({ force: true })
      await User.create({
        email: `creatorDeleted@theirAccount.com`,
        password: `pw`,
        userName: `DeletedAccount`,
      })
      testUser = await User.create({
        email: `testUser@example.com`,
        password: `pw`,
        userName: `testUser`,
      })
      secondUser = await User.create({
        email: `secondUser@example.com`,
        password: `pw`,
        userName: `secondUser`,

      })
      const testRecipe1 = await Recipe.create({
        text: `text1`,
        title: `title1`,
        createdBy: 2,
      })
      const testRecipe2 = await Recipe.create({
        text: `text2`,
        title: `title2`,
        createdBy: 2,
      })
      await testUser.addRecipe(testRecipe1)
      await secondUser.addRecipe(testRecipe2)
    } catch (err) {
      console.log(err)
    }
  })
  after(async () => {
    try {
      await Recipe.sync({ force: true })
      await User.sync({ force: true })
    } catch (err) {
      console.log(err)
    }
  })

  it(`exists`, () => expect(User).not.to.be.an(`undefined`))

  describe(`Each desired field exists`, () => {
    it(`email`, () => expect(testUser.email).not.to.be.an(`undefined`))
    it(`password`, () => expect(testUser.password).not.to.be.an(`undefined`))
    it(`salt`, () => expect(testUser.salt).not.to.be.an(`undefined`))
    it(`userName`, () => expect(testUser.userName).not.to.be.an(`undefined`))
  })

  describe(`Each field validates and accepts only the correct data types`, () => {
    describe(`Email`, () => {
      it(`is required`, () => {
        const none = () => User.create({})
        return expect(none()).to.be.rejectedWith(`notNull Violation: user.email cannot be null`)
      })
      it(`accepts only strings`, () => {
        const nonString = () => User.create({ email: [] })
        return expect(nonString()).to.be.rejectedWith(`string violation: email cannot be an array or an object`)
      })
      it(`rejects duplicate emails`, () => {
        const duplicate = () => User.create({ email: `testUser@example.com`, password: `pw`, userName: `duplicate` })
        return expect(duplicate()).to.be.rejectedWith(`Validation error`)
      })
      it(`rejects non-email strings`, () => {
        const nonEmail = () => User.create({ email: `not email address` })
        return expect(nonEmail()).to.be.rejectedWith(`Validation isEmail on email failed`)
      })
    })

    describe(`Password`, () => {
      it(`is required`, () => {
        const empty = () => User.create({})
        return expect(empty()).to.be.rejectedWith(`notNull Violation: user.password cannot be null`)
      })
      it(`accepts only strings`, () => {
        const nonString = () => User.create({ password: [] })
        return expect(nonString()).to.be.rejectedWith(`string violation: password cannot be an array or an object`)
      })
      it(`'s contents are hidden in a function`, () => {
        expect(testUser.password).to.be.a(`function`)
      })
    })

    describe(`userName`, () => {
      it(`is required`, () => {
        const none = () => User.create({})
        return expect(none()).to.be.rejectedWith(`notNull Violation: user.userName cannot be null`)
      })
      it(`accepts only strings`, () => {
        const nonString = () => User.create({ userName: [] })
        return expect(nonString()).to.be.rejectedWith(`string violation: userName cannot be an array or an object`)
      })
      it(`rejects duplicate usernames`, () => {
        const duplicate = () => User.create({ email: `thirdUser@example.com`, password: `pw`, userName: `testUser` })
        return expect(duplicate()).to.be.rejectedWith(`Validation error`)
      })
      it(`rejects non-alphanumeric strings`, () => {
        const nonAlphaNum = () => User.create({ email: `thirdUser@example.com`, password: `pw`, userName: `test_User` })
        return expect(nonAlphaNum()).to.be.rejectedWith(`Validation isAlphanumeric on userName failed`)
      })
      it(`rejects strings shorter than 5 characters`, () => {
        const tooShort = () => User.create({ email: `thirdUser@example.com`, password: `pw`, userName: `test` })
        return expect(tooShort()).to.be.rejectedWith(`Validation len on userName failed`)
      })
      it(`rejects strings longer than 20 characters`, () => {
        const tooLong = () => User.create({ email: `thirdUser@example.com`, password: `pw`, userName: `testtesttesttesttest1` })
        return expect(tooLong()).to.be.rejectedWith(`Validation len on userName failed`)
      })
    })

    describe(`Salt`, () => {
      it(`is a string`, () => {
        expect(testUser.salt()).to.be.a(`string`)
      })
      it(`'s contents are hidden in a function`, () => {
        expect(testUser.salt).to.be.a(`function`)
      })
    })
  })

  describe(`Class methods`, () => {
    describe(`Password behaviors`, () => {
      it(`password is encrypted with randomized salting and hashing`, () => {
        expect(testUser.password()).not.to.equal(secondUser.password())
      })
      it(`password is re-encrypted with random salt on update`, async () => {
        const oldPassword = testUser.password()
        await testUser.update({ password: `pw` })
        expect(testUser.password()).not.to.equal(oldPassword)
      })
    })

    describe(`Salt behaviors`, () => {
      it(`salt is randomly generated on account creation`, () => {
        expect(testUser.salt()).not.to.equal(secondUser.salt())
      })
      it(`salt is randomly regenerated on password update`, async () => {
        const oldSalt = testUser.salt()
        await testUser.update({ password: `pw` })
        expect(testUser.salt()).not.to.equal(oldSalt)
      })
    })

    describe(`Deletion behaviors`, () => {
      let remaining = null
      let dummy = null
      before(async () => {
        try {
          const user = await User.findByPk(2)
          await user.destroy()
          remaining = await Recipe.findAll()
          dummy = await User.findByPk(1)
        } catch (error) {
          console.log(error)
        }
      })
      it(`deletes the user's recipes`, () => {
        expect(remaining.length).to.equal(1)
        expect(remaining[0].id).to.equal(2)
        expect(remaining[0].id).to.equal(2)
      })
      it(`transfers forked recipes' createdBy attributes to the dummy account`, () => {
        expect(remaining[0].createdBy).to.equal(1)
        expect(dummy.email).to.equal(`creatorDeleted@theirAccount.com`)
      })
    })
  })

  describe(`Instance methods`, () => {
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
