"use client";

import { Search } from "lucide-react";

type BookSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function BookSearch({ value, onChange }: BookSearchProps) {
  return (
    <div className="relative">
      <Search
        aria-hidden="true"
        className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
      />

      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by title, author or category..."
        aria-label="Search books"
        className="h-11 w-full rounded-md border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}