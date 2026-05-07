import { COMMUNITY_STATS } from '../data/mock.js'
import { CheckIcon, ShieldCheckIcon } from './Icons.jsx'

const BADGES = {
  'Local Hero':      'bg-accent/20 text-dark',
  'Verified Local':  'bg-mid/20 text-primary',
  'Idea Maker':      'bg-primary/10 text-primary',
  'News Watcher':    'bg-light text-muted border border-border',
  'Campaigner':      'bg-red-50 text-red-700',
}

export default function CommunityView({ neighbourhood }) {
  const s = COMMUNITY_STATS

  return (
    <div className="pb-24 max-w-lg mx-auto px-4 pt-4 space-y-4">
      {/* Neighbourhood banner */}
      <div className="bg-dark rounded-2xl p-5 text-white overflow-hidden relative">
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-primary/20" />
        <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-mid/20" />
        <h2 className="font-bold text-xl relative z-10">
          {neighbourhood === 'All Helsinki' ? 'Helsinki' : neighbourhood}
        </h2>
        <p className="text-sm text-white/60 mt-0.5 relative z-10 mb-4">Neighbourhood community</p>

        <div className="grid grid-cols-2 gap-3 relative z-10">
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-2xl font-bold">{s.members.toLocaleString()}</div>
            <div className="text-xs text-white/60 mt-0.5">Members</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-2xl font-bold">{s.activeThisWeek}</div>
            <div className="text-xs text-white/60 mt-0.5">Active this week</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-2xl font-bold">{s.postsThisMonth}</div>
            <div className="text-xs text-white/60 mt-0.5">Posts this month</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-2xl font-bold text-green-400">{s.issuesResolved}</div>
            <div className="text-xs text-white/60 mt-0.5">Issues resolved</div>
          </div>
        </div>
      </div>

      {/* Recently resolved */}
      <section className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
            <CheckIcon className="w-3.5 h-3.5 text-green-600" />
          </div>
          <h3 className="font-semibold text-natext text-sm">Recently Resolved</h3>
        </div>
        <div className="divide-y divide-border">
          {s.recentlyResolved.map((item, i) => (
            <div key={i} className="px-4 py-3 flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-1.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-natext leading-snug">{item.title}</p>
                <p className="text-xs text-muted mt-0.5">Resolved in {item.resolvedIn}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top contributors */}
      <section className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-natext text-sm">Top Contributors</h3>
        </div>
        <div className="divide-y divide-border">
          {s.topContributors.map((c, i) => (
            <div key={i} className="px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                {c.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-natext">{c.name}</span>
                  <ShieldCheckIcon className="w-3.5 h-3.5 text-mid" />
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${BADGES[c.badge] || 'bg-light text-muted'}`}>
                  {c.badge}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-primary">{c.posts}</div>
                <div className="text-[10px] text-muted">posts</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Join CTA */}
      <div className="bg-primary rounded-2xl p-5 text-white text-center">
        <div className="text-2xl mb-2">🏡</div>
        <h3 className="font-bold mb-1">Get verified as a local</h3>
        <p className="text-sm text-white/70 mb-4">Verified locals get a badge and extra credibility on posts.</p>
        <button className="bg-white text-primary font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-light transition-colors">
          Apply for verification
        </button>
      </div>
    </div>
  )
}
