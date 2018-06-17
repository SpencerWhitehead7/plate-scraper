import React from 'react'

const RecipeRow = (props) => {
  const recipe = props.recipe
  return (
    <div>
      <span>{recipe.name}</span>
      <span>{recipe.sourceSite}</span>
      <span>{recipe.createdBy}</span>
      <span>{recipe.forkedCount}</span>
      <span>{recipe.tags}</span>
    </div>
  )
}

export default RecipeRow