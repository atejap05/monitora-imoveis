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

export const FormRegiao = () => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name="regiao"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-green font-bold">Região</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
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
  );
};
