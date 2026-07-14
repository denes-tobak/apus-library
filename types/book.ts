export type Book = {
  id: number;
  title: string;
  author: string;
  published_year: number | null;
  category: string | null;
  series_number: number | null;
  created_at: string;
  updated_at: string;
};