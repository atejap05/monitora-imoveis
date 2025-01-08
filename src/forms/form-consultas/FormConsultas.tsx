import { FormSchema } from "./FormSchema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import BasicTooltip from "@/components/BasicTooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { MultiSelect } from "@/components/ui/multi-select";
import { useMutation } from "@tanstack/react-query";
import { type Consulta } from "../../dashboards/Consultas/@types";
import { useConsultasState } from "@/state/consultasState";
import { years } from "../../lib/utils";

const fetchContribuintes = async (ni: string) => {
  const response = await fetch(
    `https://localhost:8443/ctx/once/PainelNFSe/consulta_nfse_by_cpf_cnpj?ni=${ni}`
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
      ano: [String(currentYear - 1)],
    },
  });

  const { setNfseData, setFormData } = useConsultasState();

  const { mutate } = useMutation<Consulta, unknown, string, { status: number }>(
    {
      mutationFn: fetchContribuintes,
      onSuccess: data => {
        setNfseData(data);
      },
    }
  );

  const onSubmit = async (FormData: z.infer<typeof FormSchema>) => {
    try {
      if (FormData.ni) {
        setFormData({ ni: FormData.ni, ano: FormData.ano ?? [] });
        mutate(FormData.ni);
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
                  label="CPF/CNPJ"
                  content="
                    CPF no formato XXX.XXX.XXX-XX ou XXXXXXXXXXX.
                    CNPJ no formato XX.XXX.XXX/XXXX-XX ou XXXXXXXXXXXXXX.
                  "
                />
              </FormLabel>
              <Input {...field} placeholder="Informe o CPF/CNPJ" id="ni" />
              <FormMessage {...field} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ano"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-green font-bold">Ano</FormLabel>
              <FormControl>
                <MultiSelect
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
        <div className="flex justify-center">
          <FormControl>
            <Button type="submit">Consultar</Button>
          </FormControl>
        </div>
      </form>
    </Form>
  );
};
