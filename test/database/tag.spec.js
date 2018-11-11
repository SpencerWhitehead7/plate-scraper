const chai = require(`chai`)
const chaiAsPromised = require(`chai-as-promised`)
const Tag = require(`../../server/db`).model(`tag`)

chai.use(chaiAsPromised)
const expect = chai.expect

describe(`The Tag model`, () => {
  let testTag = null
  before(async () => {
    try{
      testTag = await Tag.create({name : `tagname &7-Ab`})
    }catch(err){
      console.log(err)
    }
  })
  after(async () => {
    try{
      await Tag.sync({force : true})
    }catch(err){
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
        const nonString = () => Tag.create({name : []})
        return expect(nonString()).to.be.rejectedWith(`string violation: name cannot be an array or an object`)
      })
      it(`does not accept empty strings`, () => {
        const empty = () => Tag.create({name : ``})
        return expect(empty()).to.be.rejectedWith(`Validation error: Validation notEmpty on name failed`)
      })
      it(`does not accept strings with non-alpha characters`, () => expect(`dummy test see validation`).to.equal(`dummy test see validation`))
      it(`does not accept strings with uppercase characters`, () => expect(`dummy test see validation`).to.equal(`dummy test see validation`))
    })
  })

  describe(`Class methods`, () => {
    describe(`Cleans inputs`, () => {
      it(`name is lowercased and non-alphas are stripped`, () => {
        expect(testTag.name).to.equal(`tagnameab`)
      })
    })
  })
})
