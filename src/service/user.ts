import type { DadosUsuarioAutenticado } from "@/@types";

//////////// Fetching Dados do Usuário Autenticado //////////
export const getDadosUsuarioAutenticado =
  async (): Promise<DadosUsuarioAutenticado> => {
    const win = window as unknown as Window & {
      runScript: (
        a: string,
        b: string
      ) => Promise<{ nome: string; cpf: string }>;
    };

    //@ts-ignore
    const resposta = await win.get_dados_usuario_autenticado();
    return resposta as DadosUsuarioAutenticado;
  };
