import { z } from "zod";

export const FormSchema = z.object({
  ni: z.string().optional(),
  // .nonempty("CPF ou CNPJ é obrigatório")
  // .refine(value => {
  //   const cpfCnpjRegex =
  //     /(^\d{3}\.\d{3}\.\d{3}-\d{2}$)|(^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$)|(^\d{11}$)|(^\d{14}$)/;
  //   return cpfCnpjRegex.test(value);
  // }, "CPF ou CNPJ inválido"),
  ano: z.array(z.string()).optional(),
});
