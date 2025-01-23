import { ApiController } from "@controllers/ApiController";
import User from "@models/users";
import { ObjectSchema } from "joi";
import { createUserSchema, updateUserSchema } from "./schema";

class UsersController extends ApiController<User> {
  protected model = User;
  protected entity = "Users";
  protected createSchema = createUserSchema;
  protected updateSchema = updateUserSchema;
}

export default new UsersController();
