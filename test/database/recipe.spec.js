/* eslint-disable init-declarations */

const {expect} = require(`chai`)
const db = require(`../../server/db`)
const Recipe = db.model(`recipe`)

const {SUCCESS, ERROR, createTestInstance} = require(`./logic`)

describe(`Recipe model`, () => {
  beforeEach(async () => {
    try{
      await Recipe.sync({force : true})
    }catch(err){
      console.log(err)
    }
  })

  describe(`The Recipe model`, () => {
    it(`the model exists`, () => expect(Recipe).not.to.be.an(`undefined`))
  })

  describe(`Each desired field exists`, () => {
    let test
    before(async () => {
      test = await createTestInstance(Recipe, SUCCESS,
        [`text`, `recipe`],
        [`title`, `title`],
        [`createdBy`, 1])
    })
    it(`has a text field`, () => expect(test.text).not.to.be.an(`undefined`))
    it(`has a title field`, () => expect(test.title).not.to.be.an(`undefined`))
    it(`has a sourceSite field`, () => expect(test.sourceSite).not.to.be.an(`undefined`))
    it(`has a sourceUrl field`, () => expect(test.sourceUrl).not.to.be.an(`undefined`))
    it(`has a createdBy field`, () => expect(test.createdBy).not.to.be.an(`undefined`))
    it(`has a forkedCount field`, () => expect(test.forkedCount).not.to.be.an(`undefined`))
  })

  describe(`Each field validates and accepts only the correct data types`, () => {
    describe(`Text Field`, () => {
      it(`text field is required`, async () => {
        const test = await createTestInstance(Recipe, ERROR,
          [`title`, `title`],
          [`createdBy`, 1])
        expect(test.errors[0].message).to.equal(`recipe.text cannot be null`)
      })
      it(`text field accepts only strings`, async () => {
        const test = await createTestInstance(Recipe, ERROR,
          [`text`, []],
          [`title`, `title`],
          [`createdBy`, 1])
        expect(test.errors[0].message).to.equal(`text cannot be an array or an object`)
      })
      it(`text field does not accept empty strings`, async () => {
        const test = await createTestInstance(Recipe, ERROR,
          [`text`, ``],
          [`title`, `title`],
          [`createdBy`, 1])
        expect(test.errors[0].message).to.equal(`Validation notEmpty on text failed`)
      })
    })

    describe(`Title Field`, () => {
      it(`title field is required`, async () => {
        const test = await createTestInstance(Recipe, ERROR,
          [`text`, `recipe`],
          [`createdBy`, 1])
        expect(test.errors[0].message).to.equal(`recipe.title cannot be null`)
      })
      it(`title field accepts only strings`, async () => {
        const test = await createTestInstance(Recipe, ERROR,
          [`text`, `recipe`],
          [`title`, []],
          [`createdBy`, 1])
        expect(test.errors[0].message).to.equal(`title cannot be an array or an object`)
      })
      it(`title field does not accept empty strings`, async () => {
        const test = await createTestInstance(Recipe, ERROR,
          [`text`, `recipe`],
          [`title`, ``],
          [`createdBy`, 1])
        expect(test.errors[0].message).to.equal(`Validation notEmpty on title failed`)
      })
    })

    describe(`SourceSite Field`, () => {
      it(`sourceSite field accepts only strings`, async () => {
        const test = await createTestInstance(Recipe, ERROR,
          [`text`, `recipe`],
          [`title`, `title`],
          [`sourceSite`, []],
          [`createdBy`, 1])
        expect(test.errors[0].message).to.equal(`sourceSite cannot be an array or an object`)
      })
      it(`sourceSite field does not accept empty strings`, async () => {
        const test = await createTestInstance(Recipe, ERROR,
          [`text`, `recipe`],
          [`title`, `title`],
          [`sourceSite`, ``],
          [`createdBy`, 1])
        expect(test.errors[0].message).to.equal(`Validation notEmpty on sourceSite failed`)
      })
      it(`sourceSite field defaults to "User Upload"`, async () => {
        const test = await createTestInstance(Recipe, SUCCESS,
          [`text`, `recipe`],
          [`title`, `title`],
          [`createdBy`, 1])
        expect(test.sourceSite).to.equal(`User Upload`)
      })
    })

    describe(`SourceUrl Field`, () => {
      it(`sourceUrl field accepts only strings`, async () => {
        const test = await createTestInstance(Recipe, ERROR,
          [`text`, `recipe`],
          [`title`, `title`],
          [`sourceUrl`, []],
          [`createdBy`, 1])
        expect(test.errors[0].message).to.equal(`sourceUrl cannot be an array or an object`)
      })
      it(`sourceUrl field does not accept empty strings`, async () => {
        const test = await createTestInstance(Recipe, ERROR,
          [`text`, `recipe`],
          [`title`, `title`],
          [`sourceUrl`, ``],
          [`createdBy`, 1])
        expect(test.errors[0].message).to.equal(`Validation notEmpty on sourceUrl failed`)
      })
      it(`sourceUrl field defaults to "User Upload"`, async () => {
        const test = await createTestInstance(Recipe, SUCCESS,
          [`text`, `recipe`],
          [`title`, `title`],
          [`createdBy`, 1])
        expect(test.sourceUrl).to.equal(`User Upload`)
      })
    })

    describe(`CreatedBy Field`, () => {
      it(`createdBy field is required`, async () => {
        const test = await createTestInstance(Recipe, ERROR,
          [`text`, `recipe`],
          [`title`, `title`])
        expect(test.errors[0].message).to.equal(`recipe.createdBy cannot be null`)
      })
      it(`createdBy field accepts only integers`, async () => {
        const test = await createTestInstance(Recipe, ERROR,
          [`text`, `recipe`],
          [`title`, `title`],
          [`createdBy`, `str`])
        expect(test.original.message).to.equal(`invalid input syntax for integer: "str"`)
      })
      it(`createdBy field does not accept empty strings`, async () => {
        const test = await createTestInstance(Recipe, ERROR,
          [`text`, `recipe`],
          [`title`, `title`],
          [`createdBy`, ``])
        expect(test.errors[0].message).to.equal(`Validation notEmpty on createdBy failed`)
      })
    })

    describe(`ForkedCount Field`, () => {
      it(`forkedCount field accepts only integers`, async () => {
        const test = await createTestInstance(Recipe, ERROR,
          [`text`, `recipe`],
          [`title`, `title`],
          [`createdBy`, 1],
          [`forkedCount`, `str`])
        expect(test.original.message).to.equal(`invalid input syntax for integer: "str"`)
      })
      it(`forkedCount field defaults to 0`, async () => {
        const test = await createTestInstance(Recipe, SUCCESS,
          [`text`, `recipe`],
          [`title`, `title`],
          [`createdBy`, 1])
        expect(test.forkedCount).to.equal(0)
      })
    })
  })
})
