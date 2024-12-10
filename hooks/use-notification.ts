import { create } from 'zustand'

type Store = {
  hasNotification: boolean
  setHasNotification: (hasNotification: boolean) => void
}

export const useNotification = create<Store>(set => ({
  hasNotification: false,
  setHasNotification: hasNotification => set({ hasNotification }),
}))
