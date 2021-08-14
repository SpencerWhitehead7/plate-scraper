import React from 'react'

import { downloadRecipe } from 'helpers'

import skele from 'skeleton.css'

const DownloadButton = ({ text, title }) => (
  <button
    type="button"
    onClick={() => downloadRecipe(text, title)}
    className={skele[`button-primary`]}
  >
    Download
  </button>
)

export default DownloadButton
