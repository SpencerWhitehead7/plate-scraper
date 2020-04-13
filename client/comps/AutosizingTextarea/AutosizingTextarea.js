import React, { useEffect, useRef } from 'react'

import s from './AutosizingTextarea.scss'

const AutosizingTextarea = props => {
  const { value } = props

  const el = useRef(null)
  useEffect(() => {
    const originalY = window.scrollY
    el.current.style.height = `auto`
    el.current.style.height = `${el.current.scrollHeight + 2}px` // enough to remove scrollbar
    el.current.scrollTop = el.current.scrollHeight
    window.scrollTo(window.scrollLeft, originalY)
    // window scrolls down when you create a new line at bottom of text area
    // but not when you push the bottom down by adding lines in the middle
  }, [value])

  return <textarea ref={el} className={s.autosizingTextArea} {...props} />
}

export default AutosizingTextarea
