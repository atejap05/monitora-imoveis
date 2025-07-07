import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, TrendingUp, Users, Calculator } from "lucide-react";

export const NotasFiscaisWelcome: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-green rounded-full">
            <FileText className="h-16 w-16 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800">
          Análise de Notas Fiscais Eletrônicas
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Visualize dados detalhados sobre cancelamentos de NFSe e explore o
          ranking das 100 maiores notas fiscais por valor.
        </p>
      </div>

      {/* Cards com Recursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
        <Card className="text-center border-green-200 hover:border-green-300 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex justify-center mb-2">
              <Calculator className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-sm font-medium text-gray-700">
              KPIs de Cancelamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-xs">
              Métricas detalhadas por tipo de cancelamento
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="text-center border-green-200 hover:border-green-300 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex justify-center mb-2">
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
            <CardTitle className="text-sm font-medium text-gray-700">
              Top 100 NFSe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-xs">
              Ranking das maiores notas por valor
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="text-center border-green-200 hover:border-green-300 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex justify-center mb-2">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <CardTitle className="text-sm font-medium text-gray-700">
              Principais Contribuintes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-xs">
              Empresas com maiores valores em NFSe
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="text-center border-green-200 hover:border-green-300 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex justify-center mb-2">
              <FileText className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-sm font-medium text-gray-700">
              Análise Detalhada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-xs">
              Dados filtráveis por período e região
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Nota Informativa */}
      <div className="text-center max-w-lg">
        <p className="text-lg text-gray-600">
          💡 <strong>Para começar:</strong> Use os filtros na barra lateral para
          personalizar sua análise e visualizar os dados das notas fiscais
          eletrônicas.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Aplique filtros por período, região, município ou outros critérios
          para obter insights específicos.
        </p>
      </div>
    </div>
  );
};
