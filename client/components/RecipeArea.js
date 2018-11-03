import React from 'react'
import TextAreaAutosize from 'react-textarea-autosize'

import Download from './Download'

const RecipeArea = props => {
  const {handleChange, recipe, title, sourceSite} = props
  return (
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
        handleChange={handleChange}
      />
    </div>
  )
}

export default RecipeArea
