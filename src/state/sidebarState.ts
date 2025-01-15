import { create } from "zustand";

type SideBarState = {
  isOpen: boolean;
  setSidebarState: () => void;
};

export const useSidebarState = create<SideBarState>(set => ({
  isOpen: false,
  setSidebarState: () => set(state => ({ isOpen: !state.isOpen })),
}));
