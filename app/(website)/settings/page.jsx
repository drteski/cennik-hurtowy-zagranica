import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CarbonChevronLeft } from "@/components/Icones";
import AuthSettings from "@/components/AuthSettings";
import { PasswordChange } from "@/components/settings/PasswordChange";
import { CountriesPasswordChange } from "@/components/settings/CountriesChange";
import { MailingList } from "@/components/settings/MailingList";
import prisma from "@/db";
import { ExcludedProducts } from "@/components/settings/ExludedProducts";

const SettingsPage = async () => {
  const cookieStore = cookies();
  const cookieAuth = cookieStore.get("authorizedSettings")?.value
    ? JSON.parse(cookieStore.get("authorizedSettings")?.value)
    : false;

  if (!cookieAuth)
    return (
      <main>
        <AuthSettings />
      </main>
    );

  const countries = await prisma.country.findMany();
  const mailingList = await prisma.mailingList.findMany({
    where: {},
    include: {
      country: true,
    },
  });
  const excludedProducts = await prisma.excludeProducts.findFirst();

  return (
    <main className="p-10 grid grid-rows-[auto_auto] gap-10 h-screen min-w-[768px]">
      <div className="w-full flex justify-between items-center">
        <Button size="icon" asChild>
          <Link href="/">
            <CarbonChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-6 grid-rows-7 gap-5 h-[calc(100dvh_-_120px_-_36px)]">
        <CountriesPasswordChange data={countries} />
        <MailingList data={mailingList} />
        <PasswordChange />
        <ExcludedProducts data={excludedProducts} />
      </div>
    </main>
  );
};

export default SettingsPage;
