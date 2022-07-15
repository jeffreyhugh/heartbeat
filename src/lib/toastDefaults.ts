export const toastDefaults = {
  loading: 'Working on it...',
  success: 'Success!',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: (err: any) =>
    err?.response?.data?.message ?? 'Something went wrong, please try again',
};
