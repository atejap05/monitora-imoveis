import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Hourglass } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

export const ConveniosSkeleton = () => {
  const [progressValue, setProgressValue] = useState<number>(0);

  useEffect(() => {
    // Expor função global para ser chamada via navegador.executarJavaScript
    (window as any).atualizarProgresso = (valor: number) => {
      setProgressValue(valor);
    };
    return () => {
      delete (window as any).atualizarProgresso;
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Mensagem de Carregamento Demorado */}
      <div className="flex flex-col items-center justify-center text-center p-6 bg-yellow-100/50 border border-yellow-300/60 rounded-lg">
        <Hourglass className="w-10 h-10 text-yellow-600 animate-spin" />
        {/* Barra de Progresso */}
        <div className="w-full max-w-md mt-4">
          <Progress value={progressValue} />
        </div>
        <p className="mt-4 text-lg font-semibold text-yellow-800">
          A consulta está em andamento e pode levar alguns minutos...
        </p>
        <p className="text-sm text-yellow-700">
          Estamos buscando os dados mais recentes. Por favor, aguarde.
        </p>
      </div>

      {/* Skeletons dos KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-3/5" />
              <Skeleton className="h-4 w-4/5" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Skeletons dos Gráficos */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-4/6" />
            <Skeleton className="h-4 w-5/6" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-4/6" />
            <Skeleton className="h-4 w-5/6" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>

      {/* Skeleton da Tabela */}
      <Card>
        <CardHeader>
          <Skeleton className="h-10 w-full max-w-sm" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
