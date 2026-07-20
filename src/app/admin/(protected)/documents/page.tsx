import { redirect } from 'next/navigation'

import { clearAdminTokenCookie, requireAdminSectionToken } from '@/shared/admin/auth'
import { isAdminApiErrorStatus, isAdminApiTransportError } from '@/shared/admin/api-error'
import { getAdminDocuments } from '@/shared/api/adapters/admin-documents.adapter'
import AdminBackendUnavailable from '@/widgets/admin/AdminBackendUnavailable/AdminBackendUnavailable'
import AdminDocumentsPanel from '@/widgets/admin/AdminDocumentsPanel/AdminDocumentsPanel.client'
import cls from '@/widgets/admin/AdminShell/AdminShell.module.scss'
import { DOCUMENT_GROUP_IDS, DOCUMENT_PLACEMENT_GROUPS, resolveDocumentPageContext } from '@/shared/documents/document-placement-registry'
import { parseAdminDocumentQuery } from '@/shared/documents/document-query-state'

type Props = {
  searchParams: Promise<{
    scope?: string
    group?: string
    placement?: string
    sectionKey?: string
    search?: string
    status?: string
    sortBy?: string
    sortDirection?: string
    page?: string
    pageSize?: string
  }>
}

export default async function Page({ searchParams }: Props) {
  let token: string
  let admin
  try {
    const auth = await requireAdminSectionToken('documents')
    token = auth.token
    admin = auth.user
  } catch (error) {
    if (isAdminApiTransportError(error)) {
      return <main className={cls.page}><AdminBackendUnavailable retryHref="/admin/documents" /></main>
    }
    throw error
  }

  const allowedGroupIds = admin.role === 'SUPER_ADMIN' || admin.documentsAccessMode === 'ALL'
    ? DOCUMENT_PLACEMENT_GROUPS.map((group) => group.id)
    : admin.documentGroups.map((group) => DOCUMENT_GROUP_IDS[group])
  const params = await searchParams
  const pageContext = resolveDocumentPageContext({
    scope: params.scope,
    group: params.group,
    placement: params.placement ?? params.sectionKey,
    allowedGroupIds,
    canSeeAll: admin.role === 'SUPER_ADMIN' || admin.documentsAccessMode === 'ALL',
  })
  const queryState = parseAdminDocumentQuery(params, pageContext)
  const groupEnum = params.group ? ({ 'gia-9': 'GIA_9', 'gia-11': 'GIA_11', gia: 'GIA', quality: 'QUALITY', regional: 'REGIONAL', about: 'ABOUT' } as Record<string, string>)[params.group] : undefined
  let documents
  try {
    documents = await getAdminDocuments(token, {
      ...(queryState.placement ? { placementKey: queryState.placement } : {}),
      ...(groupEnum ? { group: groupEnum } : {}),
      ...(queryState.search ? { search: queryState.search } : {}),
      ...(queryState.status ? { status: queryState.status } : {}),
      sortBy: queryState.sortBy,
      sortDirection: queryState.sortDirection,
      page: queryState.page,
      pageSize: queryState.pageSize,
    } as never)
  } catch (error) {
    if (isAdminApiErrorStatus(error, 401)) {
      await clearAdminTokenCookie()
      redirect('/admin/login')
    }
    if (isAdminApiErrorStatus(error, 403)) redirect('/admin/forbidden')
    if (isAdminApiTransportError(error)) {
      return <main className={cls.page}><AdminBackendUnavailable retryHref="/admin/documents" /></main>
    }
    throw error
  }

  return <AdminDocumentsPanel initialDocuments={documents.items} sectionKey={pageContext.queryPlacementKey} allowedGroupIds={allowedGroupIds} canSeeAll={admin.role === 'SUPER_ADMIN' || admin.documentsAccessMode === 'ALL'} pageContext={pageContext} query={queryState} pagination={documents.meta} />
}
