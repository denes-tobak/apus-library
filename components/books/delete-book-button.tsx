"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import {
  AlertTriangle,
  Loader2,
  Trash2,
} from "lucide-react";

import {
  deleteBook,
  type DeleteBookState,
} from "@/app/books/[id]/actions";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type DeleteBookButtonProps = {
  bookId: number;
  bookTitle: string;
};

const initialState: DeleteBookState = {
  error: null,
};

export function DeleteBookButton({
  bookId,
  bookTitle,
}: DeleteBookButtonProps) {
  const t = useTranslations(
    "BookDetails.deleteDialog",
  );

  const deleteBookWithId = deleteBook.bind(
    null,
    bookId,
  );

  const [state, formAction, isPending] =
    useActionState(
      deleteBookWithId,
      initialState,
    );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="shadow-sm"
        >
          <Trash2 className="size-4" />
          {t("trigger")}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="overflow-hidden border-amber-950/10 bg-[#fffdf8] p-0 sm:max-w-md">
        <div className="border-b border-red-950/10 bg-red-50 px-6 py-6">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-red-100 text-red-700">
            <AlertTriangle className="size-6" />
          </div>

          <AlertDialogHeader className="mt-4 text-left">
            <AlertDialogTitle className="font-serif text-2xl text-stone-950">
              {t("title")}
            </AlertDialogTitle>

            <AlertDialogDescription className="leading-6 text-stone-600">
              {t("description", {
                title: bookTitle,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>

        <div className="px-6 pb-6">
          {state.error && (
            <div
              role="alert"
              className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {state.error}
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isPending}
              className="border-stone-300 bg-white"
            >
              {t("cancel")}
            </AlertDialogCancel>

            <form action={formAction}>
              <Button
                type="submit"
                variant="destructive"
                disabled={isPending}
                className="w-full sm:w-auto"
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {t("deleting")}
                  </>
                ) : (
                  <>
                    <Trash2 className="size-4" />
                    {t("confirm")}
                  </>
                )}
              </Button>
            </form>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}