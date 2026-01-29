import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { FormCNPJ } from "@/filters/FormCNPJ";
import { FormAno } from "@/filters/FormAno";
import { normalizaCNPJ } from "@/lib/utils";

// Schema que aceita CNPJ formatado (18 chars) ou não formatado (14 chars)
const schema = z.object({
  ni: z
    .string()
    .min(1, "CNPJ é obrigatório")
    .refine(
      (val) => {
        const normalizado = normalizaCNPJ(val);
        // Deve ter exatamente 14 dígitos após normalização
        return normalizado.length === 14;
      },
      {
        message: "CNPJ deve ter 14 dígitos (aceita formato: 44.628.044/0001-36 ou 44628044000136)",
      }
    ),
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
        onSubmit={methods.handleSubmit((data) => {
          console.log("[FormConsultas] submit", data);
          // Normaliza o CNPJ antes de enviar (remove formatação)
          const cnpjNormalizado = normalizaCNPJ(data.ni);
          onSubmit(cnpjNormalizado, data.anos);
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
