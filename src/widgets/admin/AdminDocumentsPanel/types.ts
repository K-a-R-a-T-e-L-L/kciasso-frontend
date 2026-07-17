import type { DocumentDto, DocumentVersionDto } from "@/shared/api/generated/types";

export type EditableStatus = "DRAFT" | "PUBLISHED";

export type FormState = {
  title: string;
  description: string;
  documentNumber: string;
  documentDate: string;
};

export const emptyForm: FormState = {
  title: "",
  description: "",
  documentNumber: "",
  documentDate: "",
};

export type PanelMessage = {
  type: "success" | "error";
  text: string;
} | null;

export type PanelDocument = DocumentDto;
export type PanelVersion = DocumentVersionDto;
