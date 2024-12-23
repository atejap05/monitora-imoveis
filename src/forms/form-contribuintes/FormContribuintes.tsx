/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  // FormDescription,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { findUFCodigo, selectUFOptions } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";

//////////// FormSchema ////////////
const FormSchema = z.object({
  uf: z.string().nonempty("UF é obrigatório"),
  ano: z.array(z.string()).optional(),
  municipio: z.string().nonempty("Município é obrigatório"),
  regiao: z
    .enum(["norte", "nordeste", "centro-oeste", "sudeste", "sul", "todos"])
    .default("todos"),
  filter_option: z
    .enum(["uf", "municipio", "regiao", "todos"])
    .default("todos"),
});

const fecthMunicipioByUf = async (uf: string) => {
  const ufCodigo = await findUFCodigo(uf);
  const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufCodigo}/municipios`;
  const response = await fetch(url);
  return await response.json();
};

export function FormContribuintes() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      filter_option: "todos",
      uf: "",
      municipio: "",
      regiao: "todos",
    },
  });

  const result = useQuery({
    queryKey: ["fecth-municipios", form.watch("uf")],
    queryFn: () => fecthMunicipioByUf(form.watch("uf")),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(JSON.stringify(data, null, 2));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="filter_option"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-green font-bold">
                Filtrar por:
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-2 gap-4"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="todos" />
                    </FormControl>
                    <FormLabel className="font-normal">Todos</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="uf" />
                    </FormControl>
                    <FormLabel className="font-normal">UF</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="municipio" />
                    </FormControl>
                    <FormLabel className="font-normal">Município</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="regiao" />
                    </FormControl>
                    <FormLabel className="font-normal">Região</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
        <Separator />
        {form.watch("filter_option") === "uf" && (
          <FormField
            control={form.control}
            name="uf"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-green font-bold">UF</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
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
        )}
        {form.watch("filter_option") === "municipio" && (
          <>
            <FormField
              control={form.control}
              name="uf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-green font-bold">UF</FormLabel>
                  <Select
                    onValueChange={value => {
                      field.onChange(value);
                      result.refetch();
                    }}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
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
                  <FormLabel className="text-green font-bold">
                    Município
                  </FormLabel>
                  <Select
                    disabled={result.isLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o Município">
                        {result.isLoading
                          ? "Carregando..."
                          : field.value || "Selecione o Município"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {result.data?.map((municipio: any) => (
                        <SelectItem key={municipio.id} value={municipio.nome}>
                          {municipio.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        {form.watch("filter_option") === "regiao" && (
          <FormField
            control={form.control}
            name="regiao"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-green font-bold">Região</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma Região" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="norte">Norte</SelectItem>
                    <SelectItem value="nordeste">Nordeste</SelectItem>
                    <SelectItem value="centro-oeste">Centro-Oeste</SelectItem>
                    <SelectItem value="sudeste">Sudeste</SelectItem>
                    <SelectItem value="sul">Sul</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
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
          <Button type="submit">Aplicar</Button>
        </div>
      </form>
    </Form>
  );
}
