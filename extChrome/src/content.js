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

        const recipeData = parser($, sourceUrl)

        const compressedText = recipeData.text.replace(/\s/g, "")
        const hasNoTitle = !recipeData.title
        const hasNoIngredients = compressedText.includes(
          "IngredientsInstructions"
        )
        const hasNoInstructions = compressedText.endsWith("Instructions")
        if (hasNoTitle || hasNoIngredients || hasNoInstructions) {
          sendResponse([null, "Failed to scrape"])
          return
        }

        sendResponse([recipeData, null])
      } catch (err) {
        sendResponse([null, err.toString()])
      }
    default:
      return
  }
})
