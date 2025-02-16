import $ from "jquery"

import { selectParser } from "plate-scraper-parsers"

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case "GET_RECIPE":
      try {
        const sourceUrl = window.location.href

        const parser = selectParser(sourceUrl)
        // if the enable/disable logic is right, this case should never happen
        if (parser === null) {
          sendResponse([null, "No parser matched"])
          return
        }

        const { data, isValid } = parser($, sourceUrl)

        if (!isValid) {
          sendResponse([null, "Failed to scrape"])
          return
        }

        sendResponse([data, null])
      } catch (err) {
        sendResponse([null, err.toString()])
      }
    default:
      return
  }
})
