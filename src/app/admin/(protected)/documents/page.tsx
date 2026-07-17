import { redirect } from 'next/navigation'

import { clearAdminTokenCookie, requireAdminSectionToken } from '@/shared/admin/auth'
import { isAdminApiErrorStatus, isAdminApiTransportError } from '@/shared/admin/api-error'
import { getAdminDocuments } from '@/shared/api/adapters/admin-documents.adapter'
import AdminBackendUnavailable from '@/widgets/admin/AdminBackendUnavailable/AdminBackendUnavailable'
import AdminDocumentsPanel from '@/widgets/admin/AdminDocumentsPanel/AdminDocumentsPanel.client'
import cls from '@/widgets/admin/AdminShell/AdminShell.module.scss'
import { DOCUMENT_GROUP_IDS, DOCUMENT_PLACEMENT_GROUPS } from '@/shared/documents/document-placement-registry'

const SECTION_KEY = 'gia-9.normative-documents'

export default async function Page() {
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
  const sectionKey = DOCUMENT_PLACEMENT_GROUPS.find((group) => allowedGroupIds.includes(group.id))?.items[0]?.key ?? SECTION_KEY
  let documents
  try {
    documents = await getAdminDocuments(token, { placementKey: sectionKey })
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

  return <AdminDocumentsPanel initialDocuments={documents.items} sectionKey={sectionKey} allowedGroupIds={allowedGroupIds} />
}
