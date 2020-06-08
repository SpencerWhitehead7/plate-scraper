import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { API } from 'consts'
import Card, { CardTitle } from 'comps/Card'
import { FormInputButtonBar, FormSubmit } from 'comps/Form'
import LoadingIndicator from 'comps/LoadingIndicator'
import RecipeRows from 'comps/RecipeRows'

const Search = () => {
  const [recipes, setRecipes] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { errors, formState, handleSubmit, register } = useForm({ mode: `onChange` })

  const onSubmit = async ({ searchTerms }) => {
    try {
      setIsLoading(true)
      const tags = searchTerms
        .toLowerCase()
        .replace(/[^a-z\s]/gi, ``)
        .replace(/\s\s+/g, ` `)
        .trim()
        .split(` `)

      const { data } = await API.recipe.getByTag(tags)
      setIsLoading(false)
      setRecipes(data)
    } catch (err) {
      // could use some real handling
      console.log(err)
    }
  }

  return (
    <Card>
      <CardTitle>Search</CardTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInputButtonBar
          identifier="searchTerms"
          labelText="Search for recipes by tag"
          register={register({ required: true })}
          errors={errors}
          Button={<FormSubmit formState={formState} value="Search!" />}
          autoComplete="off"
          placeholder="fish entre cod"
        />
      </form>
      {isLoading
        ? <LoadingIndicator />
        : formState.isSubmitted && (
          <>
            <p>{`${recipes.length} recipes with these tags`}</p>
            <RecipeRows recipes={recipes} />
          </>
        )}
    </Card>
  )
}

export default Search
