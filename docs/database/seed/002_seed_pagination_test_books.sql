begin;

with generated_books as (
  select
    format(
      'Pagination Test Book %s',
      lpad(book_number::text, 2, '0')
    ) as title,

    format(
      'Test Author %s',
      lpad((((book_number - 1) % 12) + 1)::text, 2, '0')
    ) as author,

    1975 + ((book_number * 7) % 50) as published_year,

    case book_number % 11
      when 0 then array[]::text[]
      when 1 then array['Fantasy', 'Adventure']::text[]
      when 2 then array['Science Fiction', 'Adventure']::text[]
      when 3 then array['Mystery', 'Thriller']::text[]
      when 4 then array['History', 'Non-fiction']::text[]
      when 5 then array['Classics']::text[]
      when 6 then array['Children''s', 'Adventure']::text[]
      when 7 then array['Romance', 'Historical Fiction']::text[]
      when 8 then array['Horror']::text[]
      when 9 then array['Philosophy', 'Non-fiction']::text[]
      when 10 then array['Young Adult', 'Fantasy']::text[]
    end as categories,

    case
      when book_number % 5 in (0, 1)
        then ((book_number - 1) % 4) + 1
      else null
    end as series_number,

    now() - ((50 - book_number)::text || ' minutes')::interval
      as created_at

  from generate_series(1, 50) as book_number
)

insert into public.books (
  title,
  author,
  published_year,
  categories,
  series_number,
  created_at,
  updated_at
)
select
  generated_book.title,
  generated_book.author,
  generated_book.published_year,
  generated_book.categories,
  generated_book.series_number,
  generated_book.created_at,
  generated_book.created_at
from generated_books as generated_book
where not exists (
  select 1
  from public.books as existing_book
  where existing_book.title = generated_book.title
    and existing_book.author = generated_book.author
);

commit;