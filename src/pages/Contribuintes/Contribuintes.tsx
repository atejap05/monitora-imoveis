import React from "react";

const Contribuintes: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Contribuintes
      </h1>
      <p className="mb-4 text-gray-600">
        Em breve: ranking de maiores emissores, perfil detalhado de
        contribuintes, evolução de emissão, detecção de padrões atípicos e
        filtros por porte, setor e localização.
      </p>
      <div className="bg-white rounded shadow p-6">
        <ul className="list-disc pl-6 text-gray-700">
          <li>Ranking de maiores emissores</li>
          <li>Perfil detalhado de contribuintes (CNPJ, porte, localização)</li>
          <li>Evolução de emissão por contribuinte</li>
          <li>Detecção de padrões atípicos</li>
          <li>Filtros por porte, setor, localização</li>
        </ul>
      </div>
    </div>
  );
};

export default Contribuintes;
