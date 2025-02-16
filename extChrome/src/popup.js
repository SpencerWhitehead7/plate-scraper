window.addEventListener("DOMContentLoaded", async () => {
  const recipeTextArea = document.getElementById("recipe")
  const filenameInput = document.getElementById("filename")
  const downloadButton = document.getElementById("download")

  // Download text as .txt file
  downloadButton.addEventListener("click", () => {
    // get text into a downloadable format
    const text = recipeTextArea.value
    const textBlob = new Blob([text], { type: "text/plain" })
    const filename = filenameInput.value
    // create download link
    const downloadLink = document.createElement("a")
    downloadLink.download = filename
    downloadLink.href = window.URL.createObjectURL(textBlob)
    downloadLink.style.display = "none"
    document.body.appendChild(downloadLink)
    // trigger download
    downloadLink.click()
    // cleanup
    document.body.removeChild(downloadLink)
    // notify
    alert(`Saved ${filename} to your default download folder`)
  })

  // get current tab
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  })

  // get recipe from current tab's content.js
  const [recipeData, err] = await chrome.tabs.sendMessage(tab.id, {
    action: "GET_RECIPE",
  })

  if (err) {
    recipeTextArea.value = err
  } else {
    recipeTextArea.value = recipeData.text
    filenameInput.value = `${recipeData.sourceSite} ${recipeData.title}`
    downloadButton.disabled = false
  }
})
