import React, { useState } from 'react'

import s from './DownloadForm.scss'

const DownloadForm = ({ recipe, sourceSite, title }) => {
  const [fileName, setFileName] = useState(`${sourceSite.split(`.`)[0]} ${title}`)

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
    <form onSubmit={handleSubmit} className={s.downloadForm}>
      <label htmlFor="fileName">Filename:</label>
      <input
        type="text"
        name="fileName"
        className={s.downloadForm__input}
        onChange={evt => setFileName(evt.target.value)}
        value={fileName}
      />
      <button type="submit">Download!</button>
    </form>
  )
}

export default DownloadForm
