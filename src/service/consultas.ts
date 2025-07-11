import { Consulta } from "@/pages/Consultas/@types";

//////////// Fetching Contribuintes para a página de Consultas //////////////
export const fetchContribuintes = async (params: {
  ni: string;
  anos: number[];
}): Promise<Consulta> => {
  console.log("[fetchContribuintes] chamada com:", params);
  const win = window as Window & {
    runScript?: (
      a: string,
      b: string,
      c: { ni: string; anos: number[] }
    ) => Promise<Consulta>;
  };

  if (!win.runScript) {
    console.error("[fetchContribuintes] window.runScript não está disponível!");
    throw new Error("window.runScript não está disponível");
  }

  try {
    const response = await win.runScript!("", "consulta_nfse_por_cnpj", params);
    console.log("[fetchContribuintes] resposta:", response);
    return response as Consulta;
  } catch (err) {
    console.error("[fetchContribuintes] erro:", err);
    throw err;
  }
};
