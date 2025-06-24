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
  valorMin: z.string().nullable().optional(),
  valorMax: z.string().nullable().optional(),
  uf: z.string().nullable().optional(),
  municipio: z.string().nullable().optional(),
  regiao: z.string().nullable().optional(),
});

export const VisaoGeralFilters = () => {
  const { selectedOption, setSelectedOption, handleSubmitFilters, isLoading } =
    useVisaoGeralFilters();

  const form = useForm({
    resolver: zodResolver(FiltrosSchema),
    defaultValues: {
      anos: [],
      contribuintes: ["1", "2", "3"],
      valorMin: "", // string vazia para campos opcionais de input number
      valorMax: "",
      uf: null,
      municipio: null,
      regiao: null,
    },
  });

  function onSubmit(data: any) {
    const payload = {
      ...data,
      valorMin: data.valorMin ? data.valorMin : null,
      valorMax: data.valorMax ? data.valorMax : null,
      contribuintes: data.contribuintes ?? ["1", "2", "3"],
      uf: data.uf ? data.uf : null,
      municipio: data.municipio ? data.municipio : null,
      regiao: data.regiao ? data.regiao : null,
    };
    console.log("[VisaoGeral] Filtros enviados ao backend (submit):", payload);
    handleSubmitFilters(payload);
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
        {/* Filtros geográficos e de ano condicionais */}
        {selectedOption === "uf" && <FormUF />}
        {selectedOption === "municipio" && (
          <>
            <FormUF />
            <FormMunicipio />
          </>
        )}
        {selectedOption === "regiao" && <FormRegiao />}
        {selectedOption === "todos" && <FormAno />}
        <Separator />
        {/* Filtros globais sempre visíveis */}
        <FormContribuinteValor />
        <div className="flex justify-center mt-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Aplicando..." : "Aplicar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
