import type { DadosUsuarioAutenticado } from "@/@types";

//////////// Fetching Dados do Usuário Autenticado //////////
export const getDadosUsuarioAutenticado =
  async (): Promise<DadosUsuarioAutenticado> => {
    const win = window as Window & {
      get_dados_usuario_autenticado?: () => Promise<DadosUsuarioAutenticado>;
    };

    //@ts-ignore
    const response = await win.get_dados_usuario_autenticado();
    return response;
  };
