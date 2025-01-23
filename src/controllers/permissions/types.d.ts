import { RoleAttributes } from "@models/roles/types";

type OptionalStringify<T> = {
  [K in keyof T]?: string;
};

export interface GetPermissionsQuery {
  limit: string;
  page: string;
  offset: string;
  search: OptionalStringify<RoleAttributes>;
}

export interface GetPermissionQuery {
  fields: string;
}

export interface GetPermissionParams {
  id: number;
}

export interface CreatePermissionBody {
  name: string;
  description: string;
  code?: string;
}
