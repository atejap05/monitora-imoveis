import React from "react";

const Convenios: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Convênios</h1>
      <p className="mb-4 text-gray-600">
        Informações sobre os convênios celebrados entre municípios e a Receita
        Federal do Brasil (RFB) para compartilhamento de NFSe no Ambiente de
        Dados Nacional.
      </p>
      <div className="bg-white rounded shadow p-6">
        <p>
          Em breve: status de adesão, datas, visualização em mapa/lista, filtros
          e indicadores de cobertura nacional.
        </p>
      </div>
    </div>
  );
};

export default Convenios;
