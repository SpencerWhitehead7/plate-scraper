const chai = require(`chai`)
const chaiAsPromised = require(`chai-as-promised`)
const db = require(`../../server/db`)
const Tag = db.model(`tag`)

chai.use(chaiAsPromised)
const expect = chai.expect

describe(`The Tag model`, () => {
  beforeEach(async () => {
    try{
      await Tag.sync({force : true})
    }catch(err){
      console.log(err)
    }
  })
  it(`exists`, () => expect(Tag).not.to.be.an(`undefined`))

  describe(`Each desired field exists`, () => {
    let test = null
    before(async () => {
      try{
        test = await Tag.create({name : `tagname`})
      }catch(err){
        console.log(err)
      }
    })
    it(`name`, () => expect(test.name).not.to.be.an(`undefined`))
  })

  describe(`Each field validates and accepts only the correct data types`, () => {
    describe(`Name`, () => {
      it(`is required`, () => expect(Tag.create({})).to.be.rejectedWith(`notNull Violation: tag.name cannot be null`))
      it(`accepts only strings`, () => expect(Tag.create({name : []})).to.be.rejectedWith(`string violation: name cannot be an array or an object`))
      it(`does not accept empty strings`, () => expect(Tag.create({name : ``})).to.be.rejectedWith(`Validation error: Validation notEmpty on name failed`))
      it(`does not accept strings with non-alpha characters`, () => expect(Tag.create({name : `a7a`})).to.be.rejectedWith(`Validation error: Validation isAlpha on name failed`))
      it(`does not accept strings with uppercase characters`, () => expect(Tag.create({name : `aAa`})).to.be.rejectedWith(`Validation error: Validation isLowercase on name failed`))
    })
  })
})
