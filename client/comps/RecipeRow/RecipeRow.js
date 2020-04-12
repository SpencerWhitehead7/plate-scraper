import React from 'react'
import { Link } from 'react-router-dom'

import Tags from 'comps/Tags'

import sg from 'styles/index.scss'

const RecipeRow = ({ createdBy, forkedCount, id, sourceSite, tags, text, title, userId }) => (
  <div className={sg.p_m}>
    <Link to={`/recipe/${id}`}>
      {title}
    </Link>
    &nbsp;-&nbsp;
    {sourceSite}
    <div>
      Created By:&nbsp;
      <Link className={sg.pr_m} to={`/user/${createdBy}`}>
        {createdBy}
      </Link>
      OwnerId:&nbsp;
      <Link to={`/user/${userId}`}>
        {userId}
      </Link>

    </div>
    <Tags tags={tags} />
    <div>{`Forked ${forkedCount} times`}</div>
    <div className={sg.textShowBreaks}>{`${text.slice(0, 280)}...`}</div>
  </div>
)

export default RecipeRow
