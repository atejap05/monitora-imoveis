import { z } from "zod";

export const FormSchema = z.object({
  ni: z
    .string()
    .nonempty("CNPJ é obrigatório")
    .refine(value => {
      const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$|^\d{8}$/;
      return cnpjRegex.test(value);
    }, "CNPJ inválido"),
  anos: z.array(z.string()).optional(),
});
