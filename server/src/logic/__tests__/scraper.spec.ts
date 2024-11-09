import { expect } from "chai"

import { scrape } from "../scrape"

describe("Scraper", () => {
  it("throws when page cannot be loaded", async () => {
    await expect(scrape("https://www.abc 123.not valid")).to.be.rejected
  })
  it("throws when the page is not from a supported site", async () => {
    await expect(scrape("https://www.wikipedia.org")).to.be.rejectedWith(
      Error,
      "site invalid",
    )
  })
  it("throws when the site is supported but a recipe cannot be extracted", async () => {
    await expect(scrape("https://www.allrecipes.com")).to.be.rejectedWith(
      Error,
      "scrape failed",
    )
  })
})
