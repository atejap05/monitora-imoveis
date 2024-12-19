import { create } from "zustand";

type DashboardState = {
  tabValue: string;
  setTabValue: (tabValue: DashboardState["tabValue"]) => void;
};

export const useDashboardState = create<DashboardState>(set => ({
  tabValue: "visao-geral",
  setTabValue: tabValue => set({ tabValue }),
}));
