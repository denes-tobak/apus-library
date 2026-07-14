"use client";

import Image from "next/image";
import {
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ImagePlus,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  initialBookCoverState,
  type BookCoverState,
} from "@/types/book-cover";

type BookCoverAction = (
  previousState: BookCoverState,
  formData: FormData,
) => Promise<BookCoverState>;

type BookCoverFormProps = {
  bookTitle: string;
  coverUrl: string | null;
  uploadAction: BookCoverAction;
  removeAction: BookCoverAction;
};

export function BookCoverForm({
  bookTitle,
  coverUrl,
  uploadAction,
  removeAction,
}: BookCoverFormProps) {
  const t = useTranslations("BookCover");
  const router = useRouter();

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] =
    useState<string | null>(coverUrl);

  const [
    uploadState,
    uploadFormAction,
    isUploading,
  ] = useActionState(
    uploadAction,
    initialBookCoverState,
  );

  const [
    removeState,
    removeFormAction,
    isRemoving,
  ] = useActionState(
    removeAction,
    initialBookCoverState,
  );

  useEffect(() => {
    setPreviewUrl(coverUrl);
  }, [coverUrl]);

  useEffect(() => {
    if (!uploadState.success) {
      return;
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    router.refresh();
  }, [router, uploadState.success]);

  useEffect(() => {
    if (!removeState.success) {
      return;
    }

    setPreviewUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    router.refresh();
  }, [removeState.success, router]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      setPreviewUrl(coverUrl);
      return;
    }

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(URL.createObjectURL(file));
  }

  const error =
    uploadState.error ?? removeState.error;

  const success =
    uploadState.success ?? removeState.success;

  const isBusy = isUploading || isRemoving;

  return (
    <section className="overflow-hidden rounded-3xl border border-amber-950/10 bg-white shadow-[0_24px_70px_-40px_rgba(41,37,36,0.6)]">
      <div className="border-b border-stone-200 bg-stone-50/70 px-5 py-6 sm:px-8">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-900">
            <ImagePlus className="size-5" />
          </div>

          <div>
            <h2 className="font-serif text-2xl font-semibold text-stone-950">
              {t("title")}
            </h2>

            <p className="mt-1 text-sm leading-6 text-stone-500">
              {t("description")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-5 sm:p-8 md:grid-cols-[180px_minmax(0,1fr)]">
        <div className="mx-auto w-full max-w-[180px] md:mx-0">
          <div className="relative aspect-[3/4] overflow-hidden rounded-r-2xl rounded-l-md border border-stone-200 bg-gradient-to-br from-amber-100 via-amber-50 to-stone-200 shadow-[12px_18px_35px_-20px_rgba(41,37,36,0.75)]">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt={t("previewAlt", {
                  title: bookTitle,
                })}
                fill
                sizes="180px"
                unoptimized={previewUrl.startsWith(
                  "blob:",
                )}
                className="object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center px-5 text-center">
                <ImagePlus className="size-10 text-stone-400" />

                <p className="mt-3 text-sm font-medium text-stone-600">
                  {t("noCover")}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-col justify-center">
          <form
            action={uploadFormAction}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="book-cover"
                className="text-sm font-medium text-stone-900"
              >
                {coverUrl
                  ? t("replaceLabel")
                  : t("uploadLabel")}
              </label>

              <input
                ref={fileInputRef}
                id="book-cover"
                name="cover"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={isBusy}
                onChange={handleFileChange}
                className="mt-2 block w-full rounded-xl border border-stone-300 bg-white px-3 py-3 text-sm text-stone-700 file:mr-4 file:rounded-lg file:border-0 file:bg-amber-100 file:px-4 file:py-2 file:font-medium file:text-amber-950 hover:file:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <p className="mt-2 text-xs leading-5 text-stone-500">
                {t("fileHelp")}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                type="submit"
                disabled={isBusy}
                className="bg-[#17231f] text-amber-50 hover:bg-[#22312b]"
              >
                {isUploading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Upload className="size-4" />
                )}

                {isUploading
                  ? t("uploading")
                  : coverUrl
                    ? t("replaceButton")
                    : t("uploadButton")}
              </Button>
            </div>
          </form>

          {coverUrl && (
            <form
              action={removeFormAction}
              className="mt-3"
            >
              <Button
                type="submit"
                variant="outline"
                disabled={isBusy}
                className="border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100 hover:text-red-800"
              >
                {isRemoving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}

                {isRemoving
                  ? t("removing")
                  : t("removeButton")}
              </Button>
            </form>
          )}

          <div
            aria-live="polite"
            className="mt-4 min-h-6"
          >
            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </p>
            )}

            {!error && success && (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                {success}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}