import React from 'react'
import classnames from 'classnames'

import { SUPPORTED_SITES } from 'consts'
import Warning from './Warning'

import skele from 'skeleton.css'
import s from './UrlForm.scss'

const UrlForm = ({ handleSubmit, handleChange, url }) => {
  const disabled = !SUPPORTED_SITES.some(site => url.includes(site))

  return (
    <form onSubmit={handleSubmit} className={s.urlForm}>
      <label htmlFor="url">
        Recipe url
        {url.toLowerCase().includes(`seriouseats.com`) &&
        !url.toLowerCase().includes(`seriouseats.com/recipes`) &&
          <Warning message="Make sure your url is from seriouseats.com/recipes, not just seriouseats.com" />}
      </label>
      <div className={s.urlForm__inputBar}>
        <input
          id="url"
          type="text"
          name="url"
          value={url}
          onChange={handleChange}
          placeholder="https://www.allrecipes.com/recipe/22918/pop-cake/"
          className={s.urlForm__input}
        />
        <button
          type="submit"
          disabled={disabled}
          className={classnames({ [skele[`button-primary`]]: !disabled })}
        >
          Scrape!
        </button>
      </div>
    </form>
  )
}

export default UrlForm
