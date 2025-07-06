import { UFS } from "@/lib/utils";
import { TFilter } from "@/@types";
import React from "react";

const contribuinteOptions = [
  { label: "Não Optante", value: 1 },
  { label: "MEI", value: 2 },
  { label: "ME/EPP", value: 3 },
];

interface FiltroHeaderProps {
  submittedFilters: TFilter | null;
  returnedYears: string[];
}

export const FiltroHeader: React.FC<FiltroHeaderProps> = ({
  submittedFilters,
  returnedYears,
}) => {
  if (!submittedFilters) {
    return (
      <div className="mb-4 text-sm text-gray-500">
        <strong>Filtros não aplicados.</strong>
      </div>
    );
  }

  const { filtro, municipio, uf, regiao, contribuintes, valorMin, valorMax } =
    submittedFilters;

  let filtroInfo = "";
  if (filtro === "todos") {
    filtroInfo = "Brasil";
  } else if (filtro === "uf" && uf) {
    filtroInfo = UFS.find(u => u.uf === uf)?.name || uf;
  } else if (filtro === "municipio" && municipio) {
    filtroInfo = String(municipio);
  } else if (filtro === "regiao" && regiao) {
    filtroInfo = regiao;
  }

  const getContribuintesText = () => {
    if (!contribuintes || contribuintes.length === 0) return "Nenhum";
    if (contribuintes.length === contribuinteOptions.length) return "Todos";
    return contribuinteOptions
      .filter(opt => contribuintes.includes(opt.value))
      .map(opt => opt.label)
      .join(", ");
  };

  const getValorText = () => {
    if (valorMin && valorMax) return `entre R$ ${valorMin} e R$ ${valorMax}`;
    if (valorMin) return `a partir de R$ ${valorMin}`;
    if (valorMax) return `até R$ ${valorMax}`;
    return "Qualquer valor";
  };

  return (
    <div className="mb-4 p-3 bg-gray-50 border rounded-lg">
      <h3 className="text-md font-semibold text-gray-800 mb-2">
        Filtros Aplicados
      </h3>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
        <div className="flex items-baseline gap-2">
          <strong className="font-semibold text-gray-900">Anos:</strong>
          <span>
            {returnedYears.length === 0 ? "Todos" : returnedYears.join(", ")}
          </span>
        </div>
        {filtroInfo && (
          <div className="flex items-baseline gap-2">
            <strong className="font-semibold text-gray-900">Local:</strong>
            <span>{filtroInfo}</span>
          </div>
        )}
        <div className="flex items-baseline gap-2">
          <strong className="font-semibold text-gray-900">
            Contribuintes:
          </strong>
          <span>{getContribuintesText()}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <strong className="font-semibold text-gray-900">Valor:</strong>
          <span>{getValorText()}</span>
        </div>
      </div>
    </div>
  );
};
