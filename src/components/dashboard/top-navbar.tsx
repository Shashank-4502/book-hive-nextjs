"use client";

import React from "react";
import { UserDropdown } from "@/components/dashboard/user-dropdown";
import { LanguageSwitcher } from "@/components/language-swicher";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

export function TopNavbar() {
  const t = useTranslations("Common");
  const pathname = usePathname();
  const locale = useLocale();

  const dashboardPath = pathname === `/${locale}/dashboard`;

  if (dashboardPath) {
    return null;
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow fixed top-0 left-16 right-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mr-4">
            {t("title")}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}
