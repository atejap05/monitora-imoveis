import { create } from "zustand";
import { Consulta } from "@/dashboards/Consultas/@types";

type FormData = {
  ni: string;
  anos: string[];
};

type ConsultasState = {
  consulta: Consulta; // Mantido como Consulta (NfseData[])
  isPending: boolean;
  formData: FormData | null;
  setFormData: (data: FormData) => void;
  setNfseData: (data: Consulta) => void; // Mantido como esperando Consulta (NfseData[])
  setIsPending: (status: boolean) => void;
};

export const useConsultasState = create<ConsultasState>(set => ({
  consulta: [], // Alterado: Inicializado como um array vazio
  formData: { ni: "", anos: [] },
  isPending: false,
  setFormData: data => set({ formData: data }),
  setNfseData: data => set({ consulta: data }), // Correto: data é NfseData[]
  setIsPending: status => set({ isPending: status }),
}));
