import Image from "next/image";

import { getBookCoverUrl } from "@/lib/books/get-book-cover-url";

type BookCoverProps = {
  title: string;
  author: string;
  coverPath: string | null;
  variant: "card" | "details";
};

export function BookCover({
  title,
  author,
  coverPath,
  variant,
}: BookCoverProps) {
  const coverUrl = getBookCoverUrl(coverPath);

  const titleInitial =
    title.trim().charAt(0).toUpperCase() || "A";

  if (variant === "card") {
    return (
      <div className="relative aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-r-xl rounded-l-sm border border-amber-950/10 bg-gradient-to-br from-amber-100 via-amber-50 to-stone-200 shadow-sm">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt=""
            fill
            sizes="64px"
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <>
            <div className="absolute inset-y-0 left-0 w-1.5 border-r border-amber-950/20 bg-amber-900/20" />

            <div className="flex h-full items-center justify-center px-2 text-center">
              <span className="font-serif text-xl font-semibold text-amber-950">
                {titleInitial}
              </span>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-r-2xl rounded-l-md border border-amber-100/20 bg-gradient-to-br from-amber-100 via-amber-50 to-stone-200 shadow-[16px_22px_45px_-18px_rgba(0,0,0,0.75)]">
      {coverUrl ? (
        <Image
          src={coverUrl}
          alt=""
          fill
          sizes="210px"
          className="object-cover"
        />
      ) : (
        <>
          <div className="absolute inset-y-0 left-0 w-4 border-r border-amber-950/20 bg-amber-900/20" />

          <div className="absolute inset-x-6 top-7 h-px bg-amber-950/20" />
          <div className="absolute inset-x-6 bottom-7 h-px bg-amber-950/20" />

          <div className="flex h-full flex-col items-center justify-center px-8 text-center text-stone-900">
            <div className="flex size-16 items-center justify-center rounded-full border border-amber-950/20 bg-white/50 font-serif text-3xl font-semibold shadow-sm">
              {titleInitial}
            </div>

            <p className="mt-6 line-clamp-3 font-serif text-xl font-semibold leading-tight">
              {title}
            </p>

            <p className="mt-3 line-clamp-2 text-sm text-stone-600">
              {author}
            </p>
          </div>
        </>
      )}
    </div>
  );
}