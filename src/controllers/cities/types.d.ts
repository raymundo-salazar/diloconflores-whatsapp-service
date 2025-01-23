export interface GetUsersQuery {
  limit: string;
  page: string;
  offset: string;
}

export interface GetUserQuery {
  fields: string;
}

export interface GetUserParams {
  id: number;
}

export interface CreateUserBody {
  name: string;
  description: string;
  code?: string;
}
