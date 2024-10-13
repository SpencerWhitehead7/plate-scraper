/* eslint-disable @typescript-eslint/no-unused-vars */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import qs from "qs"

import * as AC from "@/@types/apiContract"

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["auth", "recipe", "user", "usersAll"],
  endpoints: (builder) => ({
    // AUTH START
    getMe: builder.query<AC.GetMeRes, AC.GetMeReq>({
      query: () => "/auth",
      providesTags: (r, e, args) => (e ? [] : [{ type: "auth", id: "me" }]),
    }),

    signup: builder.mutation<AC.SignUpRes, AC.SignUpReq>({
      query: (body) => ({
        url: "/auth",
        method: "POST",
        body,
      }),
      invalidatesTags: (r, e, args) =>
        e ? [] : [{ type: "auth", id: "me" }, { type: "usersAll" }],
    }),

    editMe: builder.mutation<AC.EditMeRes, AC.EditMeReq & { userId: number }>({
      query: (body) => ({
        url: "/auth",
        method: "PUT",
        body,
      }),
      invalidatesTags: (r, e, args) =>
        e
          ? []
          : [
              { type: "auth", id: "me" },
              { type: "user", id: args.userId },
              { type: "usersAll" },
            ],
    }),

    deleteMe: builder.mutation<
      AC.DeleteMeRes,
      AC.DeleteMeReq & { userId: number }
    >({
      query: (body) => ({
        url: "/auth",
        method: "DELETE",
        body,
      }),
      invalidatesTags: (r, e, args) =>
        e
          ? []
          : [
              { type: "auth", id: "me" },
              { type: "user", id: args.userId },
              { type: "usersAll" },
            ],
    }),

    login: builder.mutation<AC.LoginRes, AC.LoginReq>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: (r, e, args) => (e ? [] : [{ type: "auth", id: "me" }]),
    }),

    logout: builder.mutation<AC.LogoutRes, AC.LogoutReq>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: (r, e, args) => (e ? [] : [{ type: "auth", id: "me" }]),
    }),
    // AUTH END

    // RECIPE START
    createRecipe: builder.mutation<
      AC.CreateRecipeRes,
      AC.CreateRecipeReq & { userId: number }
    >({
      query: (body) => ({
        url: "/recipe",
        method: "POST",
        body,
      }),
      invalidatesTags: (r, e, args) =>
        e ? [] : [{ type: "user", id: args.userId }],
    }),

    getRecipe: builder.query<AC.GetRecipeRes, AC.GetRecipeReq>({
      query: (params) => ({
        url: `/recipe/${params.recipeId}`,
      }),
      providesTags: (r, e, args) =>
        e ? [] : [{ type: "recipe", id: args.recipeId }],
    }),

    getRecipesByTag: builder.query<
      AC.GetRecipesByTagRes,
      AC.GetRecipesByTagReq
    >({
      query: (params) => ({
        url: `/recipe${qs.stringify(params.tags, { addQueryPrefix: true })}`,
      }),
      providesTags: (r, e, args) =>
        e ? [] : (r ?? []).map((recipe) => ({ type: "recipe", id: recipe.id })),
    }),

    // getRecipesAll: builder.query<AC.GetRecipesAllRes, AC.GetRecipesAllReq>({}),

    editRecipe: builder.mutation<
      AC.EditRecipeRes,
      AC.EditRecipeReq & { userId: number }
    >({
      query: (body) => ({
        url: `/recipe/${body.recipeId}`,
        method: "PUT",
        body: {
          text: body.text,
          title: body.title,
          tags: body.tags,
        },
      }),
      invalidatesTags: (r, e, args) =>
        e
          ? []
          : [
              { type: "recipe", id: args.recipeId },
              { type: "user", id: args.userId },
            ],
    }),

    deleteRecipe: builder.mutation<
      AC.DeleteRecipeRes,
      AC.DeleteRecipeReq & { userId: number }
    >({
      query: (body) => ({
        url: `/recipe/${body.recipeId}`,
        method: "DELETE",
      }),
      invalidatesTags: (r, e, args) =>
        e
          ? []
          : [
              { type: "recipe", id: args.recipeId },
              { type: "user", id: args.userId },
            ],
    }),

    forkRecipe: builder.mutation<
      AC.ForkRecipeRes,
      AC.ForkRecipeReq & { userId: number }
    >({
      query: (body) => ({
        url: `/recipe/fork/${body.recipeId}`,
        method: "POST",
      }),
      invalidatesTags: (r, e, args) =>
        e
          ? []
          : [
              { type: "recipe", id: args.recipeId },
              { type: "user", id: args.userId },
            ],
    }),
    // RECIPE END

    // SCRAPE START
    scrape: builder.mutation<AC.ScrapeRes, AC.ScrapeReq>({
      query: (body) => ({
        url: "/scrape",
        method: "POST",
        body,
      }),
    }),
    // SCRAPE END

    // USER START
    getUsersAll: builder.query<AC.GetUsersAllRes, AC.GetUsersAllReq>({
      query: () => ({
        url: `/user`,
      }),
      providesTags: (r, e, args) => (e ? [] : [{ type: "usersAll" }]),
    }),

    getUser: builder.query<AC.GetUserRes, AC.GetUserReq>({
      query: (params) => ({
        url: `/user/${params.userId}`,
      }),
      providesTags: (r, e, args) =>
        e ? [] : [{ type: "user", id: args.userId }],
    }),
    // USER END
  }),
})

export const {
  useGetMeQuery,
  useSignupMutation,
  useEditMeMutation,
  useDeleteMeMutation,
  useLoginMutation,
  useLogoutMutation,
  useCreateRecipeMutation,
  useGetRecipeQuery,
  useGetRecipesByTagQuery,
  useLazyGetRecipesByTagQuery,
  useEditRecipeMutation,
  useDeleteRecipeMutation,
  useForkRecipeMutation,
  useScrapeMutation,
  useGetUsersAllQuery,
  useGetUserQuery,
} = api
