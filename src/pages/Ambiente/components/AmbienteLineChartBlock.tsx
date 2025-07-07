import React from "react";
import { LineChartNFSe } from "@/components/LineChartNFSe";

interface AmbienteLineChartBlockProps {
  lineChartData: any[];
}

export const AmbienteLineChartBlock: React.FC<AmbienteLineChartBlockProps> = ({
  lineChartData,
}) => (
  <div className="mb-8">
    <h2 className="text-lg font-semibold mb-2 text-gray-700">
      Tendência: Nacional x Município (por ano)
    </h2>
    <LineChartNFSe data={lineChartData} />
  </div>
);
