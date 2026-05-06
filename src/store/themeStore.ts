import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";
type Locale = "fr" | "en" | "es";

interface ThemeStore {
  theme: Theme;
  locale: Locale;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setLocale: (locale: Locale) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "light",
      locale: "fr",

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),

      setTheme: (theme) => set({ theme }),
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: "brek-theme",
    }
  )
);
