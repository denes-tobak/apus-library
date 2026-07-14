import { getTranslations } from "next-intl/server";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/actions";

export async function LogoutButton() {
  const t = await getTranslations(
    "Navigation",
  );

  return (
    <form action={signOut}>
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        title={t("logout")}
        aria-label={t("logout")}
        className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-stone-300 shadow-sm hover:border-red-300/20 hover:bg-red-500/15 hover:text-red-100"
      >
        <LogOut className="size-4" />

        <span className="hidden xl:inline">
          {t("logout")}
        </span>
      </Button>
    </form>
  );
}