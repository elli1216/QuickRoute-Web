import type { LucideIcon } from 'lucide-react'
import {
  Unlock,
  Sparkles,
  Zap,
  RefreshCw,
  Target,
  Timer,
  Globe,
  Package,
} from 'lucide-react'

export interface Feature {
  icon: LucideIcon
  title: string
  desc: string
}

export interface Steps {
  step: string
  title: string
  desc: string
}

export const features: Feature[] = [
  {
    icon: Unlock,
    title: 'No login required',
    desc: 'No accounts, no passwords, no email verification. Just open and use.',
  },
  {
    icon: Sparkles,
    title: 'Completely free',
    desc: 'No hidden tiers, no credit card, no usage limits. It just works.',
  },
  {
    icon: Zap,
    title: 'Instant setup',
    desc: 'Upload a mock definition and get a live endpoint in milliseconds.',
  },
  {
    icon: RefreshCw,
    title: 'Live updates',
    desc: 'Add or remove routes while the server runs — no restart needed.',
  },
  {
    icon: Target,
    title: 'Path variables',
    desc: 'Use :id style parameters in paths. They substitute into your response body.',
  },
  {
    icon: Timer,
    title: 'Simulated delays',
    desc: 'Configure response delays to test loading states and timeouts.',
  },
  {
    icon: Globe,
    title: 'Any HTTP method',
    desc: 'GET, POST, PUT, DELETE, PATCH — whatever your app needs.',
  },
  {
    icon: Package,
    title: 'JSON responses',
    desc: 'Return any JSON structure: objects, arrays, strings, or null.',
  },
]

export const steps: Steps[] = [
  {
    step: '1',
    title: 'Define your routes',
    desc: 'Choose HTTP methods, paths, status codes, and response bodies. Add as many routes as you need.',
  },
  {
    step: '2',
    title: 'Upload & get your ID',
    desc: 'One click upload. You get a unique mock ID that you can share or reuse later.',
  },
  {
    step: '3',
    title: 'Call your endpoints',
    desc: 'Use any HTTP client to hit your mock endpoints. Path variables, delays, everything works.',
  },
]
