const chai = require(`chai`)
const chaiAsPromised = require(`chai-as-promised`)
const Tag = require(`../../server/db`).model(`tag`)

chai.use(chaiAsPromised)
const expect = chai.expect

describe(`The Tag model`, () => {
  let testTag = null
  before(async () => {
    try {
      await Tag.sync({ force: true })
      testTag = await Tag.create({ name: `tagname` })
    } catch (err) {
      console.log(err)
    }
  })
  after(async () => {
    try {
      await Tag.sync({ force: true })
    } catch (err) {
      console.log(err)
    }
  })

  it(`exists`, () => expect(Tag).not.to.be.an(`undefined`))

  describe(`Each desired field exists`, () => {
    it(`name`, () => expect(testTag.name).not.to.be.an(`undefined`))
  })

  describe(`Each field validates and accepts only the correct data types`, () => {
    describe(`Name`, () => {
      it(`is required`, () => {
        const none = () => Tag.create({})
        return expect(none()).to.be.rejectedWith(`notNull Violation: tag.name cannot be null`)
      })
      it(`accepts only strings`, () => {
        const nonString = () => Tag.create({ name: [] })
        return expect(nonString()).to.be.rejectedWith(`string violation: name cannot be an array or an object`)
      })
      it(`does not accept empty strings`, () => {
        const empty = () => Tag.create({ name: `` })
        return expect(empty()).to.be.rejectedWith(`Validation error: Validation notEmpty on name failed`)
      })
      it(`does not accept duplicates`, () => {
        const duplicate = () => Tag.create({ name: `tagname` })
        return expect(duplicate()).to.be.rejectedWith(`Validation error`)
      })
      it(`does not accept strings with non-alpha characters`, () => {
        const nonAlpha = () => Tag.create({ name: `a7a` })
        return expect(nonAlpha()).to.be.rejectedWith(`Validation error: Validation isAlpha on name failed`)
      })
      it(`does not accept strings with uppercase characters`, () => {
        const upperCase = () => Tag.create({ name: `aAa` })
        return expect(upperCase()).to.be.rejectedWith(`Validation error: Validation isLowercase on name failed`)
      })
    })
  })
})
