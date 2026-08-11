export type AdminCategoryFormState = {
  error: string | null;
  success?: boolean;
};

export const adminCategoryFormInitialState: AdminCategoryFormState = {
  error: null,
  success: false,
};
