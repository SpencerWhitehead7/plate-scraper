/* global chrome:false */
import $ from "jquery"
import { selectParser } from "plate-scraper-parsers"

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { url } = message.tab

  const parser = selectParser(url)
  if (parser === null) return { error: "No domain matched" }

  const recipe = parser($, url)

  sendResponse(recipe)
})
