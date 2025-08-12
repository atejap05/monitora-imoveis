import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { type EtlData } from "@/lib/utils";

interface EtlLineChartProps {
  data: EtlData[];
}

export function EtlLineChart({ data }: EtlLineChartProps) {
  return (
    <div className="w-full h-80 bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-1">
        Volume diário de notas fiscais processadas pelo ETL
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Tendência do processamento diário de notas fiscais na base de dados
      </p>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="data_etl" tick={{ fontSize: 12 }} minTickGap={10} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: any) => value.toLocaleString()}
            labelFormatter={label => `Data: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="qtd_nfse"
            stroke="#709f77"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
