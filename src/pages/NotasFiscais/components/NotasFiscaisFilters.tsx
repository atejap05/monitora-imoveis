/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect } from "react";
import { z } from "zod";
import {
  FormMunicipio,
  FormRegiao,
  FormUF,
  FormAno,
  FormOptions,
  FormContribuinteValor,
} from "@/filters";
import { useNotasFiscaisFiltersState } from "@/state/notasFiscaisFiltersSate";
import { Button } from "@/components/ui/button";
import { TFilter } from "@/@types";
import { Separator } from "@/components/ui/separator";

// Schema mais estrito para os dados do formulário (majoritariamente strings)
const FiltrosSchema = z.object({
  filtro: z.string(),
  anos: z.array(z.string()).optional(),
  contribuintes: z.array(z.string()).optional(),
  valorMin: z.string().nullable().optional(),
  valorMax: z.string().nullable().optional(),
  uf: z.string().nullable().optional(),
  municipio: z.string().nullable().optional(),
  regiao: z.string().nullable().optional(),
});

// O tipo do formulário é inferido diretamente do schema Zod.
// Isso garante que o formulário e a validação estejam sempre sincronizados.
type TFilterForm = z.infer<typeof FiltrosSchema>;

export const NotasFiscaisFilters = () => {
  const { filters, submitFilters, isLoading } = useNotasFiscaisFiltersState();

  const form = useForm<TFilterForm>({
    resolver: zodResolver(FiltrosSchema),
    defaultValues: {
      filtro: filters.filtro || "todos",
      anos: filters.anos.map(String),
      valorMin: filters.valorMin?.toString() ?? null,
      valorMax: filters.valorMax?.toString() ?? null,
      uf: filters.uf,
      municipio: filters.municipio?.toString() ?? null,
      regiao: filters.regiao,
      contribuintes: ["1", "2", "3"],
    },
  });

  // Sempre que os filtros globais mudarem, reseta o formulário
  useEffect(() => {
    form.reset({
      filtro: filters.filtro || "todos",
      anos: filters.anos.map(String),
      valorMin: filters.valorMin?.toString() ?? null,
      valorMax: filters.valorMax?.toString() ?? null,
      uf: filters.uf,
      municipio: filters.municipio?.toString() ?? null,
      regiao: filters.regiao,
      contribuintes: ["1", "2", "3"],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const selectedOption = form.watch("filtro");

  function onSubmit(data: TFilterForm) {
    console.log(
      "[VisaoGeralFilters] Formulário submetido (dados do formulário):",
      data
    );
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
      uf: data.uf || null, // Mantido como string
      municipio: data.municipio ? Number(data.municipio) : null, // Convertido para número
      regiao: data.regiao || null, // Mantido como string
    };
    console.log(
      "[VisaoGeralFilters] Payload submetido para o backend:",
      payload
    );
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
