import React from 'react'
import TextAreaAutosize from 'react-textarea-autosize'

import Download from './Download'

import s from './Scrape.scss'

const RecipeArea = ({ handleChange, recipe, title, sourceSite }) => (
  <div>
    <TextAreaAutosize
      className={s.recipeTextarea}
      name="recipe"
      onChange={handleChange}
      value={recipe}
    />
    <Download
      title={title}
      sourceSite={sourceSite}
      recipe={recipe}
    />
  </div>
)

export default RecipeArea
