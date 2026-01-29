import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";


const schema = z.object({
  chave: z
    .string()
    .length(50, "Chave de acesso deve ter exatamente 50 caracteres")
    .regex(/^\d+$/, "Chave deve conter apenas números"),
});

type FormConsultaChaveValues = z.infer<typeof schema>;

interface FormConsultaChaveProps {
  onSubmit: (chave: string) => void;
  isPending: boolean;
}

export function FormConsultaChave({
  onSubmit,
  isPending,
}: FormConsultaChaveProps) {
  const methods = useForm<FormConsultaChaveValues>({
    resolver: zodResolver(schema),
    defaultValues: { chave: "" },
  });

  return (
    <FormProvider {...methods}>
      <h2 className="text-lg font-bold text-green my-4">
        Consulta por Chave de Acesso
      </h2>
      <form
        onSubmit={methods.handleSubmit((data) => {
          onSubmit(data.chave);
        })}
        className="flex flex-col gap-4"
      >
        <FormField
          control={methods.control}
          name="chave"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-green font-bold">
                Chave de Acesso
              </FormLabel>
              <Input
                {...field}
                placeholder="Digite a chave de acesso"
                maxLength={50}
                autoComplete="off"
                className="bg-white font-mono"
                onChange={(e) => {
                  // Permite apenas números
                  const value = e.target.value.replace(/\D/g, "");
                  field.onChange(value);
                }}
              />
              <FormMessage />
              <p className="text-sm text-muted-foreground">
                {field.value.length}/50 caracteres
              </p>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Consultando..." : "Consultar"}
        </Button>
      </form>
    </FormProvider>
  );
}
