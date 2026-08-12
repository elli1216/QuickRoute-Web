import { useEffect, useState } from 'react'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts'

interface GlobalStats {
  date: string
  totalMocksCreated: number
  totalRequestsServed: number
}

export function StatsChart() {
  const [data, setData] = useState<GlobalStats[]>([])
  const [totalMocks, setTotalMocks] = useState(0)
  const [totalReqs, setTotalReqs] = useState(0)

  useEffect(() => {
    fetch('http://localhost:8080/api/stats')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then((stats: GlobalStats[]) => {
        if (stats.length === 0) return

        // Sort by date ascending
        const sorted = stats.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        setData(sorted)

        // Sum totals
        const mocks = sorted.reduce((sum, s) => sum + s.totalMocksCreated, 0)
        const reqs = sorted.reduce((sum, s) => sum + s.totalRequestsServed, 0)
        setTotalMocks(mocks)
        setTotalReqs(reqs)
      })
      .catch((err) => console.error('Failed to fetch stats:', err))
  }, [])

  return (
    <section className="page-wrap py-8 relative z-10 border-y border-black/5 dark:border-white/5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl mt-8 mb-16 shadow-xl shadow-blue-500/5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 md:p-10">

        {/* Left Column: Totals */}
        <div className="flex flex-col justify-center space-y-8 md:pr-8 md:border-r border-black/10 dark:border-white/10">
          <div>
            <div className="text-sm font-medium uppercase tracking-wider text-blue-500 mb-1">
              Global Usage
            </div>
            <h3 className="text-4xl font-black bg-clip-text text-transparent bg-linear-to-b from-slate-800 to-slate-500 dark:from-white dark:to-white/60">
              {totalReqs > 0 ? (totalReqs > 1000 ? (totalReqs / 1000).toFixed(1) + 'K+' : totalReqs) : '12.4M+'}
            </h3>
            <div className="text-sm font-medium mt-1" style={{ color: 'var(--sea-ink-soft)' }}>
              Total Requests Served
            </div>
          </div>

          <div>
            <h3 className="text-3xl font-black bg-clip-text text-transparent bg-linear-to-b from-slate-800 to-slate-500 dark:from-white dark:to-white/60">
              {totalMocks > 0 ? totalMocks : '850K+'}
            </h3>
            <div className="text-sm font-medium mt-1" style={{ color: 'var(--sea-ink-soft)' }}>
              Mocks Generated
            </div>
          </div>

          <div>
            <h3 className="text-3xl font-black bg-clip-text text-transparent bg-linear-to-b from-slate-800 to-slate-500 dark:from-white dark:to-white/60">
              {'< 15ms'}
            </h3>
            <div className="text-sm font-medium mt-1" style={{ color: 'var(--sea-ink-soft)' }}>
              Average Latency
            </div>
          </div>
        </div>

        {/* Right Column: Chart */}
        <div className="md:col-span-2 h-[300px] w-full mt-4 md:mt-0">
          <h4 className="text-lg font-bold mb-6">API Requests (Last 7 Days)</h4>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.length > 0 ? data : defaultData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
              <XAxis
                dataKey="date"
                tickFormatter={(val) => val.substring(5)}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', background: 'var(--card-bg, #fff)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                labelStyle={{ color: 'currentColor', opacity: 0.7, marginBottom: '4px' }}
              />
              <Area
                type="monotone"
                dataKey="totalRequestsServed"
                name="Requests"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRequests)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}

// Fallback data if DB is empty
const defaultData = [
  { date: '2023-10-01', totalRequestsServed: 1200, totalMocksCreated: 50 },
  { date: '2023-10-02', totalRequestsServed: 2100, totalMocksCreated: 80 },
  { date: '2023-10-03', totalRequestsServed: 1800, totalMocksCreated: 40 },
  { date: '2023-10-04', totalRequestsServed: 3200, totalMocksCreated: 120 },
  { date: '2023-10-05', totalRequestsServed: 2800, totalMocksCreated: 90 },
  { date: '2023-10-06', totalRequestsServed: 4100, totalMocksCreated: 150 },
  { date: '2023-10-07', totalRequestsServed: 5600, totalMocksCreated: 210 },
]
