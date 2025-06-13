import { TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { BasicLineChart } from "./BasicLineChart";
import { DataTable } from "./data-table";
import { distFreqColumns } from "./columns";
import { useNotasFiscaisState } from "@/state/notasFiscaisState";
import { formatNumber } from "@/lib/utils";

const VisaoGeral = () => {
  const { consultaNFSeTotais } = useNotasFiscaisState();

  const calcularTotaisGerais = (data: any) => {
    if (!data) {
      return {
        total: 0,
        mei: 0,
        me_epp: 0,
        nao_optante: 0,
      };
    }

    let total = 0;
    let mei = 0;
    let me_epp = 0;
    let nao_optante = 0;

    for (const ano in data) {
      if (data.hasOwnProperty(ano)) {
        total += data[ano].total || 0;
        mei += data[ano].mei || 0;
        me_epp += data[ano].me_epp || 0;
        nao_optante += data[ano].nao_optante || 0;
      }
    }

    return {
      total,
      mei,
      me_epp,
      nao_optante,
    };
  };

  const totaisGerais = calcularTotaisGerais(consultaNFSeTotais);

  return (
    <TabsContent className="px-4 py-8" value="visao-geral">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4 md:mb-6 lg:mb-8">
        Visão Geral da Base NFSe
      </h1>

      <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Total de NFSe</CardTitle>
              <CardDescription>Total de notas fiscais emitidas</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold text-gray-800">
                {formatNumber(totaisGerais?.total?.toString() || "0")}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>MEI</CardTitle>
              <CardDescription>Total de notas fiscais MEI</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold text-gray-800">
                {formatNumber(totaisGerais?.mei?.toString() || "0")}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>ME/EPP</CardTitle>
              <CardDescription>Total de notas fiscais ME/EPP</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold text-gray-800">
                {formatNumber(totaisGerais?.me_epp?.toString() || "0")}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Grandes Empresas</CardTitle>
              <CardDescription>
                Total de notas fiscais de grandes empresas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold text-gray-800">
                {formatNumber(totaisGerais?.nao_optante?.toString() || "0")}
              </span>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-4 flex flex-col lg:flex-row gap-4">
          <BasicLineChart />
          <DataTable
            title="Distribuição de Frequência"
            subtitle="Distribuição de frequência das notas fiscais"
            data={[
              {
                faixa: "0-500",
                frequencia: 1000,
                frequencia_acumulada: 1000,
                frequencia_acumulada_percentual: "10%",
                frequencia_relativa_percentual: "10%",
              },
              {
                faixa: "501-1000",
                frequencia: 500,
                frequencia_acumulada: 1500,
                frequencia_acumulada_percentual: "15%",
                frequencia_relativa_percentual: "5%",
              },
              {
                faixa: "1001-1500",
                frequencia: 300,
                frequencia_acumulada: 1800,
                frequencia_acumulada_percentual: "18%",
                frequencia_relativa_percentual: "3%",
              },
              {
                faixa: "1501-2000",
                frequencia: 200,
                frequencia_acumulada: 2000,
                frequencia_acumulada_percentual: "20%",
                frequencia_relativa_percentual: "2%",
              },
              {
                faixa: "2001-5000",
                frequencia: 150,
                frequencia_acumulada: 2150,
                frequencia_acumulada_percentual: "21.5%",
                frequencia_relativa_percentual: "1.5%",
              },
              {
                faixa: "5001-10000",
                frequencia: 100,
                frequencia_acumulada: 2250,
                frequencia_acumulada_percentual: "22.5%",
                frequencia_relativa_percentual: "1%",
              },
              {
                faixa: "10001-15000",
                frequencia: 75,
                frequencia_acumulada: 2325,
                frequencia_acumulada_percentual: "23.25%",
                frequencia_relativa_percentual: "0.75%",
              },
              {
                faixa: "15001-19000",
                frequencia: 60,
                frequencia_acumulada: 2385,
                frequencia_acumulada_percentual: "23.85%",
                frequencia_relativa_percentual: "0.6% ",
              },
              {
                faixa: "19001-20000",
                frequencia: 50,
                frequencia_acumulada: 2435,
                frequencia_acumulada_percentual: "24.35%",
                frequencia_relativa_percentual: "0.5%",
              },
            ]}
            columns={distFreqColumns}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Cancelamento por Substituição</CardTitle>
              <CardDescription>
                Total de notas fiscais canceladas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold text-gray-800">
                5.000
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                Cancelamento por Deferido por Análise Fiscal
              </CardTitle>
              <CardDescription>
                Total de notas fiscais canceladas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold text-gray-800">
                5.000
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Cancelamento por Ofício</CardTitle>
              <CardDescription>
                Total de notas fiscais canceladas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold text-gray-800">
                5.000
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Cancelamento - Outros</CardTitle>
              <CardDescription>
                Total de notas fiscais canceladas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold text-gray-800">
                5.000
              </span>
            </CardContent>
          </Card>
        </div>
      </div>
    </TabsContent>
  );
};

export default VisaoGeral;
