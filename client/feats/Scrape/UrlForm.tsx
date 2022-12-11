import React from 'react'
import { useForm } from 'react-hook-form'

import { SUPPORTED_SITES } from '@/consts'
import { FormInputButtonBar, FormSubmit } from '@/comps/Form'

export const UrlForm = ({ triggerScrape }) => {
  const { formState, handleSubmit, register } = useForm({ mode: `onBlur` })

  const onSubmit = handleSubmit(async ({ url }) => {
    await triggerScrape({ url })
  })

  return (
    <form onSubmit={onSubmit}>
      <FormInputButtonBar
        identifier="url"
        labelText="Recipe url"
        register={register(`url`, {
          required: `required`,
          validate: {
            // eslint-disable-next-line no-extra-parens -- useful to indicate difference between conditional and warning message
            correctSeriousEats: value => (!value.toLowerCase().includes(`seriouseats.com`) || value.toLowerCase().includes(`seriouseats.com/recipes`)) || `Make sure your url is from seriouseats.com/recipes, not just seriouseats.com`,
            siteSupported: value => SUPPORTED_SITES.some(site => value.toLowerCase().includes(site)) || `Site is not supported`,
          },
        })}
        errors={formState.errors}
        Button={<FormSubmit formState={formState} value="Scrape!" />}
        placeholder="https://www.allrecipes.com/recipe/22918/pop-cake/"
      />
    </form>
  )
}
