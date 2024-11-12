import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useTokenStore = create(
  persist(
    (set) => ({
      accessToken: "",
      setAccessToken: (accessToken) => set({ accessToken }),

      refreshToken: "",
      setRefreshToken: (refreshToken) => set({ refreshToken }),

      clearToken: () => set({ accessToken: "", refreshToken: "" }),
    }),
    {
      name: "token",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useTokenStore;
