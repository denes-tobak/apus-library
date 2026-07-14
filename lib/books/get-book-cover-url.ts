const BOOK_COVERS_BUCKET = "book-covers";

export function getBookCoverUrl(
  coverPath: string | null | undefined,
) {
  if (!coverPath) {
    return null;
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(
      /\/$/,
      "",
    );

  if (!supabaseUrl) {
    return null;
  }

  const encodedPath = coverPath
    .split("/")
    .map(encodeURIComponent)
    .join("/");

  return `${supabaseUrl}/storage/v1/object/public/${BOOK_COVERS_BUCKET}/${encodedPath}`;
}