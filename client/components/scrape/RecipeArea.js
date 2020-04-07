import React from 'react'
import TextAreaAutosize from 'react-textarea-autosize'

import Download from './Download'

const RecipeArea = ({ handleChange, recipe, title, sourceSite }) => (
  <div>
    <TextAreaAutosize
      name="recipe"
      onChange={handleChange}
      value={recipe}
      id="recipe-textarea"
    />
    <Download
      title={title}
      sourceSite={sourceSite}
      recipe={recipe}
    />
  </div>
)

export default RecipeArea
