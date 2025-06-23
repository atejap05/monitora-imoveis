import { useFormContext } from "react-hook-form";
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multi-select";
import { YEARS } from "@/lib/utils";

const FormAnoSchema = z.object({
  anos: z.array(z.string()).optional(),
  contribuintes: z.array(z.string()).optional(),
  valorMin: z.string().optional(),
  valorMax: z.string().optional(),
});

export const FormAno = () => {
  // Usa o contexto do formulário pai
  const form = useFormContext<z.infer<typeof FormAnoSchema>>();

  return (
    <div className="flex flex-col gap-3">
      {/* Campo Ano */}
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
    </div>
  );
};
