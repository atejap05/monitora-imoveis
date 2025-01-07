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
import { type NfseData } from "./@types";

const fetchContribuintes = async (ni: string) => {
  const response = await fetch(
    `https://localhost:8443/ctx/once/PainelNFSe/consulta_nfse_by_cpf_cnpj?ni=${ni}`
  );
  if (!response.ok) {
    throw new Error("Erro ao buscar contribuintes");
  }
  return response.json() as Promise<NfseData[]>;
};

export const FormConsultas = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ni: "",
    },
  });

  const { mutate } = useMutation<
    NfseData[],
    unknown,
    string,
    { status: number }
  >({
    mutationFn: fetchContribuintes,
    onSuccess: data => {
      console.log(data);
    },
  });

  const onSubmit = async (FormData: z.infer<typeof FormSchema>) => {
    console.log(FormData);

    try {
      if (FormData.ni) {
        const res = mutate(FormData.ni);
        console.log(res);
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
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  options={[
                    { label: "2022", value: "2022" },
                    { label: "2023", value: "2023" },
                    { label: "2024", value: "2024" },
                  ]}
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
