import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { FormCNPJ } from "@/filters/FormCNPJ";
import { FormAno } from "@/filters/FormAno";

const schema = z.object({
  ni: z.string().min(14, "CNPJ inválido").max(18, "CNPJ inválido"),
  anos: z.array(z.string()).min(1, "Selecione pelo menos um ano"),
});

type FormConsultasValues = z.infer<typeof schema>;

interface FormConsultasProps {
  onSubmit: (ni: string, anos: string[]) => void;
  isPending: boolean;
}

export function FormConsultas({ onSubmit, isPending }: FormConsultasProps) {
  const methods = useForm<FormConsultasValues>({
    resolver: zodResolver(schema),
    defaultValues: { ni: "", anos: [] },
  });

  return (
    <FormProvider {...methods}>
      <h2 className="text-lg font-bold text-green my-4">Consulta por CNPJ</h2>
      <form
        onSubmit={methods.handleSubmit(data => {
          console.log("[FormConsultas] submit", data);
          onSubmit(data.ni, data.anos);
        })}
        className="flex flex-col gap-4 "
      >
        <FormCNPJ />
        <FormAno />
        <Button
          type="submit"
          disabled={isPending}
          onClick={() => console.log("[FormConsultas] Botão Consultar clicado")}
        >
          {isPending ? "Consultando..." : "Consultar"}
        </Button>
      </form>
    </FormProvider>
  );
}
