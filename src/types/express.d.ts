import { UserAttributes } from "@models/users";
import { SessionAttributes } from "@models/session";
import { Client } from "whatsapp-web.js";

declare global {
  namespace Express {
    interface Request {
      user?: UserAttributes;
      session?: SessionAttributes;
      whatsapp?: Record<string, Client>;
    }
  }
}

export {};
