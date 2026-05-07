import { create } from "zustand";

interface LoadingState {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false, // Par défaut false, la Hero l'activera si besoin
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
