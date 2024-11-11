import { RequestHandler } from "express"
import { AnyZodObject, z, ZodError, ZodRecord } from "zod"

import { SerializationError } from "./errors"

export const validate = <
  P extends AnyZodObject,
  B extends AnyZodObject,
  Q extends AnyZodObject | ZodRecord,
>(
  schema: {
    params?: P
    body?: B
    query?: Q
  } = {},
): RequestHandler<z.infer<P>, unknown, z.infer<B>, z.infer<Q>> => {
  const fullSchema = z.object({
    params: z.object({}),
    body: z.object({}),
    query: z.record(z.string(), z.unknown()),
    ...schema,
  })

  return async (req, res, next) => {
    try {
      const validatedReq = await fullSchema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })
      // @ts-expect-error typescript HATES it, but it should be valid
      req.body = validatedReq.body
      // @ts-expect-error typescript HATES it, but it should be valid
      req.query = validatedReq.query
      // @ts-expect-error typescript HATES it, but it should be valid
      req.params = validatedReq.params
      next()
    } catch (err) {
      next(new SerializationError(err as ZodError))
    }
  }
}
