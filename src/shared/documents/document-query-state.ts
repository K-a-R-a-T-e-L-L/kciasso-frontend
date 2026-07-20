import type { DocumentsPageContext } from './document-placement-registry'

export type AdminDocumentQueryState = {
  scope?: string
  group?: string
  placement?: string
  search?: string
  status?: string
  sortBy: string
  sortDirection: string
  page: number
  pageSize: number
}

export function parseAdminDocumentQuery(input: Record<string, string | undefined>, context?: DocumentsPageContext): AdminDocumentQueryState {
  const exact = context?.mode === 'placement'
  const sortBy = input.sortBy || (exact ? 'placementOrder' : 'updatedAt')
  const sortDirection = input.sortDirection || (exact ? 'asc' : 'desc')
  const pageSize = [20, 50, 100].includes(Number(input.pageSize)) ? Number(input.pageSize) : 20
  return {
    scope: input.scope,
    group: input.group,
    placement: input.placement || input.sectionKey,
    search: input.search?.trim() || undefined,
    status: input.status,
    sortBy,
    sortDirection,
    page: Math.max(1, Number(input.page) || 1),
    pageSize,
  }
}

export function serializeAdminDocumentQuery(state: Partial<AdminDocumentQueryState>): string {
  const params = new URLSearchParams()
  for (const key of ['scope', 'group', 'placement', 'search', 'status', 'sortBy', 'sortDirection'] as const) {
    const value = state[key]
    if (value) params.set(key, key === 'search' ? value.trim() : value)
  }
  if (state.page && state.page > 1) params.set('page', String(state.page))
  if (state.pageSize && state.pageSize !== 20) params.set('pageSize', String(state.pageSize))
  return params.toString()
}
