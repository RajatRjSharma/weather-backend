export interface PaginationParams {
  page?: number; // current page number (1-based)
  limit?: number; // number of items per page
}

export interface PaginationResult<T> {
  total: number; // total number of items ignoring pagination
  page: number; // current page number
  limit: number; // items per page
  data: T[]; // paginated data
}

export const paginate = async <T>(
  model: any,
  where: object,
  { page = 1, limit = 10 }: PaginationParams
): Promise<PaginationResult<T>> => {
  const skip = (page - 1) * limit;

  const [total, data] = await Promise.all([
    model.count({ where }),
    model.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    total,
    page,
    limit,
    data,
  };
};
