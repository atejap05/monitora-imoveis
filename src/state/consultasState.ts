import { create } from "zustand";
import { fetchContribuintes } from "@/service/consultas";
import { normalizaCNPJ } from "@/lib/utils";
import type { Consulta, NfseData } from "@/pages/Consultas/components/@types";

interface FormData {
  ni: string;
  anos: string[];
}

type ModoConsulta = "cnpj" | "chave";

interface ConsultasState {
  // Estado existente
  formData: FormData;
  submittedFormData: FormData | null;
  consulta: Consulta;
  isLoading: boolean;
  error: string | null;

  // Novo estado para consulta por chave
  modoConsulta: ModoConsulta;
  chaveAcesso: string;
  nfseDetalhada: NfseData | null;

  // Ações existentes
  setFormData: (formData: FormData) => void;
  submitConsulta: (formData: FormData) => Promise<void>;
  setConsulta: (consulta: Consulta) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Novas ações
  setModoConsulta: (modo: ModoConsulta) => void;
  setChaveAcesso: (chave: string) => void;
  setNfseDetalhada: (nfse: NfseData | null) => void;
}

const initialFormData: FormData = { ni: "", anos: [] };

export const useConsultasState = create<ConsultasState>(set => ({
  formData: initialFormData,
  submittedFormData: null,
  consulta: [],
  isLoading: false,
  error: null,
  modoConsulta: "cnpj",
  chaveAcesso: "",
  nfseDetalhada: null,
  setFormData: formData => set({ formData }),
  setConsulta: consulta => set({ consulta }),
  setLoading: isLoading => set({ isLoading }),
  setError: error => set({ error }),
  setModoConsulta: modoConsulta => set({ modoConsulta }),
  setChaveAcesso: chaveAcesso => set({ chaveAcesso }),
  setNfseDetalhada: nfseDetalhada => set({ nfseDetalhada }),
  submitConsulta: async formData => {
    set({ isLoading: true, error: null, submittedFormData: formData });
    try {
      // Normaliza o CNPJ antes de enviar (remove formatação)
      const cnpjNormalizado = normalizaCNPJ(formData.ni);
      const data = await fetchContribuintes({
        ni: cnpjNormalizado,
        anos: formData.anos.map(Number),
      });
      set({ consulta: data, isLoading: false });
    } catch (err: any) {
      set({
        error: err?.message || "Erro ao consultar.",
        isLoading: false,
        consulta: [],
      });
    }
  },
}));
