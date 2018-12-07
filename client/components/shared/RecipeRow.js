import React from 'react'
import {NavLink} from 'react-router-dom'

const RecipeRow = props => {
  const {createdBy, forkedCount, id, sourceSite, tags, text, title, userId} = props.recipe
  return (
    <div>
      <span>{`${id} : ${title} : ${sourceSite}`}</span>
      {tags.length
        ? tags.map(tag => (
          <NavLink
            key={tag.id}
            to="/"
            // TODO add "to" for search page for that tag
          >
            {`${tag.name} `}
          </NavLink>
        ))
        : <span>No Tags</span>}
      <NavLink to={`/user/${createdBy}`}>
        {`CreatedBy: ${createdBy}`}
      </NavLink>
      <NavLink to={`/user/${userId}`}>
        {`OwnerId: ${userId}`}
      </NavLink>
      <span>{`Forked ${forkedCount} times`}</span>
      <span>{text.slice(0, 140)}</span>

    </div>
  )
}

export default RecipeRow
