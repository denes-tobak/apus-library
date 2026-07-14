"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";

import { createClient } from "@/lib/supabase/server";
import type { BookCoverState } from "@/types/book-cover";

const BOOK_COVERS_BUCKET = "book-covers";
const MAX_COVER_SIZE = 3 * 1024 * 1024;

const FILE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function revalidateBookPages(bookId: number) {
  revalidatePath("/dashboard");
  revalidatePath("/books");
  revalidatePath(`/books/${bookId}`);
  revalidatePath(`/books/${bookId}/edit`);
}

export async function uploadBookCover(
  bookId: number,
  _previousState: BookCoverState,
  formData: FormData,
): Promise<BookCoverState> {
  const t = await getTranslations("BookCover");

  if (!Number.isInteger(bookId) || bookId < 1) {
    return {
      error: t("errors.bookNotIdentified"),
      success: null,
    };
  }

  const file = formData.get("cover");

  if (!(file instanceof File) || file.size === 0) {
    return {
      error: t("errors.fileRequired"),
      success: null,
    };
  }

  const extension = FILE_EXTENSIONS[file.type];

  if (!extension) {
    return {
      error: t("errors.invalidFileType"),
      success: null,
    };
  }

  if (file.size > MAX_COVER_SIZE) {
    return {
      error: t("errors.fileTooLarge"),
      success: null,
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      error: t("errors.sessionExpired"),
      success: null,
    };
  }

  const { data: book, error: bookError } =
    await supabase
      .from("books")
      .select("id, cover_path")
      .eq("id", bookId)
      .maybeSingle();

  if (bookError) {
    console.error(
      "Failed to load book before cover upload:",
      bookError,
    );

    return {
      error: t("errors.bookLoadFailed"),
      success: null,
    };
  }

  if (!book) {
    return {
      error: t("errors.bookMissing"),
      success: null,
    };
  }

  const newCoverPath =
    `${bookId}/${crypto.randomUUID()}.${extension}`;

  const fileBuffer = Buffer.from(
    await file.arrayBuffer(),
  );

  const { error: uploadError } =
    await supabase.storage
      .from(BOOK_COVERS_BUCKET)
      .upload(newCoverPath, fileBuffer, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });

  if (uploadError) {
    console.error(
      "Failed to upload book cover:",
      uploadError,
    );

    return {
      error: t("errors.uploadFailed"),
      success: null,
    };
  }

  const { data: updatedBook, error: updateError } =
    await supabase
      .from("books")
      .update({
        cover_path: newCoverPath,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookId)
      .select("id")
      .maybeSingle();

  if (updateError || !updatedBook) {
    console.error(
      "Failed to save book cover path:",
      updateError,
    );

    const { error: cleanupError } =
      await supabase.storage
        .from(BOOK_COVERS_BUCKET)
        .remove([newCoverPath]);

    if (cleanupError) {
      console.error(
        "Failed to clean up uploaded cover:",
        cleanupError,
      );
    }

    return {
      error: t("errors.saveFailed"),
      success: null,
    };
  }

  if (book.cover_path) {
    const { error: removeOldCoverError } =
      await supabase.storage
        .from(BOOK_COVERS_BUCKET)
        .remove([book.cover_path]);

    if (removeOldCoverError) {
      console.error(
        "Failed to remove previous book cover:",
        removeOldCoverError,
      );
    }
  }

  revalidateBookPages(bookId);

  return {
    error: null,
    success: t("uploadSuccess"),
  };
}

export async function removeBookCover(
  bookId: number,
  _previousState: BookCoverState,
  _formData: FormData,
): Promise<BookCoverState> {
  const t = await getTranslations("BookCover");

  if (!Number.isInteger(bookId) || bookId < 1) {
    return {
      error: t("errors.bookNotIdentified"),
      success: null,
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      error: t("errors.sessionExpired"),
      success: null,
    };
  }

  const { data: book, error: bookError } =
    await supabase
      .from("books")
      .select("id, cover_path")
      .eq("id", bookId)
      .maybeSingle();

  if (bookError) {
    console.error(
      "Failed to load book before removing cover:",
      bookError,
    );

    return {
      error: t("errors.bookLoadFailed"),
      success: null,
    };
  }

  if (!book) {
    return {
      error: t("errors.bookMissing"),
      success: null,
    };
  }

  if (!book.cover_path) {
    return {
      error: null,
      success: t("removeSuccess"),
    };
  }

  const { data: updatedBook, error: updateError } =
    await supabase
      .from("books")
      .update({
        cover_path: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookId)
      .select("id")
      .maybeSingle();

  if (updateError || !updatedBook) {
    console.error(
      "Failed to clear book cover path:",
      updateError,
    );

    return {
      error: t("errors.removeFailed"),
      success: null,
    };
  }

  const { error: storageError } =
    await supabase.storage
      .from(BOOK_COVERS_BUCKET)
      .remove([book.cover_path]);

  if (storageError) {
    console.error(
      "Failed to remove book cover from Storage:",
      storageError,
    );
  }

  revalidateBookPages(bookId);

  return {
    error: null,
    success: t("removeSuccess"),
  };
}