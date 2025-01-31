import { ActionTypeAttributes } from "@models/actionTypes/types";
import { EntityTypeAttributes } from "@models/entitieTypes/types";
import { SessionAttributes } from "@models/sessions/types";
import { UserAttributes } from "@models/users/types";

export interface ActivityLogAttributes {
  id: number;
  uuid: string;
  user_id?: number;
  user?: UserAttributes;
  action_type_id: number;
  actionType?: ActionTypeAttributes;
  entity_type_id: number;
  entityType?: EntityTypeAttributes;
  entity_id: number;
  entity?: any;
  headers: string;
  path: string;
  method: string;
  params: string;
  body: string;
  response: string;
  status: number;
  session_id: number;
  session?: SessionAttributes;
  created_at: Date;
  finished_at: Date;
}

export interface ActivityLogCreationAttributes
  extends Optional<ActivityLogAttributes, "id" | "uuid" | "created_at" | "finished_at"> {}
