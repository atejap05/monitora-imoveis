import React from "react";
import { useAmbienteEmissao } from "./hooks/useAmbienteEmissao";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { PieChartNFSe } from "@/components/PieChartNFSe";
import { BarChartNFSe } from "@/components/BarChartNFSe";
import { LineChartNFSe } from "@/components/LineChartNFSe";

const Ambiente: React.FC = () => {
  const { data, isLoading, error } = useAmbienteEmissao();

  // Dados para gráfico de barras empilhadas (evolução anual por processo)
  const barChartData =
    data?.map((row: any) => ({
      year: row.ano.toString(),
      app: row.total_app,
      web: row.total_web,
      webservice: row.total_webservice,
      proprio: row.total_ambiente_municipio,
    })) || [];

  // Dados para gráfico de linhas (tendência nacional x município)
  const lineChartData =
    data?.map((row: any) => ({
      year: row.ano.toString(),
      nacional: row.total_ambiente_nacional,
      municipio: row.total_ambiente_municipio,
    })) || [];

  // Funções de agregação e KPIs
  const totalNacional =
    data?.reduce((acc, row) => acc + row.total_ambiente_nacional, 0) || 0;
  const totalMunicipio =
    data?.reduce((acc, row) => acc + row.total_ambiente_municipio, 0) || 0;
  const totalGeral =
    data?.reduce((acc, row) => acc + row.total_geral_ano, 0) || 0;
  const totalWeb = data?.reduce((acc, row) => acc + row.total_web, 0) || 0;
  const totalWebservice =
    data?.reduce((acc, row) => acc + row.total_webservice, 0) || 0;
  const totalApp = data?.reduce((acc, row) => acc + row.total_app, 0) || 0;
  const totalTranscrita =
    data?.reduce((acc, row) => acc + row.total_tipo_transcrita, 0) || 0;

  const adocaoNacional = totalGeral ? (totalNacional / totalGeral) * 100 : 0;
  const principalMeioValor = Math.max(totalWebservice, totalWeb, totalApp);
  const principalMeioNome =
    principalMeioValor === totalWebservice
      ? "Web Service"
      : principalMeioValor === totalWeb
      ? "Web"
      : principalMeioValor === totalApp
      ? "App"
      : "-";
  const pctTranscrita = totalGeral ? (totalTranscrita / totalGeral) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Ambiente</h1>
      <p className="mb-4 text-gray-600">
        Em breve: evolução temporal do volume de NFSe, mapa de calor por
        UF/município, ranking de municípios/UFs por emissão, indicadores de
        crescimento/queda e filtros por período, UF, município e porte.
      </p>

      {/* KPIs em Cards Shadcn UI */}
      {data && data.length > 0 && (
        <>
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Adoção do Ambiente Nacional */}
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-base font-medium text-gray-500">
                  Adoção do Ambiente Nacional
                </CardTitle>
                <CardDescription>
                  Proporção de notas emitidas diretamente no ambiente nacional
                </CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-3xl font-bold text-green-700">
                  {adocaoNacional.toFixed(1)}%
                </span>
              </CardContent>
            </Card>
            {/* Card 2: Principal Meio de Emissão */}
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-base font-medium text-gray-500">
                  Principal Meio de Emissão
                </CardTitle>
                <CardDescription>
                  Canal mais utilizado para emissão de NFSe
                </CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-2xl font-bold text-blue-700">
                  {principalMeioNome}
                </span>
              </CardContent>
            </Card>
            {/* Card 3: % de Notas Transcritas */}
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-base font-medium text-gray-500">
                  % de Notas Transcritas
                </CardTitle>
                <CardDescription>
                  Notas emitidas em sistemas legados e transcritas para o padrão
                  nacional
                </CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-3xl font-bold text-yellow-700">
                  {pctTranscrita.toFixed(1)}%
                </span>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de Pizza: Composição por Ambiente */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-semibold mb-2 text-gray-700">
                Composição por Ambiente
              </h2>
              <PieChartNFSe
                chartData={[
                  {
                    nameKey: "Ambiente Nacional",
                    total: totalNacional,
                    fill: "#22c55e", // verde
                  },
                  {
                    nameKey: "Ambiente Município",
                    total: totalMunicipio,
                    fill: "#3b82f6", // azul
                  },
                ]}
                chartConfig={{
                  "Ambiente Nacional": {
                    color: "#22c55e",
                    label: "Ambiente Nacional",
                  },
                  "Ambiente Município": {
                    color: "#3b82f6",
                    label: "Ambiente Município",
                  },
                }}
              />
            </div>
            {/* Gráfico de Pizza: Composição por Processo de Emissão */}
            <div>
              <h2 className="text-lg font-semibold mb-2 text-gray-700">
                Composição por Processo de Emissão
              </h2>
              <PieChartNFSe
                chartData={[
                  {
                    nameKey: "Web Service",
                    total: totalWebservice,
                    fill: "#6366f1", // roxo
                  },
                  {
                    nameKey: "Web",
                    total: totalWeb,
                    fill: "#0ea5e9", // azul claro
                  },
                  {
                    nameKey: "App",
                    total: totalApp,
                    fill: "#f59e42", // laranja
                  },
                ]}
                chartConfig={{
                  "Web Service": {
                    color: "#6366f1",
                    label: "Web Service",
                  },
                  Web: {
                    color: "#0ea5e9",
                    label: "Web",
                  },
                  App: {
                    color: "#f59e42",
                    label: "App",
                  },
                }}
              />
            </div>
          </div>
          {/* Gráfico de Barras Empilhadas: Evolução Anual */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2 text-gray-700">
              Evolução Anual por Processo de Emissão
            </h2>
            <BarChartNFSe chartData={barChartData} />
          </div>

          {/* Gráfico de Linhas: Tendência Nacional x Município */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2 text-gray-700">
              Tendência: Nacional x Município (por ano)
            </h2>
            <LineChartNFSe data={lineChartData} />
          </div>
        </>
      )}

      <div className="bg-white rounded shadow p-6">
        {isLoading ? (
          <div className="text-center text-green-700">Carregando dados...</div>
        ) : error ? (
          <div className="text-center text-red-500">
            Erro ao carregar dados do ambiente.
          </div>
        ) : data && data.length > 0 ? (
          <table className="min-w-full text-sm text-gray-700">
            <thead>
              <tr>
                <th className="px-2 py-1">Ano</th>
                <th className="px-2 py-1">Amb. Nacional</th>
                <th className="px-2 py-1">Amb. Município</th>
                <th className="px-2 py-1">Web</th>
                <th className="px-2 py-1">Webservice</th>
                <th className="px-2 py-1">App</th>
                <th className="px-2 py-1">Tipo Nacional</th>
                <th className="px-2 py-1">Tipo Transcrita</th>
                <th className="px-2 py-1">Total Geral Ano</th>
              </tr>
            </thead>
            <tbody>
              {data.map(row => (
                <tr key={row.ano}>
                  <td className="px-2 py-1 text-center">{row.ano}</td>
                  <td className="px-2 py-1 text-right">
                    {row.total_ambiente_nacional.toLocaleString("pt-BR")}
                  </td>
                  <td className="px-2 py-1 text-right">
                    {row.total_ambiente_municipio.toLocaleString("pt-BR")}
                  </td>
                  <td className="px-2 py-1 text-right">
                    {row.total_web.toLocaleString("pt-BR")}
                  </td>
                  <td className="px-2 py-1 text-right">
                    {row.total_webservice.toLocaleString("pt-BR")}
                  </td>
                  <td className="px-2 py-1 text-right">
                    {row.total_app.toLocaleString("pt-BR")}
                  </td>
                  <td className="px-2 py-1 text-right">
                    {row.total_tipo_nacional.toLocaleString("pt-BR")}
                  </td>
                  <td className="px-2 py-1 text-right">
                    {row.total_tipo_transcrita.toLocaleString("pt-BR")}
                  </td>
                  <td className="px-2 py-1 text-right font-bold">
                    {row.total_geral_ano.toLocaleString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-gray-500">
            Nenhum dado encontrado para os filtros selecionados.
          </div>
        )}
      </div>
    </div>
  );
};

export default Ambiente;
