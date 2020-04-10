import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

import hc from '../helperClasses.css'

const RecipeRow = ({ createdBy, forkedCount, id, sourceSite, tags, text, title, userId }) => (
  <div className={`${hc.border} ${hc.p}`}>
    <Link to={`/recipe/${id}`}>
      {title}
    </Link>
    &nbsp;-&nbsp;
    {sourceSite}
    <div>
      Created By:&nbsp;
      <Link className={hc.pR} to={`/user/${createdBy}`}>
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
            className={hc.pR}
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
    <div className={classnames(hc.borderT, hc.newlineSplit)}>{`${text.slice(0, 280)}...`}</div>
  </div>
)

export default RecipeRow
