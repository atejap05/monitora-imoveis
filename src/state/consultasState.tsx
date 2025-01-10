import { create } from "zustand";
import { Consulta } from "@/dashboards/Consultas/@types";

///////////// Years Array ////////////// TODO: Mover para um arquivo utils

type FormData = {
  ni: string;
  anos: string[];
};

type ConsultasState = {
  consulta: Consulta;
  isPending: boolean;
  formData: FormData | null;
  setFormData: (data: FormData) => void;
  setNfseData: (data: Consulta) => void;
  setIsPending: (status: boolean) => void;
};

export const useConsultasState = create<ConsultasState>(set => ({
  consulta: { consulta: [] },
  formData: { ni: "", anos: [] },
  isPending: false,
  setFormData: data => set({ formData: data }),
  setNfseData: data => set({ consulta: data }),
  setIsPending: status => set({ isPending: status }),
}));
