import React from 'react'

import RecipeRow from './RecipeRow'

const RecipeContainer = (props) => {
  return (
    <div>
      <h4>Recipes</h4>
      {
        props.recipes.map(recipe => <RecipeRow key={recipe.id} recipe={recipe}/>)
      }
    </div>
  )
}

export default RecipeContainer