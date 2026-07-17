export async function openDocumentFile(documentId: number, versionId: number, filename: string) {
  const response = await fetch(`/api/admin/documents/${documentId}/versions/${versionId}/file`, {
    credentials: 'same-origin',
  })
  if (!response.ok) {
    const payload = await response.json().catch(() => null)
    throw new Error(typeof payload?.description === 'string' ? payload.description : 'Не удалось открыть файл.')
  }
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
