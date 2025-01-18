import { expect } from "chai"

import { scrape } from "../scrape"

describe("Scraper", () => {
  it("throws when page cannot be loaded", async () => {
    await expect(scrape("https://www.allrecipes.com 123")).to.be.rejectedWith(
      Error,
      "Failed to parse URL from",
    )
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
