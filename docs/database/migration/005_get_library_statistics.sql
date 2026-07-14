create or replace function public.get_library_statistics()
returns table (
  total_books bigint,
  unique_authors bigint,
  total_categories bigint,
  uncategorized_books bigint
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    count(*) as total_books,

    count(
      distinct lower(btrim(book.author))
    ) as unique_authors,

    (
      select count(
        distinct lower(btrim(category))
      )
      from public.books as category_book
      cross join lateral
        unnest(category_book.categories) as category
      where btrim(category) <> ''
    ) as total_categories,

    count(*) filter (
      where cardinality(book.categories) = 0
    ) as uncategorized_books

  from public.books as book;
$$;

grant execute
on function public.get_library_statistics()
to authenticated;