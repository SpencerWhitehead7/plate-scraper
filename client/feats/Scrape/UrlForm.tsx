import React from 'react'
import { useForm } from 'react-hook-form'

import { SUPPORTED_SITES } from '@/consts'
import { FormInputButtonBar, FormSubmit } from '@/comps/Form'

type Props = {
  submit: (url: string) => Promise<void>
}

export const UrlForm: React.FC<Props> = ({ submit }) => {
  const { formState, handleSubmit, register } = useForm({
    mode: `onBlur`,
    defaultValues: {
      url: ``,
    },
  })

  const onSubmit = handleSubmit(async ({ url }) => {
    await submit(url)
  })

  return (
    <form onSubmit={onSubmit}>
      <FormInputButtonBar
        identifier="url"
        labelText="Recipe url"
        register={register}
        registerOptions={{
          required: `required`,
          validate: {
            correctSeriousEats: (v: string) => {
              const sanitized = v.toLowerCase()
              return sanitized.includes(`seriouseats.com`) && !sanitized.includes(`seriouseats.com/recipes`)
                ? `Make sure your url is from seriouseats.com/recipes, not just seriouseats.com`
                : undefined
            },
            siteSupported: (v: string) => {
              const sanitized = v.toLowerCase()
              return !SUPPORTED_SITES.some(site => sanitized.includes(site))
                ? `Site is not supported`
                : undefined
            }
          },
        }}
        errors={formState.errors}
        Button={<FormSubmit formState={formState} value="Scrape!" />}
        placeholder="https://www.allrecipes.com/recipe/22918/pop-cake/"
      />
    </form>
  )
}
