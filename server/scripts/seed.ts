import { DataSource } from "typeorm"

import { getGlobalDataSource } from "../src/db/dataStore"
import { Recipe, Tag, User } from "../src/db/entities"

const seed = async (dataSource: DataSource) => {
  const recipeRepo = dataSource.getRepository(Recipe)
  const tagRepo = dataSource.getRepository(Tag)
  const userRepo = dataSource.getRepository(User)

  const save = (row: unknown) => dataSource.manager.save(row)

  await dataSource.synchronize(true)
  console.log("Database synced")

  const users = await Promise.all(
    [
      userRepo.create({
        email: "testuser@example.com",
        password: "pw",
        userName: "TheFirstTestUser",
      }),
      userRepo.create({
        email: "testuser2@example.com",
        password: "pw2",
        userName: "TheSecondTestUser",
      }),
    ].map(save),
  )
  const [user1, user2] = users as User[]
  console.log(`Seeded ${users.length} users`)

  const recipes = await Promise.all(
    [
      recipeRepo.create({
        text: `Source: https://www.allrecipes.com/recipe/22918/pop-cake/

      Pop Cake

      Ingredients

      1 (18.25 ounce) package white cake mix
      1 (16 ounce) can lemon-lime flavored carbonated beverage
      1 cup hot water
      1 (6 ounce) package raspberry flavored Jell-O® mix
      1 (3 ounce) package instant vanilla pudding mix
      2 cups milk
      1 (8 ounce) container frozen whipped topping, thawed

      Instructions

      Prepare and bake cake mix according to package directions for a 9x13 inch pan. Poke holes in cake while still hot with a fork.

      Make gelatin with boiling water, then stir in lemon-lime soda. Pour hot mixture over cake. Cool cake completely, then refrigerate for at least 4 hours before frosting.

      Beat together instant pudding and milk until thick, then pour over cake.  Frost cake with whipped topping.  Keep cake refrigerated until ready to serve.
      `,
        title: "Pop Cake",
        sourceSite: "allrecipes.com",
        sourceUrl: "https://www.allrecipes.com/recipe/22918/pop-cake/",
        createdBy: 1,
        forkedCount: 1,
        user: user1,
      }),
      recipeRepo.create({
        text: `The Creator's Cream
      Just a bunch of cream! Drink it! Recipes can look like anything!
      `,
        title: "Cream of the Creator",
        sourceSite: "User Upload",
        sourceUrl: "User Upload",
        createdBy: 1,
        forkedCount: 0,
        user: user1,
      }),
      recipeRepo.create({
        text: `Source: https://www.budgetbytes.com/skillet-cheeseburger-pasta/

      One Pot Cheeseburger Pasta

      Ingredients

      1 yellow onion ($0.25)
      1 Tbsp olive oil ($0.16)
      1/2 lb. ground beef ($2.50)
      2 Tbsp all-purpose flour ($0.02)
      1 8oz. can tomato sauce ($0.29)
      2 cups beef broth ($0.26)
      1/2 lb. pasta shells, uncooked ($0.50)
      4 oz. cheddar cheese, shredded ($0.75)
      2 Tbsp hot dog relish ($0.16)
      2 green onions, sliced (optional) ($0.20)

      Instructions

      Finely dice the onion. Add the onion, olive oil, and ground beef to a large deep skillet and sauté over medium heat until the beef is fully browned and the onion is soft and translucent. Drain off any excess fat, if needed.

      Add the flour to the skillet and continue to stir and cook for one minute more. The flour will begin to coat the bottom of the skillet. Be careful not to let the flour burn.

      Add the tomato sauce and beef broth to the skillet and stir to dissolve the flour off the bottom of the skillet.

      Add the uncooked pasta to the skillet and stir to combine. The liquid in the skillet may not fully cover the pasta, but that is okay.

      Place a lid on the skillet, turn the heat up to medium-high, and let the liquid come up to a boil. Once it reaches a boil, give it a quick stir to loosen any pasta from the bottom of the skillet, replace the lid, and turn the heat down to low. Let the pasta simmer, stirring occasionally (always replacing the lid), for about 10 minutes, or until the pasta is tender and the sauce has thickened. Turn the heat off.

      Add the shredded cheddar to the skillet and stir until it has melted into the sauce. Stir the hot dog relish into the sauce and then top with sliced green onions. Serve hot.
      `,
        title: "One Pot Cheeseburger Pasta",
        sourceSite: "budgetbytes.com",
        sourceUrl: "https://www.budgetbytes.com/skillet-cheeseburger-pasta/",
        createdBy: 2,
        forkedCount: 0,
        user: user2,
      }),
      recipeRepo.create({
        text: `Source: https://www.food.com/recipe/sonic-strawberry-cheesecake-shake-122785

      Sonic Strawberry Cheesecake Shake

      Ingredients

      1    cup    milk
      3    cups    vanilla ice cream
      1⁄2   cup    strawberry, and syrup, from Jello-O No Bake Strawberry Cheesecake kit
      3    tablespoons    cheesecake mix, powder from cheesecake kit
      topping
      canned whipped cream
      2    teaspoons    graham cracker crumbs, from cheesecake kit

      Instructions

      Combine milk, ice cream, strawberries and cheesecake mix in a blender and mix on high speed until smooth.

      Pour into two 12-ounce glasses.

      Garnish the top with a squirt of whipped cream from a can and about a teaspoon of graham cracker crumbs from the cheesecake kit.

      Serve.
      `,
        title: "Sonic Strawberry Cheesecake Shake",
        sourceSite: "foood.com",
        sourceUrl:
          "https://www.food.com/recipe/sonic-strawberry-cheesecake-shake-122785",
        createdBy: 2,
        forkedCount: 0,
        user: user2,
      }),
      recipeRepo.create({
        text: `Source: https://www.allrecipes.com/recipe/22918/pop-cake/

      Pop Cake

      Ingredients

      1 (18.25 ounce) package white cake mix
      1 (16 ounce) can lemon-lime flavored carbonated beverage
      1 cup hot water
      1 (6 ounce) package raspberry flavored Jell-O® mix
      1 (3 ounce) package instant vanilla pudding mix
      2 cups milk
      1 (8 ounce) container frozen whipped topping, thawed

      Instructions

      Prepare and bake cake mix according to package directions for a 9x13 inch pan. Poke holes in cake while still hot with a fork.

      Make gelatin with boiling water, then stir in lemon-lime soda. Pour hot mixture over cake. Cool cake completely, then refrigerate for at least 4 hours before frosting.

      Beat together instant pudding and milk until thick, then pour over cake.  Frost cake with whipped topping.  Keep cake refrigerated until ready to serve.
      `,
        title: "Pop Cake",
        sourceSite: "allrecipes.com",
        sourceUrl: "https://www.allrecipes.com/recipe/22918/pop-cake/",
        createdBy: 1,
        forkedCount: 0,
        user: user2,
      }),
    ].map(save),
  )
  const [popcake, cream, chickenStrog, cakeShake, forkedPopcake] =
    recipes as Recipe[]
  console.log(`Seeded ${recipes.length} recipes`)

  const tags = await Promise.all(
    [
      tagRepo.create({
        name: "dessert",
        recipes: [popcake, cream, cakeShake, forkedPopcake],
      }),
      tagRepo.create({ name: "beverage", recipes: [cream, cakeShake] }),
      tagRepo.create({ name: "entre", recipes: [chickenStrog] }),
      tagRepo.create({ name: "meat", recipes: [chickenStrog] }),
    ].map(save),
  )
  console.log(`Seeded ${tags.length} tags`)
}

if (module === require.main) {
  console.log("\nSeeding...\n")
  getGlobalDataSource()
    .then(seed)
    .then(() => {
      console.log("\nSeeding complete")
      process.exit(0)
    })
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}

export default seed
