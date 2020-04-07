const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  } else {
    const err = new Error(`Not logged in`)
    err.status = 401
    next(err)
  }
}

const isAlreadyAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    const err = new Error(`Already logged in to an account`)
    err.status = 409
    next(err)
  } else {
    next()
  }
}

module.exports = {
  isAuthenticated,
  isAlreadyAuthenticated,
}
