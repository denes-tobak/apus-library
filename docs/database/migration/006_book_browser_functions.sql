begin;

create or replace function public.search_books(
  p_search text default null,
  p_categories text[] default array[]::text[],
  p_include_uncategorized boolean default false
)
returns setof public.books
language sql
stable
security invoker
set search_path = ''
as $$
  select book.*
  from public.books as book
  where
    (
      nullif(btrim(p_search), '') is null
      or book.title ilike '%' || btrim(p_search) || '%'
      or book.author ilike '%' || btrim(p_search) || '%'
      or exists (
        select 1
        from unnest(book.categories) as category
        where category ilike '%' || btrim(p_search) || '%'
      )
    )
    and
    (
      (
        coalesce(cardinality(p_categories), 0) = 0
        and not p_include_uncategorized
      )
      or book.categories && p_categories
      or (
        p_include_uncategorized
        and cardinality(book.categories) = 0
      )
    );
$$;

grant execute
on function public.search_books(text, text[], boolean)
to authenticated;

create or replace function public.get_library_categories()
returns table (
  category text,
  book_count bigint
)
language sql
stable
security invoker
set search_path = ''
as $$
  with expanded_categories as (
    select
      book.id,
      btrim(category_value) as category
    from public.books as book
    cross join lateral unnest(book.categories) as category_value
    where btrim(category_value) <> ''
  ),
  category_counts as (
    select
      min(category) as category,
      count(distinct id)::bigint as book_count
    from expanded_categories
    group by lower(category)
  ),
  uncategorized_count as (
    select
      null::text as category,
      count(*)::bigint as book_count
    from public.books
    where cardinality(categories) = 0
    having count(*) > 0
  )
  select result.category, result.book_count
  from (
    select category, book_count
    from category_counts

    union all

    select category, book_count
    from uncategorized_count
  ) as result
  order by lower(result.category) nulls last;
$$;

grant execute
on function public.get_library_categories()
to authenticated;

commit;