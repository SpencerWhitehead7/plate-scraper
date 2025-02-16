const ICON_URLS = [
  "icons/icon-16.png",
  "icons/icon-32.png",
  "icons/icon-48.png",
  "icons/icon-128.png",
]

const loadImageData = async (url) => {
  const imgResponse = await fetch(url)
  const imgBlob = await imgResponse.blob()
  const img = await createImageBitmap(imgBlob)
  const { width, height } = img
  const canvas = new OffscreenCanvas(width, height)
  const ctx = canvas.getContext("2d")
  ctx.drawImage(img, 0, 0, width, height)
  return ctx.getImageData(0, 0, width, height)
}

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

chrome.runtime.onInstalled.addListener(async (details) => {
  const [icon16, icon32, icon48, icon128] = await Promise.all(
    ICON_URLS.map(loadImageData)
  )

  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: SUPPORTED_SITES.map(
          (s) =>
            new chrome.declarativeContent.PageStateMatcher({
              pageUrl: {
                urlContains: s,
              },
            })
        ),
        actions: [
          new chrome.declarativeContent.SetIcon({
            // this is supposed to (the docs say) be able to take a
            // "paths" key, but that is broken/unimplemented, so
            // you have to load 'em all into imageDatas by hand
            imageData: {
              16: icon16,
              32: icon32,
              48: icon48,
              128: icon128,
            },
          }),
          new chrome.declarativeContent.ShowAction(),
        ],
      },
    ])
  })
})
