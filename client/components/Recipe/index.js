import React, {useState, useEffect} from 'react'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import axios from 'axios'

import DispMode from './DispMode'
import EditMode from './EditMode'
import PageFailure from '../PageFailure'

import s from './recipe.css'

const Account = props => {
  const {me, location} = props
  const id = location.pathname.split(`/`).pop()
  const [isMyRecipe, setIsMyRecipe] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [recipe, setRecipe] = useState({})
  const fetchRecipe = async () => {
    try{
      const {data} = await axios.get(`/api/recipe/byid/${id}`)
      setRecipe(data)
    }catch(err){
      console.log(err)
    }
  }
  useEffect(() => {fetchRecipe()}, [location])
  useEffect(() => {setIsMyRecipe(recipe.userId === me.id)}, [recipe, me])

  console.log(recipe)
  return (
    recipe ?
      <main>
        <h1>{recipe.title}</h1>
        {isMyRecipe &&
          <button
            type="button"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? `Cancel` : `Edit`}
          </button>}
        {
          editMode && isMyRecipe ? /* undoes edit mode if you log out while on page */
            <EditMode
              recipe={recipe}
              setRecipe={setRecipe}
              setEditMode={setEditMode}
            /> :
            <DispMode recipe={recipe}/>
        }
      </main>
      :
      <PageFailure type="404"/>
  )
}

const mstp = state => ({
  me : state.user,
})

export default connect(mstp, null)(withRouter(Account))
