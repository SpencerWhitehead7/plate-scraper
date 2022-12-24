export const downloadRecipe = (text: string, title: string) => {
  const textAsBlob = new Blob([text], { type: `text/plain` })
  const downloadLink = document.createElement(`a`)
  downloadLink.download = title
  downloadLink.href = window.URL.createObjectURL(textAsBlob)
  downloadLink.onclick = evt => { document.body.removeChild(evt.target as Node) }
  downloadLink.style.display = `none`
  document.body.appendChild(downloadLink)
  downloadLink.click()
  alert(`Saved to your default download location`)
}
