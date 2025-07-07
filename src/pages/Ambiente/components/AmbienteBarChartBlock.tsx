import React from "react";
import { BarChartNFSe } from "@/components/BarChartNFSe";

interface AmbienteBarChartBlockProps {
  barChartData: any[];
}

export const AmbienteBarChartBlock: React.FC<AmbienteBarChartBlockProps> = ({
  barChartData,
}) => (
  <div className="mb-8">
    <h2 className="text-lg font-semibold mb-2 text-gray-700">
      Evolução Anual por Processo de Emissão
    </h2>
    <BarChartNFSe chartData={barChartData} />
  </div>
);
