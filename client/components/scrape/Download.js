import React, { useState } from 'react'

const Download = ({ recipe, sourceSite, title }) => {
  const [fileName, setFileName] = useState(`${sourceSite.slice(0, -4)} ${title}`)

  const handleSubmit = evt => {
    evt.preventDefault()
    const textAsBlob = new Blob([recipe], { type: `text/plain` })
    const downloadLink = document.createElement(`a`)
    downloadLink.download = fileName
    downloadLink.innerHTML = `Download Recipe`
    downloadLink.href = window.URL.createObjectURL(textAsBlob)
    downloadLink.onclick = event => { document.body.removeChild(event.target) }
    downloadLink.style.display = `none`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    // eslint-disable-next-line no-alert
    alert(`Saved to your default download location`)
  }

  return (
    <form onSubmit={handleSubmit} id="download">
      <label htmlFor="fileName">Filename:</label>
      <input name="fileName" onChange={evt => setFileName(evt.target.value)} value={fileName} />
      <button type="submit">Download Recipe</button>
    </form>
  )
}

export default Download
