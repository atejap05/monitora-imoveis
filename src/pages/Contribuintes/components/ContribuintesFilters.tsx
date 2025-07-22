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
import { useContribuintesFiltersState } from "@/state/contribuintesFiltersState";
import { Button } from "@/components/ui/button";
import { TContribuintesFilter } from "@/@types";
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
type TFilterForm = z.infer<typeof FiltrosSchema>;

export const ContribuintesFilters = () => {
    const { filters, submitFilters, isLoading } = useContribuintesFiltersState();

    const form = useForm<TFilterForm>({
        resolver: zodResolver(FiltrosSchema),
        // Mapeamento explícito e seguro dos valores do estado global para formulário
        defaultValues: {
            filtro: filters.filtro,
            anos: filters.anos.map(String),
            valorMin: filters.valorMin?.toString() ?? null,
            valorMax: filters.valorMax?.toString() ?? null,
            uf: filters.uf,
            municipio: filters.municipio?.toString() ?? null,
            regiao: filters.regiao,
            contribuintes: filters.contribuintes.map(String),
        },
    });

    const selectedOption = form.watch("filtro");

    function onSubmit(data: TFilterForm) {
        const payload: TContribuintesFilter = {
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
            municipio: data.municipio ? Number(data.municipio) : null,
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

                {/* Filtros de Tipo de Contribuinte e Valor */}
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