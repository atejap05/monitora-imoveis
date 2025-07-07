import { BarChart3, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

interface ConveniosWelcomeProps {
  onConsultar: () => void;
}

export const ConveniosWelcome: React.FC<ConveniosWelcomeProps> = ({
  onConsultar,
}) => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="rounded-xl bg-gradient-to-br from-yellow-100 via-white to-blue-100 shadow-lg p-8 flex flex-col items-center gap-6 border border-gray-200">
      <div className="flex flex-col items-center gap-2">
        <BarChart3 className="w-12 h-12 text-yellow-500 mb-2" />
        <span className="text-lg font-semibold text-primary">
          Painel de Convênios Municipais
        </span>
        <span className="text-gray-500 text-center max-w-md">
          Consulte e explore dados completos sobre os convênios entre municípios
          e a Receita Federal.
          <br />
          Clique no botão abaixo para iniciar a consulta.
        </span>
      </div>
      <Button
        className="mt-4 px-6 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-bold flex items-center gap-2 shadow transition-colors"
        onClick={onConsultar}
      >
        <Database className="w-5 h-5" />
        Consultar Convênios
      </Button>
    </div>
  </div>
);
