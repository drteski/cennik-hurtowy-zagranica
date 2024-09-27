import Link from "next/link";
import prisma from "@/db";
import { Button } from "@/components/ui/button";
import { CarbonSettings } from "@/components/Icones";

const BasePage = async () => {
  const countries = await prisma.country.findMany();
  return (
    <div className="h-screen flex flex-col p-10 min-w-[768px]">
      <div className="w-full flex justify-end items-center">
        <Button size="icon" asChild>
          <Link href="/settings">
            <CarbonSettings className="h-5 w-5" />
          </Link>
        </Button>
      </div>
      <div className="flex flex-col h-full items-center justify-center gap-16">
        <h1 className="text-7xl font-bold">Prices Podlasiak</h1>
        <div className="flex flex-wrap w-[768px] justify-center px-10 items-center gap-4">
          {countries.map((country) => (
            <Button key={country.iso} asChild>
              <Link
                href={`/${country.iso}`}
                className="font-normal text-[14px]"
              >
                {country.name}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BasePage;
