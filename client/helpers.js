export const downloadRecipe = (text, title) => {
  const textAsBlob = new Blob([text], { type: `text/plain` })
  const downloadLink = document.createElement(`a`)
  downloadLink.download = title
  downloadLink.href = window.URL.createObjectURL(textAsBlob)
  downloadLink.onclick = evt => { document.body.removeChild(evt.target) }
  downloadLink.style.display = `none`
  document.body.appendChild(downloadLink)
  downloadLink.click()
  // eslint-disable-next-line no-alert
  alert(`Saved to your default download location`)
}
