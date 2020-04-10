import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

import ss from '../../index.css'

const RecipeRow = ({ createdBy, forkedCount, id, sourceSite, tags, text, title, userId }) => (
  <div className={`${ss.border} ${ss.p}`}>
    <Link to={`/recipe/${id}`}>
      {title}
    </Link>
    &nbsp;-&nbsp;
    {sourceSite}
    <div>
      Created By:&nbsp;
      <Link className={ss.pR} to={`/user/${createdBy}`}>
        {createdBy}
      </Link>
      OwnerId:&nbsp;
      <Link to={`/user/${userId}`}>
        {userId}
      </Link>

    </div>
    <div>
      {tags.length
        ? tags.map(tag => (
          <Link
            className={ss.pR}
            key={tag.id}
            to="/"
            // TODO add "to" for search page for that tag
          >
            {`${tag.name} `}
          </Link>
        ))
        : <span>No Tags</span>}
    </div>
    <div>{`Forked ${forkedCount} times`}</div>
    <div className={classnames(ss.borderT, ss.newlineSplit)}>{`${text.slice(0, 280)}...`}</div>
  </div>
)

export default RecipeRow
