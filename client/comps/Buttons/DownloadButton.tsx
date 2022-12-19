import React from 'react'

import { downloadRecipe } from '@/helpers'

import skele from '@/skeleton.css'

type Props = {
  text: string
  title: string
}

export const DownloadButton: React.FC<Props> = ({ text, title }) => (
  <button
    type="button"
    onClick={() => downloadRecipe(text, title)}
    className={skele[`button-primary`]}
  >
    Download
  </button>
)
