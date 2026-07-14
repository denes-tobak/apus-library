import { getTranslations } from "next-intl/server";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/actions";

export async function LogoutButton() {
  const t = await getTranslations("Navigation");

  return (
    <form action={signOut}>
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        aria-label={t("logout")}
      >
        <LogOut className="size-4" />

        <span className="hidden sm:inline">
          {t("logout")}
        </span>
      </Button>
    </form>
  );
}