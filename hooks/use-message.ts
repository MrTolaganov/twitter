import { create } from 'zustand'

type Store = {
  hasMessage: boolean
  setHasMessage: (hasMessage: boolean) => void
}

export const useMessage = create<Store>(set => ({
  hasMessage: false,
  setHasMessage: hasMessage => set({ hasMessage }),
}))
