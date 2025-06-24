import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multi-select";
import { YEARS } from "@/lib/utils";

export const FormAno = () => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name="anos"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-green font-bold">Ano</FormLabel>
          <MultiSelect
            placeholder="Selecinone o(s) ano(s)"
            className="bg-white"
            onValueChange={field.onChange}
            value={field.value}
            options={YEARS.map(year => ({
              label: year,
              value: year,
            }))}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
