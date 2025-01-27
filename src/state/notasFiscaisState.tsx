import { create } from "zustand";
import type { TConsultaNFSeTotais } from "@/@types";

type SubmitedNFSeFormData = {
  filtro: string | null;
  anos: Array<number | string>;
  regiao: string | null;
  municipio: string | null;
  uf: string | null;
};

type NotasFiscaisState = {
  consultaNFSeTotais: TConsultaNFSeTotais;
  isPending: boolean;
  submitedNFSeFormData: SubmitedNFSeFormData;
  setConsultaNFSeTotais: (data: TConsultaNFSeTotais) => void;
  setConsultaNFSeTotaisIsPending: (status: boolean) => void;
  setSubmitedNFSeFormData: (data: SubmitedNFSeFormData) => void;
};

export const useNotasFiscaisState = create<NotasFiscaisState>(set => ({
  consultaNFSeTotais: {},
  isPending: false,
  submitedNFSeFormData: {
    filtro: null,
    anos: [],
    regiao: null,
    municipio: null,
    uf: null,
  },
  setConsultaNFSeTotais: data => set({ consultaNFSeTotais: data }),
  setConsultaNFSeTotaisIsPending: status => set({ isPending: status }),
  setSubmitedNFSeFormData: data => set({ submitedNFSeFormData: data }),
}));
