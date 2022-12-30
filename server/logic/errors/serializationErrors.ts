import { RequestHandler } from "express"
import { body, param, query, validationResult } from "express-validator"

const serializationErrorMiddleware: RequestHandler = (req, res, next) => {
  const errs = validationResult(req)

  if (errs.isEmpty()) {
    next()
  } else {
    if (process.env.NODE_ENV !== "test") console.error(errs.array())

    res.status(400).json({
      error: "InvalidInputErr",
      message: errs.array(),
    })
  }
}

const createBodyEmail = () => body("email").trim().isEmail().normalizeEmail()
const bodyEmail = createBodyEmail()
const bodyNewEmail = createBodyEmail().optional()

const createBodyUserName = () =>
  body("userName")
    .trim()
    .isString()
    .notEmpty()
    .isAlphanumeric()
    .isLength({ min: 0, max: 32 })
const bodyUserName = createBodyUserName()
const bodyNewUserName = createBodyUserName().optional()

const createBodyPassword = () =>
  body("password").trim().isString().notEmpty().isLength({ min: 0, max: 64 })
const bodyPassword = createBodyPassword()
const bodyNewPassword = createBodyPassword().optional()

const createBodyText = () => body("text").trim().isString().notEmpty()
const bodyText = createBodyText()
const bodyNewText = createBodyText().optional()

const createBodyTitle = () => body("title").trim().isString().notEmpty()
const bodyTitle = createBodyTitle()
const bodyNewTitle = createBodyTitle().optional()

const bodySourceSite = body("sourceSite")
  .trim()
  .isString()
  .notEmpty()
  .isLength({ min: 0, max: 64 })
  .optional()

const bodySourceUrl = body("sourceUrl").trim().isString().notEmpty().optional()

const bodyTags = body("tags.*")
  .trim()
  .toLowerCase()
  .whitelist("abcdefghijklmnopqrstuvwxyz")
  .isString()
  .notEmpty()
  .isLength({ min: 0, max: 32 })
  .optional()

const bodyUrl = body("url").trim().isURL()

const paramId = param("id").isInt()

const queryTags = query("*")
  .trim()
  .toLowerCase()
  .whitelist("abcdefghijklmnopqrstuvwxyz")
  .isString()
  .notEmpty()
  .isLength({ min: 0, max: 32 })
  .optional()

export const serializers = {
  auth: {
    post: [bodyEmail, bodyUserName, bodyPassword, serializationErrorMiddleware],
    put: [
      bodyNewEmail,
      bodyNewUserName,
      bodyNewPassword,
      bodyPassword,
      serializationErrorMiddleware,
    ],
    delete: [bodyPassword, serializationErrorMiddleware],
    login: {
      post: [bodyEmail, bodyPassword, serializationErrorMiddleware],
    },
  },
  recipe: {
    middleware: {
      canAlterRecipe: [paramId, serializationErrorMiddleware],
    },
    get: [queryTags, serializationErrorMiddleware],
    post: [
      bodyText,
      bodyTitle,
      bodySourceSite,
      bodySourceUrl,
      bodyTags,
      serializationErrorMiddleware,
    ],
    fork: {
      id: {
        post: [paramId, serializationErrorMiddleware],
      },
    },
    id: {
      get: [paramId, serializationErrorMiddleware],
      put: [
        paramId,
        bodyNewText,
        bodyNewTitle,
        bodyTags,
        serializationErrorMiddleware,
      ],
      delete: [paramId, serializationErrorMiddleware],
    },
  },
  scrape: {
    post: [bodyUrl, serializationErrorMiddleware],
  },
  user: {
    id: {
      get: [paramId, serializationErrorMiddleware],
    },
  },
}
