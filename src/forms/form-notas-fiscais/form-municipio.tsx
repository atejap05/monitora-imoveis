import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { MultiSelect } from "@/components/ui/multi-select";
import { useQuery } from "@tanstack/react-query";
import { selectUFOptions, YEARS } from "@/lib/utils";
import { fecthMunicipioByUf } from "@/service";
import type { Municipio } from "@/@types";

const FormMunicipioSchema = z.object({
  uf: z.string().nonempty("UF é obrigatório"),
  municipio: z.string().nonempty("Município é obrigatório"),
  anos: z.array(z.string()).optional(),
});

export const FormMunicipio = ({
  onSubmit,
  isFormPending,
  getSelectedMunicipio,
}: {
  onSubmit: (data: z.infer<typeof FormMunicipioSchema>) => void;
  isFormPending: boolean;
  getSelectedMunicipio: (municipio: string) => void;
}) => {
  const form = useForm<z.infer<typeof FormMunicipioSchema>>({
    resolver: zodResolver(FormMunicipioSchema),
    defaultValues: {
      uf: "",
      municipio: "",
      anos: [],
    },
  });

  const { data, isPending } = useQuery({
    queryKey: ["fecth-municipios", form.watch("uf")],
    queryFn: () => fecthMunicipioByUf(form.watch("uf")),
  });

  const getMunicipioDisplayText = (data: Municipio[], municipio: string) => {
    if (isPending) {
      return "Carregando...";
    }
    if (municipio) {
      const municipioObj = data?.find(
        (m: Municipio) => m.id === Number(municipio)
      );
      getSelectedMunicipio(municipioObj?.nome ?? "");
      return municipioObj?.nome;
    }
    return "Selecione o Município";
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
        <FormField
          control={form.control}
          name="uf"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-green font-bold">UF</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Selecione um Estado" />
                </SelectTrigger>
                <SelectContent>
                  {selectUFOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="municipio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-green font-bold">Município</FormLabel>
              <Select
                disabled={!form.watch("uf")}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Selecione o Município">
                    {getMunicipioDisplayText(data ?? [], field.value)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {data?.map((municipio: any) => (
                    <SelectItem key={municipio.id} value={municipio.id}>
                      {municipio.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="anos"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-green font-bold">Ano</FormLabel>
              <FormControl>
                <MultiSelect
                  placeholder="Selecinone o(s) ano(s)"
                  className="bg-white"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  options={YEARS.map(year => ({
                    label: year,
                    value: year,
                  }))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center mt-2">
          <Button type="submit" disabled={isFormPending}>
            {isFormPending ? "Aplicando..." : "Aplicar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
