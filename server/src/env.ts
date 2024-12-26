const getEnvVar = (varName: string) => {
  const val = process.env[varName]
  if (val === undefined) {
    throw new Error(`Environment variable: (${varName}) required`)
  }
  return val
}

export const ENVS = {
  LOCAL: "local",
  TEST: "test",
  PROD: "prod",
} as const

export const ENV = getEnvVar("ENV") as (typeof ENVS)[keyof typeof ENVS]
export const PORT = Number(getEnvVar("PORT"))
export const SESSION_SECRET = getEnvVar("SESSION_SECRET")

export const DB_HOST = getEnvVar("DB_HOST")
export const DB_PORT = Number(getEnvVar("DB_PORT"))
export const DB_DATABASE = getEnvVar("DB_DATABASE")
export const DB_USERNAME = getEnvVar("DB_USERNAME")
export const DB_PASSWORD = getEnvVar("DB_PASSWORD")
