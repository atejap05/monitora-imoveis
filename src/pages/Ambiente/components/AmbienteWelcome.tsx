import React from "react";
import { BarChart3, PieChart, TrendingUp, Database } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const AmbienteWelcome: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
    {/* Título e Descrição Principal */}
    <div className="text-center space-y-4">
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-blue-100 rounded-full">
          <BarChart3 className="h-16 w-16 text-blue-600" />
        </div>
      </div>
      <h2 className="text-3xl font-bold text-gray-800">
        Análise de Ambientes de Emissão
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Explore dados detalhados sobre os ambientes de emissão de NFSe no
        Brasil. Visualize indicadores de adoção do ambiente nacional, principais
        meios de emissão e evolução temporal dos processos.
      </p>
    </div>

    {/* Cards com Recursos */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
      <Card className="text-center border-blue-200 hover:border-blue-300 transition-colors">
        <CardHeader className="pb-3">
          <div className="flex justify-center mb-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-sm font-medium text-gray-700">
            KPIs de Adoção
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-xs">
            Métricas de adoção do ambiente nacional
          </CardDescription>
        </CardContent>
      </Card>

      <Card className="text-center border-blue-200 hover:border-blue-300 transition-colors">
        <CardHeader className="pb-3">
          <div className="flex justify-center mb-2">
            <PieChart className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-sm font-medium text-gray-700">
            Composição por Ambiente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-xs">
            Distribuição nacional vs. municipal
          </CardDescription>
        </CardContent>
      </Card>

      <Card className="text-center border-blue-200 hover:border-blue-300 transition-colors">
        <CardHeader className="pb-3">
          <div className="flex justify-center mb-2">
            <TrendingUp className="h-8 w-8 text-yellow-600" />
          </div>
          <CardTitle className="text-sm font-medium text-gray-700">
            Evolução Temporal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-xs">
            Tendências anuais de emissão
          </CardDescription>
        </CardContent>
      </Card>

      <Card className="text-center border-blue-200 hover:border-blue-300 transition-colors">
        <CardHeader className="pb-3">
          <div className="flex justify-center mb-2">
            <Database className="h-8 w-8 text-purple-600" />
          </div>
          <CardTitle className="text-sm font-medium text-gray-700">
            Dados Detalhados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-xs">
            Tabela com informações completas
          </CardDescription>
        </CardContent>
      </Card>
    </div>

    {/* Nota Informativa */}
    <div className="text-center max-w-lg">
      <p className="text-lg text-gray-600">
        💡 <strong>Para começar:</strong> Use os filtros na barra lateral para
        personalizar sua análise e visualizar os dados dos ambientes de emissão.
      </p>
      <p className="text-sm text-gray-500 mt-2">
        Aplique filtros por período, região, município ou outros critérios para
        obter insights específicos sobre os ambientes de emissão.
      </p>
    </div>
  </div>
);
