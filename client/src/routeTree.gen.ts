/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from "./routes/__root"
import { Route as IndexImport } from "./routes/index"
import { Route as UsersIndexImport } from "./routes/users.index"
import { Route as RecipesIndexImport } from "./routes/recipes.index"
import { Route as UsersUserIdImport } from "./routes/users.$userId"
import { Route as RecipesRecipeIdImport } from "./routes/recipes.$recipeId"

// Create/Update Routes

const IndexRoute = IndexImport.update({
  path: "/",
  getParentRoute: () => rootRoute,
} as any)

const UsersIndexRoute = UsersIndexImport.update({
  path: "/users/",
  getParentRoute: () => rootRoute,
} as any)

const RecipesIndexRoute = RecipesIndexImport.update({
  path: "/recipes/",
  getParentRoute: () => rootRoute,
} as any)

const UsersUserIdRoute = UsersUserIdImport.update({
  path: "/users/$userId",
  getParentRoute: () => rootRoute,
} as any)

const RecipesRecipeIdRoute = RecipesRecipeIdImport.update({
  path: "/recipes/$recipeId",
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      id: "/"
      path: "/"
      fullPath: "/"
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    "/recipes/$recipeId": {
      id: "/recipes/$recipeId"
      path: "/recipes/$recipeId"
      fullPath: "/recipes/$recipeId"
      preLoaderRoute: typeof RecipesRecipeIdImport
      parentRoute: typeof rootRoute
    }
    "/users/$userId": {
      id: "/users/$userId"
      path: "/users/$userId"
      fullPath: "/users/$userId"
      preLoaderRoute: typeof UsersUserIdImport
      parentRoute: typeof rootRoute
    }
    "/recipes/": {
      id: "/recipes/"
      path: "/recipes"
      fullPath: "/recipes"
      preLoaderRoute: typeof RecipesIndexImport
      parentRoute: typeof rootRoute
    }
    "/users/": {
      id: "/users/"
      path: "/users"
      fullPath: "/users"
      preLoaderRoute: typeof UsersIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  "/": typeof IndexRoute
  "/recipes/$recipeId": typeof RecipesRecipeIdRoute
  "/users/$userId": typeof UsersUserIdRoute
  "/recipes": typeof RecipesIndexRoute
  "/users": typeof UsersIndexRoute
}

export interface FileRoutesByTo {
  "/": typeof IndexRoute
  "/recipes/$recipeId": typeof RecipesRecipeIdRoute
  "/users/$userId": typeof UsersUserIdRoute
  "/recipes": typeof RecipesIndexRoute
  "/users": typeof UsersIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  "/": typeof IndexRoute
  "/recipes/$recipeId": typeof RecipesRecipeIdRoute
  "/users/$userId": typeof UsersUserIdRoute
  "/recipes/": typeof RecipesIndexRoute
  "/users/": typeof UsersIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | "/"
    | "/recipes/$recipeId"
    | "/users/$userId"
    | "/recipes"
    | "/users"
  fileRoutesByTo: FileRoutesByTo
  to: "/" | "/recipes/$recipeId" | "/users/$userId" | "/recipes" | "/users"
  id:
    | "__root__"
    | "/"
    | "/recipes/$recipeId"
    | "/users/$userId"
    | "/recipes/"
    | "/users/"
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  RecipesRecipeIdRoute: typeof RecipesRecipeIdRoute
  UsersUserIdRoute: typeof UsersUserIdRoute
  RecipesIndexRoute: typeof RecipesIndexRoute
  UsersIndexRoute: typeof UsersIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  RecipesRecipeIdRoute: RecipesRecipeIdRoute,
  UsersUserIdRoute: UsersUserIdRoute,
  RecipesIndexRoute: RecipesIndexRoute,
  UsersIndexRoute: UsersIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/recipes/$recipeId",
        "/users/$userId",
        "/recipes/",
        "/users/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/recipes/$recipeId": {
      "filePath": "recipes.$recipeId.tsx"
    },
    "/users/$userId": {
      "filePath": "users.$userId.tsx"
    },
    "/recipes/": {
      "filePath": "recipes.index.tsx"
    },
    "/users/": {
      "filePath": "users.index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */