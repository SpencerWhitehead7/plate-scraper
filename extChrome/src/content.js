/* global chrome:false */
import $ from "jquery"
import { selectParser } from "plate-scraper-parsers"

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { url } = message.tab

  // handle seriouseats' weird url edgecase
  if (
    url.includes("seriouseats.com") &&
    !url.includes("seriouseats.com/recipes")
  )
    return {
      error:
        "Make sure your url is seriouseats.com/recipes, not just seriouseats.com",
    }

  const parser = selectParser(url)
  if (parser === null) return { error: "No domain matched" }

  const recipe = parser($, url)

  sendResponse(recipe)
})
