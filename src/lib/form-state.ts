// The shape every form action returns to its form.
export type FormState = {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  // Text to put back into the form after an error (never passwords).
  values?: Record<string, string>;
};
