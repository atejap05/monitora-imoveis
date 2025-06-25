import { useFormContext } from "react-hook-form";
import {
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
import { selectUFOptions } from "@/lib/utils";

export const FormUF = () => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name="uf"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-green font-bold">UF</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Selecione um Estado">
                {field.value ? field.value : "Selecione um Estado"}
              </SelectValue>
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
  );
};
