import React from "react";
import { PieChartNFSe } from "@/components/PieChartNFSe";

interface AmbientePieChartsProps {
  totalNacional: number;
  totalMunicipio: number;
  totalWebservice: number;
  totalWeb: number;
  totalApp: number;
}

export const AmbientePieCharts: React.FC<AmbientePieChartsProps> = ({
  totalNacional,
  totalMunicipio,
  totalWebservice,
  totalWeb,
  totalApp,
}) => (
  <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
    <div>
      <h2 className="text-lg font-semibold mb-2 text-gray-700">
        Composição por Ambiente
      </h2>
      <PieChartNFSe
        chartData={[
          {
            nameKey: "Ambiente Nacional",
            total: totalNacional,
            fill: "#22c55e",
          },
          {
            nameKey: "Ambiente Município",
            total: totalMunicipio,
            fill: "#3b82f6",
          },
        ]}
        chartConfig={{
          "Ambiente Nacional": {
            color: "#22c55e",
            label: "Ambiente Nacional",
          },
          "Ambiente Município": {
            color: "#3b82f6",
            label: "Ambiente Município",
          },
        }}
      />
    </div>
    <div>
      <h2 className="text-lg font-semibold mb-2 text-gray-700">
        Composição por Processo de Emissão
      </h2>
      <PieChartNFSe
        chartData={[
          {
            nameKey: "Web Service",
            total: totalWebservice,
            fill: "#6366f1",
          },
          {
            nameKey: "Web",
            total: totalWeb,
            fill: "#0ea5e9",
          },
          {
            nameKey: "App",
            total: totalApp,
            fill: "#f59e42",
          },
        ]}
        chartConfig={{
          "Web Service": {
            color: "#6366f1",
            label: "Web Service",
          },
          Web: {
            color: "#0ea5e9",
            label: "Web",
          },
          App: {
            color: "#f59e42",
            label: "App",
          },
        }}
      />
    </div>
  </div>
);
