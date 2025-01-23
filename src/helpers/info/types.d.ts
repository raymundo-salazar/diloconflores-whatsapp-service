export interface OffsetResponse {
  limit: number;
  page: number;
  offset: number;
}

export type OffsetFn = (
  limitStr: string,
  pageStr: string,
  offsetStr: string
) => OffsetResponse;

export interface PagesResponse {
  current: number;
  totalPages: number;
}

export type PagesFn = (
  page: number,
  records: number,
  limit: number
) => PagesResponse;

export interface TotalResponse {
  show: number;
  total: number;
  from: number;
  to: number;
}

export type TotalFn = (
  records: number,
  totalRecords: number,
  offset: number
) => TotalResponse;

export interface InfoResponse {
  totals: Total;
  pages: Pages;
}

export type InfoFn = (
  page: number,
  records: number,
  totalRecords: number,
  limit: number,
  offset: number
) => InfoResponse;
