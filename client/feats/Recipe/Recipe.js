import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'

import DispMode from './DispMode'
import EditMode from './EditMode'
import PageFailure from '../PageFailure'

const Account = ({ me, location }) => {
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
      <>
        <h2>{recipe.title}</h2>
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
      </>
    )
      :
      <PageFailure type="404" />
  )
}

const mstp = state => ({
  me: state.user,
})

export default connect(mstp, null)(withRouter(Account))
