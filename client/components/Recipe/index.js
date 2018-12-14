import React, {useState, useEffect} from 'react'
import {withRouter, NavLink} from 'react-router-dom'
import {connect} from 'react-redux'
import axios from 'axios'
import TextAreaAutosize from 'react-textarea-autosize'

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
  useEffect(() => {fetchRecipe()}, [location, editMode])
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
            {editMode ? `Done` : `Edit`}
          </button>}
        {`Tags `}
        {recipe.tags ?
          recipe.tags.map(tag => (
          // TODO add "to" for search page for that tag
            <NavLink
              key={tag.id}
              to="/"
            >
              {`${tag.name} `}
            </NavLink>
          ))
          : `none`
        }
        <div className={s.recipeText}>
          {recipe.text}
        </div>
      </main>
      :
      <PageFailure type="404"/>
  )
}

const mstp = state => ({
  me : state.user,
})

export default connect(mstp, null)(withRouter(Account))
