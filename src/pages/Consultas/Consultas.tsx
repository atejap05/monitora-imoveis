import React from "react";

const Consultas: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Consultas</h1>
      <p className="mb-4 text-gray-600">
        Em breve: listagem detalhada de NFSe, exportação de dados, filtros
        combinados, visualização de documentos e integração com APIs externas
        para validação.
      </p>
      <div className="bg-white rounded shadow p-6">
        <ul className="list-disc pl-6 text-gray-700">
          <li>Listagem detalhada de NFSe (com paginação e busca avançada)</li>
          <li>Exportação de dados (CSV/XLSX)</li>
          <li>Filtros combinados (data, valor, contribuinte, status)</li>
          <li>Visualização de documentos e detalhes</li>
          <li>Integração com APIs externas para validação</li>
        </ul>
      </div>
    </div>
  );
};

export default Consultas;
