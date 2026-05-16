import { getBlogCache } from '@/lib/getBlogPosts'

export default function StatsBar() {
  const articleCount = getBlogCache().length
  const displayCount = articleCount >= 1000
    ? `${(Math.floor(articleCount / 1000) * 1000).toLocaleString()}+`
    : `${articleCount}+`

  const stats = [
    { value: displayCount, label: 'destination guides' },
    { value: '17+', label: 'Japan cities covered' },
    { value: '2026', label: 'fully updated' },
    { value: 'Free', label: 'to read' },
  ]

  return (
    <div className="bg-slate-900 border-b border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-700/60">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center justify-center py-4 px-6 text-center">
              <dt className="text-xs font-medium tracking-widest text-slate-400 uppercase">{stat.label}</dt>
              <dd className="mt-1 text-xl font-bold text-white">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
