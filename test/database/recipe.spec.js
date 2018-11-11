const chai = require(`chai`)
const chaiAsPromised = require(`chai-as-promised`)
const Recipe = require(`../../server/db`).model(`recipe`)

chai.use(chaiAsPromised)
const expect = chai.expect

describe(`The Recipe model`, () => {
  let testRecipe = null
  before(async () => {
    try{
      testRecipe = await Recipe.create({
        text : `recipe`,
        title : `title`,
        createdBy : 1,
      })
    }catch(err){
      console.log(err)
    }
  })
  after(async () => {
    try{
      await Recipe.sync({force : true})
    }catch(err){
      console.log(err)
    }
  })

  it(`exists`, () => expect(Recipe).not.to.be.an(`undefined`))

  describe(`Each desired field exists`, () => {
    it(`text`, () => expect(testRecipe.text).not.to.be.an(`undefined`))
    it(`title`, () => expect(testRecipe.title).not.to.be.an(`undefined`))
    it(`sourceSite`, () => expect(testRecipe.sourceSite).not.to.be.an(`undefined`))
    it(`sourceUrl`, () => expect(testRecipe.sourceUrl).not.to.be.an(`undefined`))
    it(`createdBy`, () => expect(testRecipe.createdBy).not.to.be.an(`undefined`))
    it(`forkedCount`, () => expect(testRecipe.forkedCount).not.to.be.an(`undefined`))
  })

  describe(`Each field validates and accepts only the correct data types`, () => {
    describe(`Text`, () => {
      it(`is required`, () => {
        const none = () => Recipe.create({})
        return expect(none()).to.be.rejectedWith(`notNull Violation: recipe.text cannot be null`)
      })
      it(`accepts only strings`, () => {
        const nonString = () => Recipe.create({text : []})
        return expect(nonString()).to.be.rejectedWith(`string violation: text cannot be an array or an object`)
      })
      it(`does not accept empty strings`, () => {
        const empty = () => Recipe.create({text : ``})
        return expect(empty()).to.be.rejectedWith(`Validation error: Validation notEmpty on text failed`)
      })
    })

    describe(`Title`, () => {
      it(`is required`, () => {
        const none = () => Recipe.create({})
        return expect(none()).to.be.rejectedWith(`notNull Violation: recipe.title cannot be null`)
      })
      it(`accepts only strings`, () => {
        const nonString = () => Recipe.create({title : []})
        return expect(nonString()).to.be.rejectedWith(`string violation: title cannot be an array or an object`)
      })
      it(`does not accept empty strings`, () => {
        const empty = () => Recipe.create({title : ``})
        return expect(empty()).to.be.rejectedWith(`Validation error: Validation notEmpty on title failed`)
      })
    })

    describe(`SourceSite`, () => {
      it(`accepts only strings`, () => {
        const nonString = () => Recipe.create({sourceSite : []})
        return expect(nonString()).to.be.rejectedWith(`string violation: sourceSite cannot be an array or an object`)
      })
      it(`does not accept empty strings`, () => {
        const empty = () => Recipe.create({sourceSite : ``})
        return expect(empty()).to.be.rejectedWith(`Validation error: Validation notEmpty on sourceSite failed`)
      })
      it(`defaults to "User Upload"`, () => {
        expect(testRecipe.sourceSite).to.equal(`User Upload`)
      })
    })

    describe(`SourceUrl Field`, () => {
      it(`accepts only strings`, () => {
        const nonString = () => Recipe.create({sourceUrl : []})
        return expect(nonString()).to.be.rejectedWith(`string violation: sourceUrl cannot be an array or an object`)
      })
      it(`does not accept empty strings`, () => {
        const empty = () => Recipe.create({sourceUrl : ``})
        return expect(empty()).to.be.rejectedWith(`Validation error: Validation notEmpty on sourceUrl failed`)
      })
      it(`defaults to "User Upload"`, () => {
        expect(testRecipe.sourceUrl).to.equal(`User Upload`)
      })
    })

    describe(`CreatedBy`, () => {
      it(`is required`, () => {
        const none = () => Recipe.create({})
        return expect(none()).to.be.rejectedWith(`notNull Violation: recipe.createdBy cannot be null`)
      })
      it(`accepts only integers`, () => {
        const nonInteger = () => Recipe.create({text : `recipe`, title : `title`, createdBy : `str`})
        return expect(nonInteger()).to.be.rejectedWith(`invalid input syntax for integer: "str"`)
      })
    })

    describe(`ForkedCount`, () => {
      it(`accepts only integers`, () => {
        const nonInteger = () => Recipe.create({text : `recipe`, title : `title`, createdBy : 1, forkedCount : `str`})
        return expect(nonInteger()).to.be.rejectedWith(`invalid input syntax for integer: "str"`)
      })
      it(`forkedCount field defaults to 0`, () => {
        expect(testRecipe.forkedCount).to.equal(0)
      })
    })
  })
})
