import { create } from "zustand";
import { fetchContribuintes } from "@/service";
import type { Consulta } from "@/pages/Consultas/components/@types";

interface FormData {
  ni: string;
  anos: string[];
}

interface ConsultasState {
  formData: FormData;
  submittedFormData: FormData | null;
  consulta: Consulta;
  isLoading: boolean;
  error: string | null;
  setFormData: (formData: FormData) => void;
  submitConsulta: (formData: FormData) => Promise<void>;
  setConsulta: (consulta: Consulta) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const initialFormData: FormData = { ni: "", anos: [] };

export const useConsultasState = create<ConsultasState>(set => ({
  formData: initialFormData,
  submittedFormData: null,
  consulta: [],
  isLoading: false,
  error: null,
  setFormData: formData => set({ formData }),
  setConsulta: consulta => set({ consulta }),
  setLoading: isLoading => set({ isLoading }),
  setError: error => set({ error }),
  submitConsulta: async formData => {
    set({ isLoading: true, error: null, submittedFormData: formData });
    try {
      const data = await fetchContribuintes({
        ni: formData.ni,
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
