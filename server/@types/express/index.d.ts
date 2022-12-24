import { AuthUser } from '../'

declare global {
  namespace Express {
    // ask me not why, but it refuses to compile with this idiomatic TS but does not with the empty interface extension
    // type User = AuthUser
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends AuthUser { }
  }
}
