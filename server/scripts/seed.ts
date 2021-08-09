import { Connection, Repository, getConnection, getRepository } from "typeorm";

import generateUtils from "../utils";
import { Recipe, Tag, User } from "../db/entities";

const seed = async () => {
  let connection: Connection;
  let recipeRepo: Repository<Recipe>;
  let tagRepo: Repository<Tag>;
  let userRepo: Repository<User>;
  if (process.env.NODE_ENV === "script") {
    // create your own connection if running independently
    ({ connection, recipeRepo, tagRepo, userRepo } = await generateUtils());
  } else {
    // use connection from main app/test otherwise
    connection = getConnection();
    recipeRepo = getRepository(Recipe);
    tagRepo = getRepository(Tag);
    userRepo = getRepository(User);
  }
  const save = (row: any) => connection.manager.save(row);

  await connection.synchronize(true);
  console.log("Database synced");

  const users = await Promise.all(
    [
      userRepo.create({
        email: "testUser@example.com",
        password: "pw",
        userName: "TheFirstTestUser",
      }),
      userRepo.create({
        email: "testUser2@example.com",
        password: "pw2",
        userName: "TheSecondTestUser",
      }),
    ].map(save)
  );
  const [user1, user2] = users;
  console.log(`Seeded ${users.length} users`);

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
        text: `Source: https://www.bettycrocker.com/recipes/skillet-chicken-stroganoff/4966ef59-6380-49aa-89bf-5bf285b37a44

      Skillet Chicken Stroganoff

      Ingredients

      1/4 cup Gold Medal™ all-purpose flour
      1 teaspoon paprika
      1/2 teaspoon salt
      1/2 teaspoon pepper
      1/4 cup butter
      1/2 cup chopped onion
      1 package (8 oz) white mushrooms, sliced
      1 package (20 oz) boneless skinless chicken thighs, cut into 1-inch pieces
      1 1/4 cups Progresso™ chicken broth (from 32-oz carton)
      1 tablespoon Worcestershire sauce
      1 cup sour cream
      Chopped Italian (flat-leaf) parsley, if desired
      6 cups cooked egg noodles, if desired

      Instructions

      In small bowl, mix flour, paprika, salt and pepper; set aside.

      In 12-inch nonstick skillet, heat 2 tablespoons of the butter over medium heat; add onion and mushrooms. Cook 5 to 7 minutes, stirring occasionally, until vegetables are tender; transfer mixture to small bowl.

      In same skillet, melt remaining 2 tablespoons butter; add chicken, and cook 4 to 6 minutes, stirring frequently, until chicken starts to brown. Add onion and mushroom mixture back to skillet; sprinkle with flour mixture, stirring to coat. Slowly add chicken broth and Worcestershire sauce, stirring constantly.

      Heat to simmering; reduce heat to medium-low, and cook 3 to 5 minutes, stirring occasionally, until sauce is thickened and chicken is cooked through. Remove from heat; stir in sour cream. Garnish with parsley. Serve mixture over cooked egg noodles.
      `,
        title: "Skillet Chicken Stroganoff",
        sourceSite: "bettycrocker.com",
        sourceUrl:
          "https://www.bettycrocker.com/recipes/skillet-chicken-stroganoff/4966ef59-6380-49aa-89bf-5bf285b37a44",
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
    ].map(save)
  );
  const [popcake, cream, chickenStrog, cakeShake, forkedPopcake] = recipes;
  console.log(`Seeded ${recipes.length} recipes`);

  const tags = await Promise.all(
    [
      tagRepo.create({
        name: "dessert",
        recipes: [popcake, cream, cakeShake, forkedPopcake],
      }),
      tagRepo.create({ name: "beverage", recipes: [cream, cakeShake] }),
      tagRepo.create({ name: "entre", recipes: [chickenStrog] }),
      tagRepo.create({ name: "meat", recipes: [chickenStrog] }),
    ].map(save)
  );
  console.log(`Seeded ${tags.length} tags`);
};

if (module === require.main) {
  (async () => {
    try {
      console.log("\nSeeding...\n");
      await seed();
      console.log("\nSeeding complete");
      process.exit(0);
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  })();
}

export default seed;
