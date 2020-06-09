import axios from 'axios'
import qs from 'qs'

export const SUPPORTED_SITES = [
  `allrecipes.com`,
  `bettycrocker.com`,
  `bonappetit.com`,
  `chowhound.com`,
  `cookinglight.com`,
  `eatingwell.com`,
  `epicurious.com`,
  `food.com`,
  // `food52.com`,
  `foodandwine.com`,
  `foodnetwork.com`,
  `jamieoliver.com`,
  `myrecipes.com`,
  `seriouseats.com/recipes`,
  `simplyrecipes.com`,
  // `thekitchn.com`,
]

export const API = {
  auth: {
    getMe: () => axios.get(`/api/auth`),
    signup: (email, userName, password) => axios.post(`/api/auth`, {
      email,
      userName,
      password,
    }),
    editMe: (password, newEmail, newUserName, newPassword) => axios.put(`/api/auth`, {
      password,
      newEmail,
      newUserName,
      newPassword,
    }),
    deleteMe: password => axios.delete(`/api/auth`, { data: { password } }),
    login: (email, password) => axios.post(`/api/auth/login`, { email, password }),
    logout: () => axios.post(`/api/auth/logout`),
  },
  recipe: {
    // getAll: () => axios.get(`/api/recipe`),
    create: (text, title, sourceSite, sourceUrl, tags) => axios.post(`/api/recipe`, {
      text,
      title,
      sourceSite,
      sourceUrl,
      tags,
    }),
    get: recipeId => axios.get(`/api/recipe/byId/${recipeId}`),
    getByTag: tags => axios.get(`/api/recipe/byTag/${qs.stringify(tags, { addQueryPrefix: true })}`),
    fork: recipeId => axios.post(`/api/recipe/fork/${recipeId}`),
    edit: (recipeId, text, title, tags) => axios.put(`/api/recipe/${recipeId}`, {
      text,
      title,
      tags,
    }),
    destroy: recipeId => axios.delete(`/api/recipe/${recipeId}`),
  },
  scrape: url => axios.post(`/api/scrape`, { url }),
  user: userId => axios.get(`/api/user/${userId}`),
}

export const URL = {
  base: `/`,
  scrape: `/scrape/website`,
  user: userId => `/user/${userId}`,
  recipe: recipeId => `/recipe/${recipeId}`,
  search: (tags = []) => (tags.length
    ? `/search${qs.stringify(tags, { addQueryPrefix: true })}`
    : `/search`),
}

export const PATH = {
  base: `/`,
  scrape: `/scrape/:scrapeMethod`,
  user: `/user/:userId`,
  recipe: `/recipe/:recipeId`,
  search: `/search`,
}
