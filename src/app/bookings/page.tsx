import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { conduzcoLocale } from "@/lib/akiconduzco-i18n";
import { accountTaskFromSearch } from "@/lib/account-task-resume";

export default async function RentalBookingsAlias({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
} = {}) {
  const locale = conduzcoLocale((await headers()).get("x-akipasa-locale"));
  const task =
    accountTaskFromSearch(
      "coches",
      locale,
      "/account",
      (await searchParams) || {},
    ) || "/account";
  const target = new URL(task, "https://akicoches.com");
  target.searchParams.set("lang", locale);
  redirect(target.pathname + target.search);
}
