import { create } from "zustand";
import type { TConsultaNFSeTotais } from "@/@types";

type NotasFiscaisState = {
  consultaNFSeTotais: TConsultaNFSeTotais;
  isPending: boolean;
  setConsultaNFSeTotais: (data: TConsultaNFSeTotais) => void;
  setConsultaNFSeTotaisIsPending: (status: boolean) => void;
};

export const useNotasFiscaisState = create<NotasFiscaisState>(set => ({
  consultaNFSeTotais: {},
  isPending: false,
  setConsultaNFSeTotais: data => set({ consultaNFSeTotais: data }),
  setConsultaNFSeTotaisIsPending: status => set({ isPending: status }),
}));
