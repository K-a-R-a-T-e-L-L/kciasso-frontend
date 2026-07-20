export type ServerCoverMutationInput = {
  kind: "set" | "remove" | "unchanged";
  url?: string;
  source?: "owned" | "external";
  key?: string;
};

export function assertNoBinaryInActionFormData(formData: FormData) {
  for (const [key, value] of formData.entries()) {
    if (typeof value !== "string") throw new Error(`Binary value is forbidden in Server Action: ${key}`);
  }
}

export function buildNewsActionFormData(form: HTMLFormElement, cover: ServerCoverMutationInput) {
  const prepared = new FormData(form);
  for (const key of ["coverImageFile", "coverMode", "coverImageUrl", "coverImageSource", "pendingOwnedMediaKey", "removeCover"]) prepared.delete(key);
  prepared.set("coverMutationKind", cover.kind);
  if (cover.kind === "set") {
    prepared.set("coverImageUrl", cover.url ?? "");
    prepared.set("coverImageSource", cover.source ?? "");
    prepared.set("pendingOwnedMediaKey", cover.key ?? "");
  }
  assertNoBinaryInActionFormData(prepared);
  return prepared;
}
