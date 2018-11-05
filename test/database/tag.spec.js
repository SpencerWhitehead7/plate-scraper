const {expect} = require(`chai`)
const db = require(`../../server/db`)
const Tag = db.model(`tag`)

const {SUCCESS, ERROR, createTestInstance} = require(`./logic`)

describe(`Tag model`, () => {
  beforeEach(async () => {
    try{
      await Tag.sync({force : true})
    }catch(err){
      console.log(err)
    }
  })

  describe(`The Tag model`, () => {
    it(`The model exists`, () => expect(Tag).not.to.be.an(`undefined`))
  })

  describe(`Each desired field exists`, async () => {
    const test = await createTestInstance(Tag, SUCCESS, [`name`, `tagname`])
    it(`has a name field`, () => expect(test.name).not.to.be.an(`undefined`))
  })

  describe(`Each field validates and accepts only the correct data types`, () => {
    describe(`Name Field`, () => {
      it(`name field is required`, async () => {
        const test = await createTestInstance(Tag, ERROR)
        expect(test.errors[0].message).to.equal(`tag.name cannot be null`)
      })
      it(`name field accepts only strings`, async () => {
        const test = await createTestInstance(Tag, ERROR, [`name`, []])
        expect(test.errors[0].message).to.equal(`name cannot be an array or an object`)
      })
      it(`name field does not accept empty strings`, async () => {
        const test = await createTestInstance(Tag, ERROR, [`name`, ``])
        expect(test.errors[0].message).to.equal(`Validation notEmpty on name failed`)
      })
      it(`name field does not accept strings with numeric (non-alphabetical) characters`, async () => {
        const test = await createTestInstance(Tag, ERROR, [`name`, `a7a`])
        expect(test.errors[0].message).to.equal(`Validation isAlpha on name failed`)
      })
      it(`name field does not accept strings with symbol (non-alphabetical) characters`, async () => {
        const test = await createTestInstance(Tag, ERROR, [`name`, `a&a`])
        expect(test.errors[0].message).to.equal(`Validation isAlpha on name failed`)
      })
      it(`name field does not accept strings with uppercase characters`, async () => {
        const test = await createTestInstance(Tag, ERROR, [`name`, `aAa`])
        expect(test.errors[0].message).to.equal(`Validation isLowercase on name failed`)
      })
    })
  })
})
