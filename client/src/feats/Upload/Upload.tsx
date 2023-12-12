import React from "react"

import { Card, CardTitle } from "@/comps/Card"
import { RecipeForm } from "@/comps/Form"

export const Upload: React.FC = () => (
  <Card>
    <CardTitle>Upload recipe</CardTitle>
    <RecipeForm recipe={{ sourceSite: "upload", sourceUrl: "upload" }} />
  </Card>
)
