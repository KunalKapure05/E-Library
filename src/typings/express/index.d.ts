import { UserType } from "../../Interfaces/UserType";   

declare global {
  namespace Express {
    interface User extends UserType{}
  }
}