import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { years } from "@/lib/utils";

const FormRegiaoSchema = z.object({
  regiao: z.enum(["N", "NE", "CO", "SE", "S"]).default("SE"),
  ano: z.array(z.string()).optional(),
});

export const FormRegiao = ({
  onSubmit,
}: {
  onSubmit: (data: z.infer<typeof FormRegiaoSchema>) => void;
}) => {
  const form = useForm<z.infer<typeof FormRegiaoSchema>>({
    resolver: zodResolver(FormRegiaoSchema),
    defaultValues: {
      regiao: "SE",
      ano: [],
    },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
        <FormField
          control={form.control}
          name="regiao"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-green font-bold">Região</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Selecione uma Região" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="N">Norte</SelectItem>
                  <SelectItem value="NE">Nordeste</SelectItem>
                  <SelectItem value="CO">Centro-Oeste</SelectItem>
                  <SelectItem value="SE">Sudeste</SelectItem>
                  <SelectItem value="S">Sul</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
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
                  options={years.map(year => ({
                    label: year,
                    value: year,
                  }))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center mt-2">
          <Button type="submit">Aplicar</Button>
        </div>
      </form>
    </Form>
  );
};
