/* global chrome:false */

const SUPPORTED_SITES = [
  "allrecipes.com",
  "bonappetit.com",
  "budgetbytes.com",
  "cooking.nytimes.com",
  "delish.com",
  "eatingwell.com",
  "epicurious.com",
  "food.com",
  "food52.com",
  "foodandwine.com",
  "foodnetwork.com",
  "seriouseats.com",
  "simplyrecipes.com",
  "tasty.co",
  "thekitchn.com",
]

// Show/grey out browser button depending on whether site is supported
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (SUPPORTED_SITES.some((site) => tabs[0].url.includes(site))) {
      chrome.pageAction.show(tabId)
    }
  })
})

// Send URL to scraping logic, spawn popup on response and make recipeData available to popup.js
chrome.pageAction.onClicked.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { tab: tabs[0] }, (recipe) => {
      chrome.windows.create({
        url: `popup.html`,
        type: `popup`,
        width: 600,
        height: 800,
      })
      window.recipe = recipe
    })
  })
})
