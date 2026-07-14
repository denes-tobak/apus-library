insert into public.books (
    title,
    author,
    published_year,
    categories,
    series_number
)
values
(
    'The Hobbit',
    'J.R.R. Tolkien',
    1937,
array['Fantasy', 'Adventure'],
    1
),
(
    'Dune',
    'Frank Herbert',
    1965,
    ARRAY['Science Fiction'],
    1
),
(
    '1984',
    'George Orwell',
    1949,
    ARRAY['Dystopian'],
    0
),
(
    'The Name of the Wind',
    'Patrick Rothfuss',
    2007,
    ARRAY['Fantasy'],
    1
),
(
    'The Way of Kings',
    'Brandon Sanderson',
    2010,
    ARRAY['Fantasy'],
    1
);