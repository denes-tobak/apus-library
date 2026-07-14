"use client";

import { useActionState } from "react";
import { Loader2, Trash2 } from "lucide-react";

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
  const deleteBookWithId = deleteBook.bind(null, bookId);

  const [state, formAction, isPending] = useActionState(
    deleteBookWithId,
    initialState,
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="size-4" />
          Delete
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete this book?
          </AlertDialogTitle>

          <AlertDialogDescription>
            “{bookTitle}” will be permanently removed from the
            library. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {state.error && (
          <div
            role="alert"
            className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {state.error}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            Cancel
          </AlertDialogCancel>

          <form action={formAction}>
            <Button
              type="submit"
              variant="destructive"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="size-4" />
                  Delete book
                </>
              )}
            </Button>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}