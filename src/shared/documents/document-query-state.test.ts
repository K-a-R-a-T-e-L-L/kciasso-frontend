import { describe, expect, it } from 'vitest'
import { parseAdminDocumentQuery, serializeAdminDocumentQuery } from './document-query-state'

describe('admin document query state', () => {
  it('uses placement ordering for an exact placement and preserves safe pagination values', () => {
    const state = parseAdminDocumentQuery({ placement: 'gia-9.results', page: '3', pageSize: '50' }, { mode: 'placement' } as never)
    expect(state).toMatchObject({ placement: 'gia-9.results', page: 3, pageSize: 50, sortBy: 'placementOrder', sortDirection: 'asc' })
  })
  it('serializes only canonical non-default URL values', () => {
    expect(serializeAdminDocumentQuery({ search: '  law ', status: 'PUBLISHED', page: 2, pageSize: 50, sortBy: 'title', sortDirection: 'asc' })).toBe('search=law&status=PUBLISHED&sortBy=title&sortDirection=asc&page=2&pageSize=50')
  })
})
