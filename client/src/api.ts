import { QueryClient, useMutation, useQuery } from "@tanstack/react-query"

import {
  ApiRecipe,
  ApiUser,
  ApiUserWithRecipes,
  CreateMeBody,
  CreateRecipeBody,
  DeleteMeBody,
  LoginBody,
  ScrapeBody,
  UpdateMeBody,
  UpdateRecipeBody,
} from "@/@types/apiContract"

import { API } from "./consts"

export const queryClient = new QueryClient()

const fetchWithThrow = <T = void>(
  ...args: Parameters<typeof fetch>
): Promise<T> =>
  fetch(...args).then((r) => {
    if (!r.ok) {
      throw Error(`${r.status}: ${r.statusText}`)
    }
    const contentType = r.headers.get("content-type")
    return contentType?.includes("application/json")
      ? (r.json() as T)
      : (r.text() as unknown as T)
  })

const QUERY_KEYS = {
  auth: () => ["auth" as const],
  recipesAll: (tags?: string[]) =>
    tags === undefined
      ? ["recipesAll" as const]
      : ["recipesAll" as const, { ...tags }],
  recipe: (recipeId: number) => ["recipe" as const, recipeId],
  usersAll: () => ["usersAll" as const],
  user: (userId: number) => ["user" as const, userId],
}

// AUTH START
export const useMutationCreateMe = () =>
  useMutation({
    mutationFn: (body: CreateMeBody) =>
      fetchWithThrow<ApiUser>(API.auth(), {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "content-type": "application/json" },
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.auth(), data)

      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.usersAll() })
    },
  })

export const useQueryMe = () =>
  useQuery({
    queryKey: QUERY_KEYS.auth(),
    queryFn: () => fetchWithThrow<ApiUser | null>(API.auth()),
  })

export const useMutationUpdateMe = () =>
  useMutation({
    mutationFn: (body: UpdateMeBody) =>
      fetchWithThrow<ApiUser>(API.auth(), {
        method: "PUT",
        body: JSON.stringify(body),
        headers: { "content-type": "application/json" },
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.auth(), data)

      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.usersAll() })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user(data.id) })
    },
  })

export const useMutationDeleteMe = () =>
  useMutation({
    mutationFn: (body: DeleteMeBody) =>
      fetchWithThrow(API.auth(), {
        method: "DELETE",
        body: JSON.stringify(body),
        headers: { "content-type": "application/json" },
      }),
    onSuccess: () => {
      const me = queryClient.getQueryData<ApiUser>(QUERY_KEYS.auth())
      if (me !== undefined) {
        queryClient.removeQueries({ queryKey: QUERY_KEYS.user(me.id) })

        void queryClient.setQueryData(QUERY_KEYS.auth(), null)

        void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.usersAll() })
      }
    },
  })

export const useMutationLogin = () =>
  useMutation({
    mutationFn: (body: LoginBody) =>
      fetchWithThrow<ApiUser>(API.session(), {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "content-type": "application/json" },
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.auth(), data)
    },
  })

export const useMutationLogout = () =>
  useMutation({
    mutationFn: () =>
      fetchWithThrow(API.session(), {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.setQueryData(QUERY_KEYS.auth(), null)
    },
  })
// AUTH END

// RECIPE START
export const useMutationCreateRecipe = () =>
  useMutation({
    mutationFn: (body: CreateRecipeBody) =>
      fetchWithThrow<ApiRecipe>(API.recipe(), {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "content-type": "application/json" },
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.recipe(data.id), data)

      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.user(data.userId),
      })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.recipesAll() })
    },
  })

export const useMutationForkRecipe = () =>
  useMutation({
    mutationFn: (recipeId: number) =>
      fetchWithThrow<ApiRecipe>(API.recipeFork(recipeId), {
        method: "POST",
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.recipe(data.id), data)

      // TODO: this "should" invalidate
      // the recipe it was forked from (to update its forkedCount)
      // the owner of that recipe (to update the recipe on it)
      // but that data's not readily available
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.user(data.userId),
      })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.recipesAll() })
    },
  })

export const useQueryRecipesAll = (tags?: string[]) =>
  useQuery({
    queryKey: QUERY_KEYS.recipesAll(tags),
    queryFn: () => fetchWithThrow<ApiRecipe[]>(API.recipesByTags(tags)),
  })

export const useQueryRecipe = (recipeId: number) =>
  useQuery({
    queryKey: QUERY_KEYS.recipe(recipeId),
    queryFn: () => fetchWithThrow<ApiRecipe>(API.recipe(recipeId)),
  })

export const useMutationUpdateRecipe = () =>
  useMutation({
    mutationFn: ({
      body,
      recipeId,
    }: {
      body: UpdateRecipeBody
      recipeId: number
    }) =>
      fetchWithThrow<ApiRecipe>(API.recipe(recipeId), {
        method: "PUT",
        body: JSON.stringify(body),
        headers: { "content-type": "application/json" },
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.recipe(data.id), data)

      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.user(data.userId),
      })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.recipesAll() })
    },
  })

export const useMutationDeleteRecipe = () =>
  useMutation({
    mutationFn: (recipeId: number) =>
      fetchWithThrow(API.recipe(recipeId), {
        method: "DELETE",
      }),
    onSuccess: (_, recipeId) => {
      queryClient.removeQueries({ queryKey: QUERY_KEYS.recipe(recipeId) })

      const me = queryClient.getQueryData<ApiUser>(QUERY_KEYS.auth())
      if (me !== undefined) {
        void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user(me.id) })
      }

      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.recipesAll() })
    },
  })
// RECIPE END

// SCRAPE START
export const useMutationScrape = () =>
  useMutation({
    mutationFn: (body: ScrapeBody) =>
      fetchWithThrow<ApiRecipe>(API.scrape(), {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "content-type": "application/json" },
      }),
  })
// SCRAPE END

// USER START
export const useQueryUsersAll = () =>
  useQuery({
    queryKey: QUERY_KEYS.usersAll(),
    queryFn: () => fetchWithThrow<ApiUser[]>(API.user()),
  })

export const useQueryUser = (userId: number) =>
  useQuery({
    queryKey: QUERY_KEYS.user(userId),
    queryFn: () => fetchWithThrow<ApiUserWithRecipes>(API.user(userId)),
  })
// USER END

// DERIVATIONS START
export const useQueryIsAuthed = () => {
  const { data } = useQueryMe()
  return Boolean(data)
}
// DERIVATIONS END
