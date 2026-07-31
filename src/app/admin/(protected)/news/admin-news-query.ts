import {
  adminNewsControllerGetNewsQueryParamsSortEnum,
  adminNewsControllerGetNewsQueryParamsStatusEnum,
  type AdminNewsControllerGetNewsQueryParams,
  type AdminNewsControllerGetNewsQueryParamsSortEnumKey,
  type AdminNewsControllerGetNewsQueryParamsStatusEnumKey,
} from "@/shared/api/generated/types";

export type AdminNewsUrlStatus = "all" | AdminNewsControllerGetNewsQueryParamsStatusEnumKey;
export type AdminNewsUrlQuery = {
  page: number;
  limit: 10 | 20 | 50 | 100;
  search?: string;
  status: AdminNewsUrlStatus;
  category?: string;
  sort: AdminNewsControllerGetNewsQueryParamsSortEnumKey;
};

type RawSearchParams = Record<string, string | string[] | undefined>;

const limits = new Set([10, 20, 50, 100]);
const statuses = new Set<string>(Object.values(adminNewsControllerGetNewsQueryParamsStatusEnum));
const sorts = new Set<string>(Object.values(adminNewsControllerGetNewsQueryParamsSortEnum));

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseAdminNewsQuery(raw: RawSearchParams): AdminNewsUrlQuery {
  const pageValue = Number(one(raw.page));
  const limitValue = Number(one(raw.limit));
  const statusValue = one(raw.status);
  const sortValue = one(raw.sort);
  const search = one(raw.search)?.trim();
  const category = one(raw.category)?.trim();
  return {
    page: Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1,
    limit: (limits.has(limitValue) ? limitValue : 20) as AdminNewsUrlQuery["limit"],
    ...(search ? { search } : {}),
    status: statusValue && statuses.has(statusValue)
      ? statusValue as AdminNewsControllerGetNewsQueryParamsStatusEnumKey
      : "all",
    ...(category ? { category } : {}),
    sort: sortValue && sorts.has(sortValue)
      ? sortValue as AdminNewsControllerGetNewsQueryParamsSortEnumKey
      : adminNewsControllerGetNewsQueryParamsSortEnum.newest,
  };
}

export function adminNewsRequest(query: AdminNewsUrlQuery): AdminNewsControllerGetNewsQueryParams {
  return {
    page: query.page,
    limit: query.limit,
    ...(query.search ? { search: query.search } : {}),
    ...(query.status === "all" ? {} : { status: query.status }),
    ...(query.category ? { category: query.category } : {}),
    sort: query.sort,
  };
}

export function adminNewsHref(
  current: AdminNewsUrlQuery,
  patch: Partial<AdminNewsUrlQuery>,
  resetPage = false,
) {
  const next = { ...current, ...patch, ...(resetPage ? { page: 1 } : {}) };
  const params = new URLSearchParams();
  params.set("page", String(next.page));
  params.set("limit", String(next.limit));
  if (next.search) params.set("search", next.search);
  params.set("status", next.status);
  if (next.category) params.set("category", next.category);
  params.set("sort", next.sort);
  return `/admin/news?${params.toString()}`;
}
