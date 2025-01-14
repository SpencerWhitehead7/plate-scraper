import { expect } from "chai"

import { BASE_ROUTE } from "../../../mochaSetup"

describe("API Route Scrape: /api/scrape", () => {
  const route = BASE_ROUTE + "/api/scrape"

  describe("/", () => {
    describe("POST", () => {
      it("400s when the requested url is not from a supported site", async () => {
        const res = await fetch(route, {
          method: "POST",
          body: JSON.stringify({ url: "https://www.wikipedia.org" }),
          headers: { "content-type": "application/json" },
        })

        expect(res.status).to.equal(400)
      })
    })
  })
})
