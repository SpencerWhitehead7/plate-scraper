/* global chrome:false */

window.addEventListener(`DOMContentLoaded`, () => {
  const textarea = document.getElementsByTagName(`textarea`)[0]
  const button = document.getElementsByTagName(`button`)[0]
  const input = document.getElementsByTagName(`input`)[0]

  // Download text as .txt file
  const download = () => {
    // Getting text into a downloadable format
    const text = textarea.value
    const textBlob = new Blob([text], { type: `text/plain` })
    const fileName = input.value

    // Triggering download
    const downloadLink = document.createElement(`a`)
    downloadLink.download = fileName
    downloadLink.href = window.URL.createObjectURL(textBlob)
    downloadLink.onclick = (evt) => {
      document.body.removeChild(evt.target)
    }
    downloadLink.style.display = `none`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    alert(`Saved to your default download location`)
  }

  // Populate textarea
  chrome.runtime.getBackgroundPage((background) => {
    const { recipe } = background
    if (!recipe) {
      textarea.value = `No recipe`
      button.disabled = true
    } else if (recipe.error) {
      textarea.value = recipe.error
      button.disabled = true
    } else if (recipe && (!recipe.title || !recipe.text)) {
      textarea.value = `Failed to scrape: make sure you're on a specific recipe's page`
      button.disabled = true
    } else {
      textarea.value = recipe.text
      input.value = `${recipe.sourceSite} ${recipe.title}`
      button.addEventListener(`click`, download)
    }
  })
})
