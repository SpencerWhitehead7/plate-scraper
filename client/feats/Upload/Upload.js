import React from 'react'

import Card, { CardTitle } from 'comps/Card'
import { RecipeForm } from 'comps/Form'

const Upload = () => (
  <Card>
    <CardTitle>Upload recipe</CardTitle>
    <RecipeForm recipe={{ sourceSite: `upload`, sourceUrl: `upload` }} />
  </Card>
)

export default Upload
