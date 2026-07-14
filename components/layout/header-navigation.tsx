"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  LibraryBig,
} from "lucide-react";
import { usePathname } from "next/navigation";

type HeaderNavigationProps = {
  mobile?: boolean;
};

export function HeaderNavigation({
  mobile = false,
}: HeaderNavigationProps) {
  const pathname = usePathname();
  const t = useTranslations("Navigation");

  const navigationItems = [
    {
      href: "/dashboard",
      label: t("dashboard"),
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      href: "/books",
      label: t("books"),
      icon: LibraryBig,
      active: pathname.startsWith("/books"),
    },
  ];

  return (
    <nav
      aria-label="Primary navigation"
      className={
        mobile
          ? "grid grid-cols-2 gap-2"
          : "flex items-center gap-1 rounded-2xl border border-white/10 bg-black/15 p-1.5 shadow-inner"
      }
    >
      {navigationItems.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={
              item.active ? "page" : undefined
            }
            className={
              item.active
                ? "flex h-10 items-center justify-center gap-2 rounded-xl bg-amber-100 px-4 text-sm font-semibold text-[#17231f] shadow-md shadow-black/20 transition"
                : "flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium text-stone-300 transition hover:bg-white/10 hover:text-white"
            }
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}