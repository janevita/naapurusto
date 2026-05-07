import { useState } from 'react'
import { ArrowUpIcon, ChatIcon, CheckIcon } from './Icons.jsx'
import { IMPL_STAGES } from '../data/mock.js'

// Ordered stage IDs for progress calculation
const STAGE_IDS = IMPL_STAGES.map(s => s.id)

function ImplTimeline({ implementationStatus, implementationUpdates = [] }) {
  const currentIdx = STAGE_IDS.indexOf(implementationStatus)

  return (
    <div className="mt-3 pt-3 border-t border-border">
      <p className="text-[10px] font-bold text-muted uppercase tracking-wide mb-2">Implementation progress</p>

      {/* Step dots */}
      <div className="flex items-center gap-0 mb-3">
        {IMPL_STAGES.map((stage, i) => {
          const done    = i <= currentIdx
          const current = i === currentIdx
          const last    = i === IMPL_STAGES.length - 1
          return (
            <div key={stage.id} className="flex items-center flex-1 last:flex-none">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all
                ${done
                  ? current
                    ? 'bg-primary border-primary'
                    : 'bg-primary/20 border-primary'
                  : 'bg-white border-border'}`}>
                {done && !current && <div className="w-2 h-2 rounded-full bg-primary" />}
                {current && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              {!last && (
                <div className={`flex-1 h-0.5 mx-0.5 ${i < currentIdx ? 'bg-primary/40' : 'bg-border'}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Current stage label */}
      <p className="text-xs font-semibold text-primary mb-2">
        {IMPL_STAGES[currentIdx]?.label || 'Forwarded'}
        <span className="text-muted font-normal"> — {IMPL_STAGES[currentIdx]?.short}</span>
      </p>

      {/* Update log */}
      {implementationUpdates.length > 0 && (
        <div className="space-y-1.5 pl-1">
          {implementationUpdates.map((u, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="flex flex-col items-center flex-shrink-0 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                {i < implementationUpdates.length - 1 && (
                  <div className="w-px h-3 bg-border mt-0.5" />
                )}
              </div>
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-[10px] font-bold text-primary">
                    {IMPL_STAGES.find(s => s.id === u.stage)?.label || u.stage}
                  </span>
                  <span className="text-[10px] text-muted">{u.date}</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">{u.note}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function IdeasView({ neighbourhood, ideas: propIdeas }) {
  const [ideas, setIdeas] = useState(propIdeas)
  const [tab, setTab] = useState('voting')

  function vote(id) {
    setIdeas(prev => prev.map(idea =>
      idea.id === id
        ? { ...idea, userVoted: !idea.userVoted, votes: idea.userVoted ? idea.votes - 1 : idea.votes + 1 }
        : idea
    ))
  }

  const filtered = ideas.filter(i => {
    const matchStatus = i.status === tab
    const matchArea   = neighbourhood === 'All Helsinki' || i.neighbourhood === neighbourhood
    return matchStatus && matchArea
  })

  return (
    <div className="pb-24 max-w-lg mx-auto">
      {/* Tabs */}
      <div className="bg-white border-b border-border sticky top-14 z-30">
        <div className="px-4 flex">
          {[
            { id: 'voting',    label: 'Active Votes'         },
            { id: 'forwarded', label: 'Forwarded to Council' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors
                ${tab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-primary'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {/* CTA banner for voting tab */}
        {tab === 'voting' && (
          <div className="bg-gradient-to-r from-accent/20 to-mid/20 border border-accent/30 rounded-2xl p-4">
            <h3 className="font-bold text-dark text-sm mb-1">
              Have an idea for {neighbourhood === 'All Helsinki' ? 'your neighbourhood' : neighbourhood}?
            </h3>
            <p className="text-xs text-muted mb-3">
              Submit a proposal. 50+ supports sends it to the district council.
            </p>
            <button className="bg-accent text-dark font-semibold text-xs px-4 py-2 rounded-full hover:bg-accent/90 transition-colors">
              + Submit a proposal
            </button>
          </div>
        )}

        {/* Info banner for forwarded tab */}
        {tab === 'forwarded' && filtered.length > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-3 flex items-start gap-2">
            <span className="text-base flex-shrink-0">🏛️</span>
            <p className="text-xs text-primary leading-relaxed">
              These proposals crossed the 50-vote threshold and have been forwarded to the district council for implementation.
            </p>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">{tab === 'voting' ? '💡' : '🏛️'}</div>
            <p className="text-muted text-sm">
              {tab === 'voting'
                ? 'No active votes in this area.'
                : 'No proposals forwarded to council yet.'}
            </p>
          </div>
        ) : (
          filtered.map(idea => (
            <div key={idea.id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              {/* Progress bar (voting only) */}
              {tab === 'voting' && (
                <div className="h-1 bg-light">
                  <div className="h-full bg-primary transition-all"
                    style={{ width: `${Math.min(100, (idea.votes / 200) * 100)}%` }} />
                </div>
              )}
              {/* Forwarded header stripe */}
              {tab === 'forwarded' && (
                <div className="h-1 bg-primary" />
              )}

              <div className="p-4">
                <div className="flex items-start gap-3">
                  {/* Vote button */}
                  <button onClick={() => vote(idea.id)}
                    className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl border-2 transition-all flex-shrink-0
                      ${idea.userVoted
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted hover:border-primary hover:text-primary'}`}>
                    {tab === 'forwarded'
                      ? <span className="text-base">🏛️</span>
                      : <ArrowUpIcon className="w-5 h-5" />
                    }
                    <span className="text-sm font-bold">{idea.votes}</span>
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-natext text-[15px] leading-snug mb-1">{idea.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                      <span>by {idea.author}</span>
                      <span className="flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-border" />
                        {idea.neighbourhood}
                      </span>
                      {idea.budget && <span className="text-primary font-medium">{idea.budget}</span>}
                    </div>

                    <div className="flex items-center gap-3 mt-2.5">
                      <div className="flex items-center gap-1 text-xs text-muted">
                        <ChatIcon className="w-3.5 h-3.5" />
                        {idea.comments}
                      </div>

                      {tab === 'voting' && idea.daysLeft > 0 && (
                        <span className="text-[11px] bg-accent/20 text-dark font-semibold px-2 py-0.5 rounded-full">
                          {idea.daysLeft}d left
                        </span>
                      )}
                      {tab === 'voting' && idea.votes >= 50 && (
                        <span className="text-[11px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                          Meets threshold ✓
                        </span>
                      )}
                      {tab === 'forwarded' && idea.forwardedAt && (
                        <span className="text-[11px] text-muted">Forwarded {idea.forwardedAt}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Implementation timeline for forwarded ideas */}
                {tab === 'forwarded' && idea.implementationStatus && (
                  <ImplTimeline
                    implementationStatus={idea.implementationStatus}
                    implementationUpdates={idea.implementationUpdates || []}
                  />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
