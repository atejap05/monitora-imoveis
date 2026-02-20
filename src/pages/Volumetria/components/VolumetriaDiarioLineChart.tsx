import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { VolumetriaItem } from "@/@types";
import { formatarDataProcessamento } from "./utils";

interface VolumetriaDiarioLineChartProps {
  data: VolumetriaItem[];
}

const mapToChartData = (data: VolumetriaItem[]) =>
  data.map(d => ({
    data_processamento: formatarDataProcessamento(d.data_processamento),
    total_nfse_processadas: d.total_nfse_processadas,
  }));

export function VolumetriaDiarioLineChart({ data }: VolumetriaDiarioLineChartProps) {
  const chartData = mapToChartData(data);

  return (
    <div className="w-full h-80 bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-1">
        Volume diário de NFSe processadas/compartilhadas
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Tendência do processamento diário de notas fiscais no período selecionado
      </p>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="data_processamento"
            tick={{ fontSize: 12 }}
            minTickGap={10}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number) => value.toLocaleString("pt-BR")}
            labelFormatter={label => `Data: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="total_nfse_processadas"
            stroke="#709f77"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
