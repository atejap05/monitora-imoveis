import React from "react";

const Ambiente: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Ambiente</h1>
      <p className="mb-4 text-gray-600">
        Em breve: evolução temporal do volume de NFSe, mapa de calor por
        UF/município, ranking de municípios/UFs por emissão, indicadores de
        crescimento/queda e filtros por período, UF, município e porte.
      </p>
      <div className="bg-white rounded shadow p-6">
        <ul className="list-disc pl-6 text-gray-700">
          <li>Evolução temporal do volume de NFSe (linha do tempo)</li>
          <li>Mapa de calor por UF/município</li>
          <li>Ranking de municípios/UFs por emissão</li>
          <li>Indicadores de crescimento/queda</li>
          <li>Filtros por período, UF, município, porte</li>
        </ul>
      </div>
    </div>
  );
};

export default Ambiente;
