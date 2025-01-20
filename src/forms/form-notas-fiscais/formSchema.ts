import { z } from "zod";

export const FormSchema = z.object({
  uf: z.string().nonempty("UF é obrigatório"),
  ano: z.array(z.string()).optional(),
  municipio: z.string().nonempty("Município é obrigatório"),
  regiao: z
    .enum(["norte", "nordeste", "centro-oeste", "sudeste", "sul", "todos"])
    .default("todos"),
  filter_option: z
    .enum(["uf", "municipio", "regiao", "todos"])
    .default("todos"),
});
