import { create } from 'zustand'
import { getMock, deleteMock, listMocks } from '#/lib/api'
import type { MockSummary } from '#/lib/api'
import { toast } from 'sonner'

interface MocksState {
  lookupId: string
  mock: MockSummary | null
  loading: boolean
  deletingId: string | null
  allMocks: MockSummary[]
  allMocksLoading: boolean
  allMocksError: string | null
  
  setLookupId: (id: string) => void
  handleLookup: (id: string) => Promise<void>
  handleDelete: (id: string) => Promise<void>
  fetchAllMocks: () => Promise<void>
}

function loadSavedMockIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem('quickroute-mock-ids') || '[]')
  } catch {
    return []
  }
}

function removeSavedId(id: string) {
  const ids = loadSavedMockIds().filter((x) => x !== id)
  localStorage.setItem('quickroute-mock-ids', JSON.stringify(ids))
}

export const useMocksStore = create<MocksState>((set, get) => ({
  lookupId: '',
  mock: null,
  loading: false,
  deletingId: null,
  allMocks: [],
  allMocksLoading: true,
  allMocksError: null,

  setLookupId: (id) => set({ lookupId: id }),

  handleLookup: async (id: string) => {
    const trimmed = id.trim()
    if (!trimmed) return

    set({ loading: true, mock: null })
    try {
      const result = await getMock(trimmed)
      set({ mock: result })
    } catch {
      toast.error('Mock not found')
    } finally {
      set({ loading: false })
    }
  },

  handleDelete: async (idToDelete: string) => {
    set({ deletingId: idToDelete })
    try {
      await deleteMock(idToDelete)
      removeSavedId(idToDelete)
      toast.success('Mock deleted')
      
      const state = get()
      if (state.mock?.mockId === idToDelete) {
        set({ mock: null, lookupId: '' })
      }
      
      await state.fetchAllMocks()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      set({ deletingId: null })
    }
  },

  fetchAllMocks: async () => {
    set({ allMocksLoading: true, allMocksError: null })
    try {
      const result = await listMocks()
      const sorted = Object.values(result).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      set({ allMocks: sorted })
    } catch (err) {
      set({ allMocksError: err instanceof Error ? err.message : 'Failed to fetch mocks' })
    } finally {
      set({ allMocksLoading: false })
    }
  }
}))
