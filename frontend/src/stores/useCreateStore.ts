import { create } from 'zustand'
import type { RouteFormInput, MockUploadResult } from '#/lib/api'
import type { FieldNode } from '#/lib/field-builder'
import { jsonToFieldNodes } from '#/lib/field-builder'
import { uploadMock } from '#/lib/api'
import { toast } from 'sonner'

export const emptyRoute = (): RouteFormInput => ({
  method: 'GET',
  path: '',
  status: 200,
  delay: 0,
  body: '',
  authType: 'NONE',
  expectedToken: '',
})

interface CreateState {
  routes: RouteFormInput[]
  fieldTrees: FieldNode[][]
  expiresInHours: number
  responseModes: ('field' | 'json')[]
  result: MockUploadResult | null
  submitting: boolean

  updateRoute: (i: number, field: keyof RouteFormInput, value: string | number) => void
  updateFieldTree: (i: number, nodes: FieldNode[]) => void
  setResponseMode: (index: number, mode: 'field' | 'json') => void
  addRoute: () => void
  cloneRoute: (i: number) => void
  removeRoute: (i: number) => void
  handleSubmit: () => Promise<void>
  resetForm: () => void
  setExpiresInHours: (hours: number) => void
}

function saveMockId(id: string) {
  const ids: string[] = (() => {
    try {
      return JSON.parse(localStorage.getItem('quickroute-mock-ids') || '[]')
    } catch {
      return []
    }
  })().filter((x: string) => x !== id)
  ids.unshift(id)
  localStorage.setItem('quickroute-mock-ids', JSON.stringify(ids.slice(0, 20)))
}

export const useCreateStore = create<CreateState>((set, get) => ({
  routes: [emptyRoute()],
  fieldTrees: [[]],
  expiresInHours: 168,
  responseModes: ['field'],
  result: null,
  submitting: false,

  setExpiresInHours: (hours) => set({ expiresInHours: hours }),

  updateRoute: (i, field, value) => {
    set((state) => {
      const next = state.routes.map((r, j) =>
        j === i ? { ...r, [field]: value } : r,
      )
      return { routes: next }
    })
  },

  updateFieldTree: (i, nodes) => {
    set((state) => {
      const next = [...state.fieldTrees]
      next[i] = nodes
      return { fieldTrees: next }
    })
  },

  setResponseMode: (index, mode) => {
    if (mode === 'json') {
      set((state) => {
        const next = [...state.responseModes]
        next[index] = 'json'
        return { responseModes: next }
      })
      return
    }
    const state = get()
    const body = state.routes[index].body
    if (!body.trim()) {
      state.updateFieldTree(index, [])
      set((s) => {
        const next = [...s.responseModes]
        next[index] = 'field'
        return { responseModes: next }
      })
      return
    }
    try {
      const nodes = jsonToFieldNodes(body)
      state.updateFieldTree(index, nodes)
      set((s) => {
        const next = [...s.responseModes]
        next[index] = 'field'
        return { responseModes: next }
      })
    } catch {
      toast.error('Invalid JSON — cannot switch to Field Builder')
    }
  },

  addRoute: () => {
    set((state) => ({
      routes: [...state.routes, emptyRoute()],
      fieldTrees: [...state.fieldTrees, []],
      responseModes: [...state.responseModes, 'field'],
    }))
  },

  cloneRoute: (i) => {
    set((state) => {
      const nextRoutes = [...state.routes]
      nextRoutes.splice(i + 1, 0, { ...state.routes[i] })
      
      const nextFieldTrees = [...state.fieldTrees]
      nextFieldTrees.splice(i + 1, 0, JSON.parse(JSON.stringify(state.fieldTrees[i])))
      
      const nextResponseModes = [...state.responseModes]
      nextResponseModes.splice(i + 1, 0, state.responseModes[i])

      return {
        routes: nextRoutes,
        fieldTrees: nextFieldTrees,
        responseModes: nextResponseModes,
      }
    })
    toast.success('Route cloned!')
  },

  removeRoute: (i) => {
    set((state) => {
      if (state.routes.length <= 1) return state
      return {
        routes: state.routes.filter((_, j) => j !== i),
        fieldTrees: state.fieldTrees.filter((_, j) => j !== i),
        responseModes: state.responseModes.filter((_, j) => j !== i),
      }
    })
  },

  handleSubmit: async () => {
    const state = get()
    const errors: string[] = []
    state.routes.forEach((r, i) => {
      if (!r.path.trim()) errors.push(`Route ${i + 1}: path is required`)
      if (r.status < 100 || r.status > 599)
        errors.push(`Route ${i + 1}: status must be 100-599`)
      if (r.delay < 0) errors.push(`Route ${i + 1}: delay must be >= 0`)
    })

    if (errors.length > 0) {
      errors.forEach((e) => toast.error(e))
      return
    }

    set({ submitting: true })
    try {
      const res = await uploadMock(state.routes, state.expiresInHours)
      set({ result: res })
      saveMockId(res.mockId)
      toast.success('Mock created!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      set({ submitting: false })
    }
  },

  resetForm: () => {
    set({
      routes: [emptyRoute()],
      fieldTrees: [[]],
      responseModes: ['field'],
      result: null,
    })
  }
}))
