import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const PricesChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={[
          { month: "February", "Price Up": 305, "Price Down": 200 },
          { month: "June", "Price Up": 214, "Price Down": 140 },
          { month: "March", "Price Up": 237, "Price Down": 120 },
          { month: "April", "Price Up": 73, "Price Down": 190 },
          { month: "May", "Price Up": 209, "Price Down": 130 },
          { month: "June", "Price Up": 214, "Price Down": 140 },
          { month: "June", "Price Up": 214, "Price Down": 140 },
          { month: "January", "Price Up": 186, "Price Down": 80 },
          { month: "June", "Price Up": 214, "Price Down": 140 },
          { month: "June", "Price Up": 214, "Price Down": 140 },
        ]}
      >
        <XAxis dataKey="month" />
        {/*<YAxis />*/}
        <Tooltip cursor={{ fill: "#000000", fillOpacity: 0.02 }} />
        <Legend />
        <Bar dataKey="Price Up" stackId="a" fill="#444444" />
        <Bar
          dataKey="Price Down"
          stackId="a"
          fill="#888888"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
