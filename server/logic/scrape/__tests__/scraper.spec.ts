import { expect } from "chai";

import expecteds from "./expectedResults";

import scrape from "../index";

describe("Scraper", () => {
  it("throws when page cannot be loaded", () => {
    return expect(scrape("https://www.abc 123.not valid")).to.be.rejected;
  })
  it("throws when the page is not from a supported site", () => {
    return expect(scrape("https://www.wikipedia.org")).to.be.rejectedWith(Error, "site invalid");
  })
  it("throws when the site is supported but a recipe cannot be extracted", () => {
    return expect(scrape("https://www.allrecipes.com")).to.be.rejectedWith(Error, "scrape failed");
  })

  describe.skip("The parsers handle", () => {
    let actuals: ({
      sourceSite: string;
      sourceUrl: string;
      text: string;
      title: string;
    } | null)[] = [];
    let i = 0;

    before(async () => {
      try {
        actuals = await Promise.all(
          expecteds.map(
            (testItem: {
              sourceSite: string;
              sourceUrl: string;
              text: string;
              title: string;
            }) => scrape(testItem.sourceUrl)
          )
        );
      } catch (err) {
        console.log(err);
      }
    });

    afterEach(() => {
      i++;
    });

    it("allrecipes", () => {
      expect(actuals[i]).to.deep.equal(expecteds[i]);
    });
    it("bettycrocker", () => {
      expect(actuals[i]).to.deep.equal(expecteds[i]);
    });
    it("bonappetit", () => {
      expect(actuals[i]).to.deep.equal(expecteds[i]);
    });
    it("chowhound", () => {
      expect(actuals[i]).to.deep.equal(expecteds[i]);
    });
    it("cookinglight", () => {
      expect(actuals[i]).to.deep.equal(expecteds[i]);
    });
    it("eatingwell", () => {
      expect(actuals[i]).to.deep.equal(expecteds[i]);
    });
    it("eatingwell fallback origin", () => {
      expect(actuals[i]).to.deep.equal(expecteds[i]);
    });
    it("epicurious", () => {
      expect(actuals[i]).to.deep.equal(expecteds[i]);
    });
    it("food", () => {
      expect(actuals[i]).to.deep.equal(expecteds[i]);
    });
    // it("food52", () => {
    //   expect(actuals[i]).to.deep.equal(expecteds[i]);
    // });
    it("foodandwine", () => {
      expect(actuals[i]).to.deep.equal(expecteds[i]);
    });
    it("foodnetwork", () => {
      expect(actuals[i]).to.deep.equal(expecteds[i]);
    });
    it("jamieoliver", () => {
      expect(actuals[i]).to.deep.equal(expecteds[i]);
    });
    it("myrecipes", () => {
      expect(actuals[i]).to.deep.equal(expecteds[i]);
    });
    it("seriouseats", () => {
      expect(actuals[i]).to.deep.equal(expecteds[i]);
    });
    it("simplyrecipes", () => {
      expect(actuals[i]).to.deep.equal(expecteds[i]);
    });
    // it("thekitchn", () => {
    //   expect(actuals[i]).to.deep.equal(expecteds[i]);
    // });
  });
});
