/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import {
  FormMunicipio,
  FormRegiao,
  FormUF,
  FormAno,
  FormOptions,
  FormContribuinteValor,
} from "../../../filters";
import { useVisaoGeralFilters } from "../hooks/useVisaoGeralFilters";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const FiltrosSchema = z.object({
  anos: z.array(z.string()).optional(),
  contribuintes: z.array(z.string()).optional(),
  valorMin: z.string().optional(),
  valorMax: z.string().optional(),
  uf: z.string().optional(),
  municipio: z.string().optional(),
  regiao: z.string().optional(),
});

export const VisaoGeralFilters = () => {
  const {
    selectedOption,
    setSelectedOption,
    setSelectedMunicipio,
    handleSubmitFilters,
    isLoading,
  } = useVisaoGeralFilters();

  const form = useForm({
    resolver: zodResolver(FiltrosSchema),
    defaultValues: {
      anos: [],
      contribuintes: ["1", "2", "3"], // Todas as opções selecionadas por padrão
      valorMin: undefined,
      valorMax: undefined,
      uf: undefined,
      municipio: undefined,
      regiao: undefined,
    },
  });

  function onSubmit(data: any) {
    handleSubmitFilters(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
        <FormOptions
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
        <Separator />
        {/* Filtros globais sempre visíveis */}
        <FormContribuinteValor />
        {/* Filtros geográficos e de ano condicionais */}
        <div className="mt-4">
          {selectedOption === "uf" && (
            <FormUF isFormPending={isLoading} onSubmit={onSubmit} />
          )}
          {selectedOption === "municipio" && (
            <FormMunicipio
              isFormPending={isLoading}
              onSubmit={onSubmit}
              getSelectedMunicipio={setSelectedMunicipio}
            />
          )}
          {selectedOption === "regiao" && (
            <FormRegiao isFormPending={isLoading} onSubmit={onSubmit} />
          )}
          {selectedOption === "todos" && <FormAno />}
        </div>
        <div className="flex justify-center mt-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Aplicando..." : "Aplicar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
