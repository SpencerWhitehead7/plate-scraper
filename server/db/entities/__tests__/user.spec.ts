import {
  dataSource,
  expect,
  factoryRecipe,
  factoryUser,
  syncDB,
  user2Cred,
  userCred,
} from "../../../mochaSetup"
import { Recipe } from "../recipe"
import { User } from "../user"

describe("User Entity", () => {
  beforeEach(syncDB)
  afterEach(syncDB)

  it("entity and fields exist", async () => {
    const user = await dataSource.manager.save(factoryUser())
    expect(User).to.exist
    expect(user.email).to.exist
    expect(user.password).to.exist
    expect(user.userName).to.exist
  })

  describe("Fields validate data", () => {
    it("email rejects duplicates", async () => {
      await dataSource.manager.save(factoryUser())
      return expect(dataSource.manager.save(factoryUser())).to.be.rejected
    })
    it("email rejects non-email strings", () => {
      const user = factoryUser({ email: "email" })
      return expect(dataSource.manager.save(user)).to.be.rejected
    })
    it("userName rejects duplicates", async () => {
      await dataSource.manager.save(factoryUser())
      return expect(dataSource.manager.save(factoryUser())).to.be.rejected
    })
    it("userName rejects empty strings", () => {
      const user = factoryUser({ userName: "" })
      return expect(dataSource.manager.save(user)).to.be.rejected
    })
    it("userName rejects strings with non-alphanumeric characters", () => {
      const user = factoryUser({ userName: "userName!" })
      return expect(dataSource.manager.save(user)).to.be.rejected
    })
    it("rejects passwords >64 chars", async () => {
      const user = factoryUser({ password: new Array(65).fill("a").join("") })
      return expect(dataSource.manager.save(user)).to.be.rejected
    })
    it("password is hidden from selects", async () => {
      await dataSource.manager.save(factoryUser())
      const user = await dataSource.manager.findOneByOrFail(User, { id: 1 })
      expect(user.password).not.to.exist
    })
  })

  describe("Auth behaviors", () => {
    it("password is encrypted with randomized salting and hashing", async () => {
      const samePassword = "password"

      const [user1, user2] = await Promise.all(
        [
          factoryUser({ ...userCred, password: samePassword }),
          factoryUser({ ...user2Cred, password: samePassword }),
        ].map((row) => dataSource.manager.save(row)),
      )

      expect(user1.password).not.to.equal(samePassword)
      expect(user2.password).not.to.equal(samePassword)
      expect(user1.password).not.to.equal(user2.password)
    })
    it("password is re-encrypted when it updates", async () => {
      const user = await dataSource.manager.save(factoryUser())
      const { password: originalPassword } = user
      // "updates" the values in the db row to their current values
      // which triggers re-encryption, changing value of password
      const { password: newPassword } = await dataSource.manager.save(user)

      expect(originalPassword).not.to.equal(newPassword)
    })
  })

  describe("Deletion behaviors", () => {
    it("deleting a user also deletes the user's recipes", async () => {
      const getAllRecipes = async () => await dataSource.manager.find(Recipe)

      const [user, otherUser] = await Promise.all(
        [factoryUser(userCred), factoryUser(user2Cred)].map((row) =>
          dataSource.manager.save(row),
        ),
      )

      const [userRecipe] = await Promise.all(
        [factoryRecipe({ user }), factoryRecipe({ user: otherUser })].map(
          (row) => dataSource.manager.save(row),
        ),
      )

      const originalRecipes = await getAllRecipes()
      await dataSource.manager.delete(User, user.id)
      const recipesAfterDelete = await getAllRecipes()

      expect(originalRecipes).to.have.lengthOf(2)
      expect(originalRecipes.some(({ id }) => id === userRecipe.id)).to.be.true
      expect(recipesAfterDelete).to.have.lengthOf(1)
      expect(recipesAfterDelete.some(({ id }) => id === userRecipe.id)).to.be
        .false
    })
  })

  describe("Instance methods", () => {
    it("checkPassword returns whether the password is correct", async () => {
      const userData = factoryUser()
      const { password } = userData
      const user = await dataSource.manager.save(userData)
      expect(await user.checkPassword(password)).to.be.true
      expect(await user.checkPassword(password + "a")).to.be.false
    })
  })
})
