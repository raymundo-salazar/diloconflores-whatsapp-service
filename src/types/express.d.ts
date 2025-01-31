import { UserAttributes } from "@models/users";
import { SessionAttributes } from "@models/session";

declare global {
  namespace Express {
    interface Request {
      user?: UserAttributes;
      session?: SessionAttributes;
    }
  }
}

export {};
