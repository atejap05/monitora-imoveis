import { create } from "zustand";
import { Consulta } from "@/dashboards/Consultas/@types";

type ConsultasState = {
  consulta: Consulta;
  setNfseData: (data: Consulta) => void;
};

export const useConsultasState = create<ConsultasState>(set => ({
  consulta: { consulta: [] },
  setNfseData: data => set({ consulta: data }),
}));
