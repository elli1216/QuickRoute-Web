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
    desc: 'No accounts, no passwords, no email verification. Open the API mocking tool and use it instantly.',
  },
  {
    icon: Sparkles,
    title: 'Completely free',
    desc: 'No hidden tiers, no credit card, no usage limits. A free REST API mock server that just works.',
  },
  {
    icon: Zap,
    title: 'Instant setup',
    desc: 'Deploy a fake REST API endpoint in milliseconds. No database required.',
  },
  {
    icon: RefreshCw,
    title: 'Live updates',
    desc: 'Add or remove mock routes while the server runs — no restart needed.',
  },
  {
    icon: Target,
    title: 'Path variables',
    desc: 'Use :id style parameters in paths. They substitute seamlessly into your fake JSON response body.',
  },
  {
    icon: Timer,
    title: 'Simulated delays',
    desc: 'Configure custom response latency to test loading states, timeouts, and frontend edge cases.',
  },
  {
    icon: Globe,
    title: 'Any HTTP method',
    desc: 'GET, POST, PUT, DELETE, PATCH — whatever your frontend application needs to test.',
  },
  {
    icon: Package,
    title: 'JSON responses',
    desc: 'Generate realistic mock JSON data with dynamic Faker variables and custom nested structures.',
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
