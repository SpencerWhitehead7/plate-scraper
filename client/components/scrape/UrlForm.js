import React from 'react'

import SubmitButton from './SubmitButton'
import Warning from './Warning'

import s from './scrape.css'

const UrlForm = ({ handleSubmit, handleChange, url }) => (
  <>
    {
      url.toLowerCase().includes(`seriouseats.com`) && !url.toLowerCase().includes(`seriouseats.com/recipes`) &&
        <Warning err="Make sure your url is from seriouseats.com/recipes, not just seriouseats.com" />
    }
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="url"
        placeholder="url of recipe you want to scrape, e.g. https://www.allrecipes.com/recipe/22918/pop-cake/"
        value={url}
        onChange={handleChange}
        className={s.urlInput}
      />
      <SubmitButton url={url} />
    </form>
  </>
)

export default UrlForm
