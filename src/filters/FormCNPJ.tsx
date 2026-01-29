import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const FormCNPJ = () => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name="ni"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-green font-bold">CNPJ</FormLabel>
          <Input
            {...field}
            placeholder="Digite o CNPJ"
            maxLength={18}
            autoComplete="off"
            className="bg-white"
          />
          <FormMessage />
          <p className="text-xs text-muted-foreground">
            Aceita formato com ou sem pontuação
          </p>
        </FormItem>
      )}
    />
  );
};
