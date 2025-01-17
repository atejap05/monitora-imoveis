import { FormSchema } from "./FormSchema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InfoIcon, FilterXIcon, SearchIcon } from "lucide-react";
import BasicTooltip from "@/components/BasicTooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { MultiSelect } from "@/components/ui/multi-select";
import { useMutation } from "@tanstack/react-query";
import { type Consulta } from "../../dashboards/Consultas/@types";
import { useConsultasState } from "@/state/consultasState";
import { years } from "../../lib/utils";
import { useEffect } from "react";

const fetchContribuintes = async (ni: string, anos: Array<string>) => {
  const response = await fetch(
    `https://localhost:8443/ctx/once/PainelNFSe/consulta_nfse_by_cpf_cnpj?ni=${ni}&anos=${anos.join(
      ","
    )}`
  );
  if (!response.ok) {
    throw new Error("Erro ao buscar contribuintes");
  }
  return response.json() as Promise<Consulta>;
};

export const FormConsultas = () => {
  const currentYear = new Date().getFullYear();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ni: "",
      anos: [String(currentYear - 1)],
    },
  });

  const { setNfseData, setFormData, setIsPending } = useConsultasState();

  const { mutate, isPending } = useMutation<
    Consulta,
    unknown,
    { ni: string; anos: Array<string> },
    { status: number }
  >({
    mutationFn: ({ ni, anos }) => fetchContribuintes(ni, anos),
    onSuccess: data => {
      setNfseData(data);
    },
    onError: error => {
      console.error(error);
    },
  });

  useEffect(() => setIsPending(isPending), [isPending]);

  const onSubmit = async (FormData: z.infer<typeof FormSchema>) => {
    // Limpa os dados da consulta
    setNfseData({ consulta: [] });

    // Se não for passado anos, pega os anos de 2022 ate o corrente ano
    const anos =
      FormData.anos && FormData.anos.length > 0 ? FormData.anos : years;

    try {
      if (FormData.ni) {
        console.log(FormData);
        setFormData({ ni: FormData.ni, anos: anos });
        mutate({ ni: FormData.ni, anos: anos }); // Se ano foi selecionado o ano, passa todos os anos de 2022 ate agora
      } else {
        console.error("NI is undefined");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="ni"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-green font-bold" htmlFor="ni">
                <BasicTooltip
                  label={
                    <span className="flex items-center gap-1">
                      CNPJ <InfoIcon size={12} className="text-green" />
                    </span>
                  }
                  content="CNPJ no formato XX.XXX.XXX/XXXX-XX ou XXXXXXXXXXXXXX."
                />
              </FormLabel>
              <Input
                {...field}
                placeholder="Informe o CNPJ"
                id="ni"
                className="bg-white"
              />
              <FormMessage {...field} />
              <FormDescription>CNPJ raiz ou completo.</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="anos"
          render={({ field }) => (
            <FormItem>
              <FormLabel className=" text-green font-bold">
                <BasicTooltip
                  label={
                    <span className="flex items-center gap-1">
                      Ano <InfoIcon size={12} className="text-green" />
                    </span>
                  }
                  content="Se nenhum ano for selecionado, a consulta levará em consideração todos os anos de 2022 até o corrente ano."
                />
              </FormLabel>
              <FormControl>
                <MultiSelect
                  className="bg-white hover:bg-white"
                  placeholder="Selecione o(s) ano(s)"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  options={
                    years.map((year: string) => ({
                      label: year,
                      value: year,
                    })) ?? []
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex-between">
          <FormControl>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <p>
                  Carregando{" "}
                  <span className="animate-pulse font-semibold">...</span>
                </p>
              ) : (
                <>
                  <SearchIcon size={16} className="text-white " />
                  <span>Consultar</span>
                </>
              )}
            </Button>
          </FormControl>
          <FormControl>
            <Button
              type="button"
              onClick={() => {
                form.reset;
                setNfseData({ consulta: [] });
                setFormData({ ni: "", anos: [] });
                form.setValue("ni", "");
                form.setValue("anos", []);
              }}
              disabled={isPending}
              variant="outline"
            >
              <FilterXIcon size={16} className="text-green" />
              Limpar
            </Button>
          </FormControl>
        </div>
      </form>
    </Form>
  );
};
