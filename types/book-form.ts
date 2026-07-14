export type BookFormValues = {
  title: string;
  author: string;
  published_year: string;
  categories: string[];
  series_number: string;
};

export type BookFormErrors = Partial<
  Record<keyof BookFormValues, string>
> & {
  form?: string;
};

export type BookFormState = {
  values: BookFormValues;
  errors: BookFormErrors;
};