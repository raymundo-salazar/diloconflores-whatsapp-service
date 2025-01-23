import { InfoFn, OffsetFn, PagesFn, TotalFn } from "./types";

export const calculateOffset: OffsetFn = (
  limitStr: string = "50",
  pageStr: string = "1",
  offsetStr: string = "0"
) => {
  const limit: number = parseInt(limitStr);
  const page = parseInt(pageStr);
  let offset: number = parseInt(offsetStr) ?? 0;

  if (page) offset = (page - 1) * limit;

  return {
    limit,
    page,
    offset,
  };
};

export const calculatePages: PagesFn = (
  page: number,
  records: number,
  limit: number
) => {
  return {
    current: page,
    totalPages: Math.ceil(records / limit),
  };
};

export const calculateTotal: TotalFn = (
  records: number,
  totalRecords: number,
  offset: number
) => {
  return {
    total: totalRecords,
    show: records,
    from: records == 0 ? 0 : offset + 1,
    to: offset + records,
  };
};

export const processInfo: InfoFn = (
  page: number,
  records: number,
  totalRecords: number,
  limit: number,
  offset: number
) => {
  return {
    totals: calculateTotal(records, totalRecords, offset),
    pages: calculatePages(page, totalRecords, limit),
  };
};
