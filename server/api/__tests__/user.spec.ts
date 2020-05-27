import { expect } from "chai";
import * as request from "supertest";
import {
  syncDB,
  app,
  connection,
  factoryRecipe,
  factoryTag,
  factoryUser,
} from "../../mochaSetup";

describe("API Route User: /api/user", () => {
  const route = "/api/user";
  beforeEach(syncDB);
  afterEach(syncDB);

  describe("/:id", () => {
    describe("GET", () => {
      it("returns the user, their recipes, and their recipes' tags", async () => {
        const user = await connection.manager.save(factoryUser());
        const recipe = await connection.manager.save(factoryRecipe({ user }));
        await connection.manager.save(factoryTag({ recipes: [recipe] }));

        const res = await request(app).get(`${route}/1`);

        expect(res.status).to.equal(200);
        expect(res.body.id).to.equal(user.id);
        expect(res.body.email).to.equal(user.email);
        expect(res.body.userName).to.equal(user.userName);
        expect(res.body.recipes).to.have.lengthOf(1);
        expect(res.body.recipes[0].tags).to.have.lengthOf(1);
      });
    });
  });
});
