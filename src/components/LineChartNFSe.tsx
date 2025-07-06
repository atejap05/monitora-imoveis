import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface LineChartNFSeProps {
  data: Array<{
    year: string;
    nacional: number;
    municipio: number;
  }>;
}

export const LineChartNFSe: React.FC<LineChartNFSeProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart
        data={data}
        margin={{ top: 16, right: 24, left: 0, bottom: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="nacional"
          name="Ambiente Nacional"
          stroke="#22c55e"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="municipio"
          name="Ambiente Município"
          stroke="#3b82f6"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
