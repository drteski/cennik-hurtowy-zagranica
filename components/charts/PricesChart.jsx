"use client";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { differenceInDays, format } from "date-fns";
import { useEffect, useState } from "react";
import { HeaderSmall } from "@/components/Layout/HeaderSmall";

export const PricesChart = ({ data, country }) => {
  const [countryData, setCountryData] = useState([]);

  useEffect(() => {
    const currentCountryData = data.filter(
      (item) => item.country.name.toLowerCase() === country,
    );
    const dataLength = currentCountryData.length;
    if (dataLength < 10) {
      const missingData = Array.from(Array(10).keys())
        .map((item) => {
          const dates = currentCountryData.map((change) =>
            differenceInDays(new Date(Date.now()), new Date(change.createdAt)),
          );
          if (!dates.some((date) => date === item)) return item;
        })
        .filter(Boolean)
        .map((item) => {
          return {
            date: format(
              new Date(new Date().getTime() - item * 24 * 60 * 60 * 1000),
              "dd-MM-yyyy",
            ),
            "Price Up": 0,
            "Price Down": 0,
          };
        });
      setCountryData(
        [
          ...currentCountryData.map((item) => {
            return {
              date: format(item.createdAt, "dd-MM-yyyy"),
              "Price Up": item.pricesUp,
              "Price Down": item.pricesDown,
            };
          }),
          ...missingData,
        ].reverse(),
      );
    } else {
      setCountryData(
        currentCountryData.map((item) => {
          return {
            date: format(item.createdAt, "dd-MM-yyyy"),
            "Price Up": item.pricesUp,
            "Price Down": item.pricesDown,
          };
        }),
      );
    }
  }, [data, country]);

  return (
    <ChartContainer
      config={{
        desktop: {
          label: "Prices Up",
          color: "#191919",
        },
        mobile: {
          label: "Prices Down",
          color: "#999999",
        },
      }}
      className="w-full h-[calc(100%_-_52px)]"
    >
      <BarChart accessibilityLayer data={countryData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="Price Up" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="Price Down" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
};
