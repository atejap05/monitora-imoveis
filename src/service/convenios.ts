import type { MunicipioStatus } from "@/@types";

//////////////// Fetching Relatório de Convenios //////////////
export const fetchRelatrioConvenios = async (): Promise<MunicipioStatus[]> => {
  console.log(`[fetchRelatrioConvenios] Buscando relatório...`);
  try {
    const win = window as Window & {
      runScript?: (
        scriptName: string,
        functionName: string
      ) => Promise<MunicipioStatus[]>;
      atualizarProgresso?: (value: number) => void;
    };

    // Defina a função no window para que ela esteja disponível para o script.
    win.atualizarProgresso = (value: number) => {
      console.log(`Progresso da busca de convênios: ${value * 100}%`);
      // Aqui você pode, por exemplo, atualizar um estado global para mostrar o progresso na UI.
    };

    if (!win.runScript) {
      console.error(
        "[fetchRelatrioConvenios] window.runScript não disponível."
      );
      throw new Error(
        "A função 'runScript' não foi encontrada no objeto window."
      );
    }

    const response = await win.runScript(
      "", // Script name, assuming empty
      "gerar_relatorio_conveniados"
    );

    console.log("[fetchRelatrioConvenios] Dados recebidos:", response);

    if (!Array.isArray(response)) {
      console.error(
        "[fetchRelatrioConvenios] A resposta não é um array:",
        response
      );
      throw new Error("Formato de resposta inesperado do backend.");
    }

    return response;
  } catch (err) {
    console.error("[fetchRelatrioConvenios] Erro ao buscar relatório:", err);
    throw err; // Re-throw para que o React Query possa capturá-lo
  }
};
