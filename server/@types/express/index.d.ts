import { AuthUser } from '../'

declare global {
  namespace Express {
    interface User extends AuthUser { }
  }
}
