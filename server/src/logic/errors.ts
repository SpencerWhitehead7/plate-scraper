type ExtendedErrorConstructor = new (error: Error) => Error

const createExtendedError = (
  name: string,
  statusCode: number,
): ExtendedErrorConstructor =>
  class extends Error {
    statusCode: number
    constructor(error: Error) {
      super(error.message)

      this.name = name
      this.stack = error.stack
      this.statusCode = statusCode
    }
  }

export const SerializationError = createExtendedError("SerializationErr", 400)

const NotAuthenticatedErr = createExtendedError("NotAuthenticatedErr", 401)
export const incorrectCredsErr = new NotAuthenticatedErr(
  Error("incorrect credentials"),
)
export const notLoggedInErr = new NotAuthenticatedErr(Error("not logged in"))

const AlreadyAuthenticatedErr = createExtendedError(
  "AlreadyAuthenticatedErr",
  409,
)
export const alreadyLoggedInErr = new AlreadyAuthenticatedErr(
  Error("already logged in"),
)

const NotAuthorizedErr = createExtendedError("NotAuthorizedErr", 403)
export const permDeniedErr = new NotAuthorizedErr(Error("permission denied"))

const NotFoundErr = createExtendedError("NotFoundErr", 404)
export const notFoundRecipeErr = new NotFoundErr(Error("recipe not found"))
export const notFoundRouteErr = new NotFoundErr(Error("route not found"))
export const notFoundUserErr = new NotFoundErr(Error("user not found"))

const ScrapeSiteInvalidErr = createExtendedError("ScrapeSiteInvalidErr", 400)
export const scrapeSiteInvalidErr = new ScrapeSiteInvalidErr(
  Error("site invalid"),
)

const ScrapeFailedErr = createExtendedError("ScrapeFailedErr", 500)
export const scrapeFailedErr = new ScrapeFailedErr(Error("scrape failed"))
