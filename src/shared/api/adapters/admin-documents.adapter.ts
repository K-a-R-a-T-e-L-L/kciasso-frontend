import {
  documentsControllerGet,
  documentsControllerList,
  documentsControllerVersions,
} from '@/shared/api/generated/clients'
import type {
  DocumentsControllerListQueryParams,
  DocumentDto,
  DocumentVersionDto,
  PaginatedDocumentsDto,
} from '@/shared/api/generated/types'
import { toAdminApiError } from '@/shared/admin/api-error'

function buildAdminConfig(token: string) {
  return {
    headers: { Authorization: `Bearer ${token}` },
    skipAuthRedirect: true,
  } as const
}

export async function getAdminDocuments(
  token: string,
  params: DocumentsControllerListQueryParams,
): Promise<PaginatedDocumentsDto> {
  try {
    return await documentsControllerList(params, buildAdminConfig(token))
  } catch (error) {
    throw toAdminApiError(error)
  }
}

export async function getAdminDocument(token: string, id: number): Promise<DocumentDto> {
  try {
    return await documentsControllerGet(id, buildAdminConfig(token))
  } catch (error) {
    throw toAdminApiError(error)
  }
}

export async function getAdminDocumentVersions(token: string, id: number): Promise<DocumentVersionDto[]> {
  try {
    return await documentsControllerVersions(id, buildAdminConfig(token))
  } catch (error) {
    throw toAdminApiError(error)
  }
}
