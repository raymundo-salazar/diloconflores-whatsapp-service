export interface GetRolesQuery {
  limit: string;
  page: string;
  offset: string;
  permissions: string;
}

export interface GetRoleParams {
  id: number;
}

export interface GetRoleQuery {
  fields: string;
  permissions: string;
}
