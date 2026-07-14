begin;

alter table public.books
rename column category to categories;

alter table public.books
alter column categories type text[]
using (
  case
    when categories is null or btrim(categories) = ''
      then array[]::text[]
    else array[categories]
  end
);

alter table public.books
alter column categories
set default array[]::text[];

alter table public.books
alter column categories
set not null;

commit;