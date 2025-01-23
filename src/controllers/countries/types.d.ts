export interface GetCountriesQuery {
  limit: string;
  page: string;
  offset: string;
  fields: string;
  states: string;
}

export interface GetUserQuery {
  fields: string;
  states: string;
}

export interface GetUserParams {
  id: number;
}

export interface CreateUserBody {
  name: string;
  description: string;
  code?: string;
}

export interface SetStateToCountryBody {
  states: Array<{ id: number }>;
}
