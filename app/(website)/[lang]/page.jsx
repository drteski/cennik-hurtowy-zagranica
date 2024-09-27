import { matchPath } from "@/lib/utils";
import { notFound } from "next/navigation";
import prisma from "@/db";
import { cookies } from "next/headers";
import AuthCountry from "@/components/AuthCountry";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CarbonChevronLeft } from "@/components/Icones";
import { TableContainer } from "@/components/tables/TableContainer";

const LangPage = async ({ params }) => {
  if (!(await matchPath(params.lang))) return notFound();
  const country = await prisma.country.findFirst({
    where: {
      iso: params.lang,
    },
  });

  const cookieStore = cookies();
  const cookieLang = cookieStore.get("lang")?.value || "";
  const cookieAuth = cookieStore.get("authorized")?.value
    ? JSON.parse(cookieStore.get("authorized")?.value)
    : false;

  if (!cookieAuth)
    return (
      <main>
        <AuthCountry country={country.name} lang={params.lang} />
      </main>
    );
  if (cookieLang !== params.lang)
    return (
      <main>
        <AuthCountry country={country.name} lang={params.lang} />
      </main>
    );

  return (
    <main className="flex flex-col min-w-[768px]">
      <div className="p-10 flex justify-between items-center">
        <Button size="icon" asChild>
          <Link href="/">
            <CarbonChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-4xl text-center font-bold">{country.name}</h1>
      </div>
      <TableContainer country={country} />
    </main>
  );
};
export default LangPage;
