const {expect} = require(`chai`)
const db = require(`../../server/db`)
const Tag = db.model(`tag`)

describe(`Tag model`, () => {
  describe(`The Tag model`, () => {
    it(`The model exists`, () => expect(Tag).not.to.be.an(`undefined`))
  })

  describe(`Each desired field exists`, () => {
    let testTag
    before(async () => {
      try{
        await db.sync({force : true})
        testTag = await Tag.create({name : `dessert`})
      }catch(error){
        console.log(error)
      }
    })

    it(`has a name field`, () => expect(testTag.name).not.to.be.an(`undefined`))
  })

  describe(`Each field accepts only the correct data types`, () => {
    it(`name field is required`, async () => {
      let testVal
      try{
        await Tag.create({})
      }catch(error){
        testVal = error
      }
      expect(testVal.errors[0].message).to.equal(`tag.name cannot be null`)
    })
    it(`name field accepts only strings`, async () => {
      let testVal
      try{
        await Tag.create({name : []})
      }catch(error){
        testVal = error
      }
      expect(testVal.errors[0].message).to.equal(`name cannot be an array or an object`)
    })
    it(`name field does not accept empty strings`, async () => {
      let testVal
      try{
        await Tag.create({name : ``})
      }catch(error){
        testVal = error
      }
      expect(testVal.errors[0].message).to.equal(`Validation notEmpty on name failed`)
    })
    it(`name field does not accept strings with numeric (non-alphabetical) characters`, async () => {
      let testVal
      try{
        await Tag.create({name : `7`})
      }catch(error){
        testVal = error
      }
      expect(testVal.errors[0].message).to.equal(`Validation isAlpha on name failed`)
    })
    it(`name field does not accept strings with symbol (non-alphabetical) characters`, async () => {
      let testVal
      try{
        await Tag.create({name : `&`})
      }catch(error){
        testVal = error
      }
      expect(testVal.errors[0].message).to.equal(`Validation isAlpha on name failed`)
    })
    it(`name field does not accept strings with uppercase characters`, async () => {
      let testVal
      try{
        await Tag.create({name : `aAa`})
      }catch(error){
        testVal = error
      }
      expect(testVal.errors[0].message).to.equal(`Validation isLowercase on name failed`)
    })
  })
})
