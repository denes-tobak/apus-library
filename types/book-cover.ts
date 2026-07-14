export type BookCoverState = {
  error: string | null;
  success: string | null;
};

export const initialBookCoverState: BookCoverState = {
  error: null,
  success: null,
};