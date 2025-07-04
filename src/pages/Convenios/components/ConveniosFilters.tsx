import React from "react";
import { useConveniosFiltersState } from "@/state/conveniosFiltersState";
import { selectUFOptions } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const regioesGeograficas = [
  { value: "N", label: "Norte" },
  { value: "NE", label: "Nordeste" },
  { value: "CO", label: "Centro-Oeste" },
  { value: "SE", label: "Sudeste" },
  { value: "S", label: "Sul" },
];

const regioesFiscais = [
  { value: "RF01", label: "1ª RF" },
  { value: "RF02", label: "2ª RF" },
  { value: "RF03", label: "3ª RF" },
  { value: "RF04", label: "4ª RF" },
  { value: "RF05", label: "5ª RF" },
  { value: "RF06", label: "6ª RF" },
  { value: "RF07", label: "7ª RF" },
  { value: "RF08", label: "8ª RF" },
  { value: "RF09", label: "9ª RF" },
  { value: "RF10", label: "10ª RF" },
];

const statusOptions = [
  { value: "Conveniado Ativo", label: "Conveniado Ativo" },
  { value: "Conveniado - Nao Ativo", label: "Conveniado - Não Ativo" },
  { value: "Nao Conveniado", label: "Não Conveniado" },
  { value: "Erro na Consulta", label: "Erro na Consulta" },
];

interface ConveniosFiltersProps {
  isLoading: boolean;
}

export const ConveniosFilters: React.FC<ConveniosFiltersProps> = ({
  isLoading,
}) => {
  const {
    regiaoGeografica,
    setRegiaoGeografica,
    regiaoFiscal,
    setRegiaoFiscal,
    status,
    setStatus,
    uf,
    setUf,
  } = useConveniosFiltersState();

  return (
    <div className="p-4 flex flex-col gap-4">
      <div>
        <Label className="mb-1 block text-green font-bold">
          Região Geográfica
        </Label>
        <Select
          value={regiaoGeografica ?? "__all__"}
          onValueChange={v => setRegiaoGeografica(v === "__all__" ? null : v)}
          disabled={isLoading}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Região Geográfica" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todas</SelectItem>
            {regioesGeograficas.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="mb-1 block text-green font-bold">Região Fiscal</Label>
        <Select
          value={regiaoFiscal ?? "__all__"}
          onValueChange={v => setRegiaoFiscal(v === "__all__" ? null : v)}
          disabled={isLoading}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Região Fiscal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todas</SelectItem>
            {regioesFiscais.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="mb-1 block text-green font-bold">
          Status do Convênio
        </Label>
        <Select
          value={status ?? "__all__"}
          onValueChange={v => setStatus(v === "__all__" ? null : v)}
          disabled={isLoading}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Status do Convênio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todos</SelectItem>
            {statusOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="mb-1 block text-green font-bold">UF</Label>
        <Select
          value={uf ?? "__all__"}
          onValueChange={v => setUf(v === "__all__" ? null : v)}
          disabled={isLoading}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="UF" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todas</SelectItem>
            {selectUFOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
