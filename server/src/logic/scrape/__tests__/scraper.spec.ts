import { expect } from "chai"

import { scrape } from "../index"

describe("Scraper", () => {
  it("throws when page cannot be loaded", () => {
    return expect(scrape("https://www.abc 123.not valid")).to.be.rejected
  })
  it("throws when the page is not from a supported site", () => {
    return expect(scrape("https://www.wikipedia.org")).to.be.rejectedWith(
      Error,
      "site invalid",
    )
  })
  it("throws when the site is supported but a recipe cannot be extracted", () => {
    return expect(scrape("https://www.allrecipes.com")).to.be.rejectedWith(
      Error,
      "scrape failed",
    )
  })
})
