/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import {
  FormMunicipio,
  FormRegiao,
  FormUF,
  FormAno,
  FormOptions,
  FormContribuinteValor,
} from "@/filters";
import { useVisaoGeralFiltersState } from "@/state/visaoGeralFiltersState";
import { Button } from "@/components/ui/button";
import { TFilter } from "@/@types";
import { Separator } from "@/components/ui/separator";

const FiltrosSchema = z.object({
  filtro: z.string(),
  anos: z.array(z.union([z.string(), z.number()])).optional(),
  contribuintes: z.array(z.union([z.string(), z.number()])).optional(),
  valorMin: z.string().nullable().optional(),
  valorMax: z.string().nullable().optional(),
  uf: z.string().nullable().optional(),
  municipio: z.string().nullable().optional(),
  regiao: z.string().nullable().optional(),
});

// Tipo intermediário para o formulário
interface TFilterForm {
  filtro: string;
  anos?: (string | number)[];
  contribuintes?: (string | number)[];
  valorMin?: string | null;
  valorMax?: string | null;
  uf?: string | null;
  municipio?: string | null;
  regiao?: string | null;
}

export const VisaoGeralFilters = () => {
  const { filters, submitFilters, isLoading } = useVisaoGeralFiltersState();

  const form = useForm<TFilterForm>({
    resolver: zodResolver(FiltrosSchema),
    defaultValues: {
      ...filters,
      // Converte os valores do estado para os tipos esperados pelo formulário
      anos: filters?.anos?.map(String) ?? [],
      valorMin: filters?.valorMin?.toString() ?? null,
      valorMax: filters?.valorMax?.toString() ?? null,
      // Mantém o padrão de ter todos os contribuintes selecionados ao iniciar
      contribuintes: ["1", "2", "3"], // sempre todas marcadas por padrão (como string)
    },
  });

  const selectedOption = form.watch("filtro");

  function onSubmit(data: TFilterForm) {
    console.log("Formulário submetido com os seguintes dados:", data);
    const payload: TFilter = {
      ...data,
      anos: Array.isArray(data.anos)
        ? data.anos
            .filter(
              a =>
                a !== undefined &&
                a !== null &&
                (typeof a !== "string" || a !== "")
            )
            .map(Number)
        : [],
      contribuintes: Array.isArray(data.contribuintes)
        ? Array.from(
            new Set(
              data.contribuintes
                .filter(
                  c =>
                    c !== undefined &&
                    c !== null &&
                    (typeof c !== "string" || c !== "")
                )
                .map(Number)
            )
          )
        : [],
      valorMin: data.valorMin ? Number(data.valorMin) : null,
      valorMax: data.valorMax ? Number(data.valorMax) : null,
      uf: data.uf || null,
      municipio: data.municipio || null,
      regiao: data.regiao || null,
    };
    submitFilters(payload);
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
        <FormOptions
          selectedOption={selectedOption}
          setSelectedOption={(value: string | null) => {
            if (value) {
              form.setValue("filtro", value);
            }
          }}
        />
        {/* Filtros geográficos e de ano condicionais */}
        {selectedOption === "uf" && <FormUF />}
        {selectedOption === "municipio" && (
          <>
            <FormUF />
            <FormMunicipio />
          </>
        )}
        {selectedOption === "regiao" && <FormRegiao />}

        {/* O filtro de ano agora é sempre visível, desde que uma opção de filtro esteja selecionada */}
        {selectedOption && <FormAno />}

        <Separator />
        {/* Filtros globais sempre visíveis */}
        <FormContribuinteValor />
        <div className="flex justify-center mt-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Aplicando..." : "Aplicar"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
