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
import { useVolumetriaFiltersState } from "@/state/volumetriaFiltersState";
import { Button } from "@/components/ui/button";
import { VolumetriaParams } from "@/@types";
import { Separator } from "@/components/ui/separator";

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

type TFilterForm = z.infer<typeof FiltrosSchema>;

export const VolumetriaFilters = () => {
  const { filters, submitFilters, isLoading } = useVolumetriaFiltersState();

  const form = useForm<TFilterForm>({
    resolver: zodResolver(FiltrosSchema),
    defaultValues: {
      filtro: filters.filtro || "todos",
      anos: (filters.anos || []).map(String),
      valorMin: filters.valorMin?.toString() ?? null,
      valorMax: filters.valorMax?.toString() ?? null,
      uf: filters.uf || null,
      municipio: filters.municipio?.toString() ?? null,
      regiao: filters.regiao || null,
      contribuintes: ["1", "2", "3"],
    },
  });

  // Sempre que os filtros globais mudarem, reseta o formulário
  useEffect(() => {
    form.reset({
      filtro: filters.filtro || "todos",
      anos: (filters.anos || []).map(String),
      valorMin: filters.valorMin?.toString() ?? null,
      valorMax: filters.valorMax?.toString() ?? null,
      uf: filters.uf || null,
      municipio: filters.municipio?.toString() ?? null,
      regiao: filters.regiao || null,
      contribuintes: ["1", "2", "3"],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const selectedOption = form.watch("filtro");

  function onSubmit(data: TFilterForm) {
    const payload: VolumetriaParams = {
      filtro:
        (data.filtro as "uf" | "regiao" | "municipio" | "todos" | undefined) ||
        "todos",
      anos: Array.isArray(data.anos)
        ? data.anos
            .filter(a => a !== undefined && a !== null && a !== "")
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
      valorMin: data.valorMin ? Number(data.valorMin) : undefined,
      valorMax: data.valorMax ? Number(data.valorMax) : undefined,
      uf: data.uf || undefined,
      municipio: data.municipio ? Number(data.municipio) : undefined,
      regiao: data.regiao || undefined,
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

        {/* Filtros geográficos condicionais */}
        {selectedOption === "uf" && <FormUF />}
        {selectedOption === "municipio" && (
          <>
            <FormUF />
            <FormMunicipio />
          </>
        )}
        {selectedOption === "regiao" && <FormRegiao />}

        {/* Filtro de ano sempre visível quando uma opção está selecionada */}
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
