import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useConsultasState } from "@/state/consultasState";
import type { ModoConsulta } from "./@types";

export function ModoConsultaToggle() {
  const { modoConsulta, setModoConsulta } = useConsultasState();

  return (
    <Tabs
      value={modoConsulta}
      onValueChange={(value) => setModoConsulta(value as ModoConsulta)}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="cnpj">Consulta por CNPJ</TabsTrigger>
        <TabsTrigger value="chave">Consulta por Chave de Acesso</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
