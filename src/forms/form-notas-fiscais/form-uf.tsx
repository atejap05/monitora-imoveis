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
import { selectUFOptions, YEARS } from "@/lib/utils";

const FormUFSchema = z.object({
  uf: z.string().nonempty("UF é obrigatório"),
  anos: z.array(z.string()).optional(),
});

export const FormUF = ({
  onSubmit,
  isFormPending,
}: {
  onSubmit: (data: z.infer<typeof FormUFSchema>) => void;
  isFormPending: boolean;
}) => {
  const form = useForm<z.infer<typeof FormUFSchema>>({
    resolver: zodResolver(FormUFSchema),
    defaultValues: {
      uf: "",
      anos: [],
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
          name="uf"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-green font-bold">UF</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="bg-white">
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
          name="anos"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-green font-bold">Ano</FormLabel>
              <FormControl>
                <MultiSelect
                  placeholder="Selecinone o(s) ano(s)"
                  className="bg-white"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  options={YEARS.map(year => ({
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
          <Button type="submit" disabled={isFormPending}>
            {isFormPending ? "Aplicando..." : "Aplicar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
