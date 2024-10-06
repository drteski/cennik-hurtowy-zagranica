import useGetCountries from "@/hooks/useGetCountries";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export const Countries = () => {
  const { data, isLoading } = useGetCountries();
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    if (!isLoading) {
      setCountries(data);
    }
  }, [data, isLoading]);

  const handleSearch = (e) => {
    setCountries(
      data.filter((country) =>
        country.name.toLowerCase().includes(e.target.value.toLowerCase()),
      ),
    );
  };
  return (
    <div className="bg-gray-100 grid grid-cols-[300px_1fr] gap-4 rounded-lg mt-2 h-full p-4">
      {isLoading ? (
        <Skeleton className="h-full w-full" />
      ) : (
        <div className="grid grid-rows-[auto_1fr_auto] gap-4">
          <Input
            onChange={handleSearch}
            placeholder="Search"
            className="bg-white"
          />
          <div className="flex flex-col gap-2 overflow-y-auto h-[calc(100dvh_-_116px_-_80px_-_36px_-_32px_-_32px_-_36px)]">
            {countries.map((country) => {
              return (
                <Button
                  className="flex justify-between items-center"
                  key={country.id}
                >
                  {country.name}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              );
            })}
          </div>
          <Button variant="outline" className="w-full">
            New country
          </Button>
        </div>
      )}
      <div>dupa</div>
    </div>
  );
};
