import { create } from "zustand";
import { Consulta } from "@/dashboards/Consultas/@types";

///////////// Years Array ////////////// TODO: Mover para um arquivo utils

type FormData = {
  ni: string;
  ano: string[];
};

type ConsultasState = {
  consulta: Consulta;
  formData: FormData;
  setFormData: (data: FormData) => void;
  setNfseData: (data: Consulta) => void;
};

export const useConsultasState = create<ConsultasState>(set => ({
  consulta: { consulta: [] },
  formData: { ni: "", ano: [] },
  setFormData: data => set({ formData: data }),
  setNfseData: data => set({ consulta: data }),
}));
