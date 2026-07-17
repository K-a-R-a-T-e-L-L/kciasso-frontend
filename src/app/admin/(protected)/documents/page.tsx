import { redirect } from 'next/navigation'

import { clearAdminTokenCookie, requireAdminSectionToken } from '@/shared/admin/auth'
import { isAdminApiErrorStatus, isAdminApiTransportError } from '@/shared/admin/api-error'
import { getAdminDocuments } from '@/shared/api/adapters/admin-documents.adapter'
import AdminBackendUnavailable from '@/widgets/admin/AdminBackendUnavailable/AdminBackendUnavailable'
import AdminDocumentsPanel from '@/widgets/admin/AdminDocumentsPanel/AdminDocumentsPanel.client'
import cls from '@/widgets/admin/AdminShell/AdminShell.module.scss'

const SECTION_KEY = 'gia-9.normative-documents'

export default async function Page() {
  let token: string
  try {
    token = (await requireAdminSectionToken('documents')).token
  } catch (error) {
    if (isAdminApiTransportError(error)) {
      return <main className={cls.page}><AdminBackendUnavailable retryHref="/admin/documents" /></main>
    }
    throw error
  }

  let documents
  try {
    documents = await getAdminDocuments(token, { placementKey: SECTION_KEY })
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

  return <AdminDocumentsPanel initialDocuments={documents.items} sectionKey={SECTION_KEY} />
}
