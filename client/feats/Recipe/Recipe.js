import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'

import Card, { CardTitle } from 'comps/Card'
import PageFailure from 'feats/PageFailure'
import DispMode from './DispMode'
import EditMode from './EditMode'

const Recipe = ({ me, location }) => {
  const id = location.pathname.split(`/`).pop()
  const [isMyRecipe, setIsMyRecipe] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [recipe, setRecipe] = useState({})
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const { data } = await axios.get(`/api/recipe/byid/${id}`)
        setRecipe(data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchRecipe()
  }, [location, id])
  useEffect(() => { setIsMyRecipe(recipe.userId === me.id) }, [recipe, me])

  return (
    recipe ? (
      <Card>
        <CardTitle>{recipe.title}</CardTitle>
        {isMyRecipe && (
          <button
            type="button"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? `Cancel` : `Edit`}
          </button>
        )}
        {
          editMode && isMyRecipe ? ( // undoes edit mode if you log out while on page
            <EditMode
              recipe={recipe}
              setRecipe={setRecipe}
              editMode={editMode}
              setEditMode={setEditMode}
            />
          ) :
            <DispMode recipe={recipe} />
        }
      </Card>
    )
      :
      <PageFailure type="No such recipe" />
  )
}

const mstp = state => ({
  me: state.auth.user,
})

export default connect(mstp, null)(withRouter(Recipe))
