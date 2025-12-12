import React from "react";
import { Card } from "@/components/ui/card";

export const VolumetriaWelcome: React.FC = () => {
  return (
    <Card className="p-12 text-center">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Bem-vindo à Análise de Volumetria
        </h2>
        <p className="text-gray-600 mb-6">
          Selecione os filtros acima para visualizar dados de volumetria de
          NFSe, incluindo métricas de processamento, padrões horários e
          sazonalidade.
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>📊 Visualize tendências mensais e anuais</p>
          <p>📈 Analise padrões de processamento por dia da semana</p>
          <p>⏰ Explore variações horárias de emissão</p>
        </div>
      </div>
    </Card>
  );
};
