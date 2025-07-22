import { useFormContext, useWatch } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { fetchMunicipioByUf } from "@/service";

export const FormMunicipio = () => {
  const { control } = useFormContext();
  const uf = useWatch({ control, name: "uf" });
  const { data, isPending } = useQuery({
    queryKey: ["fetch-municipios", uf],
    queryFn: () => fetchMunicipioByUf(uf),
    enabled: !!uf,
    staleTime: Infinity,
  });

  return (
    <FormField
      control={control}
      name="municipio"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-green font-bold">Município</FormLabel>
          <Select
            disabled={!uf}
            onValueChange={field.onChange}
            value={field.value}
          >
            <SelectTrigger className="bg-white">
              <SelectValue
                placeholder={!uf ? "Aguardando UF" : "Selecione o Município"}
              >
                {!uf
                  ? "Aguardando UF"
                  : isPending
                    ? "Carregando..."
                    : data?.find((m: any) => m.id === Number(field.value))
                      ?.nome || "Selecione o Município"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {data?.map((municipio: any) => (
                <SelectItem key={municipio.id} value={municipio.id.toString()}>
                  {municipio.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
