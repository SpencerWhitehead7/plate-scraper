import React from 'react'
import { Link } from 'react-router-dom'

import Tags from 'comps/Tags'

import sg from 'styles/index.scss'
import s from './RecipeRows.scss'

const RecipeRow = ({ createdBy, forkedCount, id, sourceSite, tags, title, userId }) => (
  <div className={s.recipeRow}>
    <div>
      <div>
        <Link to={`/recipe/${id}`}>
          {title}
        </Link>
        {` - ${sourceSite}`}
      </div>
      <Tags tags={tags} />
    </div>

    {/* TODO: give authed user to recipeRows so that ownedBy and createdBy can show "Me" if it's yours */}
    <div>
      <div>
        <div>
          Created&nbsp;by&nbsp;
          <Link className={sg.pr_m} to={`/user/${createdBy}`}>
            {createdBy}
          </Link>
        </div>
        <div>
          Owned&nbsp;by&nbsp;
          <Link to={`/user/${userId}`}>
            {userId}
          </Link>
        </div>
      </div>
      <div>{`Forked ${forkedCount} times`}</div>
    </div>
  </div>
)

const RecipeRows = ({ recipes }) => recipes && recipes.map(recipe => <RecipeRow key={recipe.id} {...recipe} />)


export default RecipeRows
