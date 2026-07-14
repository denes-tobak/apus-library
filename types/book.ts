export type Book = {
  id: number;
  title: string;
  author: string;
  published_year: number | null;
  categories: string[];
  series_number: number | null;
  cover_path: string | null;
  created_at: string;
  updated_at: string;
};