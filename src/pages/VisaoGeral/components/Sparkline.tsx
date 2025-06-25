import { EtlData } from "../hooks/useEtlData";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface SparklineProps {
  data: EtlData[];
  color?: string;
}

export function Sparkline({ data, color = "#2563eb" }: SparklineProps) {
  return (
    <ResponsiveContainer width="100%" height={32}>
      <LineChart data={data} margin={{ top: 8, right: 0, left: 0, bottom: 8 }}>
        <Line
          type="monotone"
          dataKey="qtd_nfse"
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
