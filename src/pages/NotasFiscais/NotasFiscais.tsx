import React from "react";

const NotasFiscais: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Notas Fiscais
      </h1>
      <p className="mb-4 text-gray-600">
        Em breve: análise de cancelamentos, distribuição por faixa de valor,
        detalhamento de notas por status, gráficos para motivos de cancelamento
        e filtros por status, valor e data.
      </p>
      <div className="bg-white rounded shadow p-6">
        <ul className="list-disc pl-6 text-gray-700">
          <li>Análise de cancelamentos (motivo, frequência, valor)</li>
          <li>Distribuição por faixa de valor</li>
          <li>Detalhamento de notas por status</li>
          <li>Gráficos de barras/pizza para motivos de cancelamento</li>
          <li>Filtros por status, valor, data</li>
        </ul>
      </div>
    </div>
  );
};

export default NotasFiscais;
