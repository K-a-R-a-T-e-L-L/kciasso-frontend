export type AdminUserFormState = {
  error: string | null;
  success?: boolean;
};

export const adminUserFormInitialState: AdminUserFormState = {
  error: null,
  success: false,
};
