import { useState } from 'react'
import { ArrowUpIcon, ChatIcon, CheckIcon } from './Icons.jsx'

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
    const matchArea = neighbourhood === 'All Helsinki' || i.neighbourhood === neighbourhood
    return matchStatus && matchArea
  })

  return (
    <div className="pb-24 max-w-lg mx-auto">
      {/* Tabs */}
      <div className="bg-white border-b border-border sticky top-14 z-30">
        <div className="px-4 flex">
          {[
            { id: 'voting',   label: 'Active Votes' },
            { id: 'approved', label: 'Approved' },
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
        {tab === 'voting' && (
          <div className="bg-gradient-to-r from-accent/20 to-mid/20 border border-accent/30 rounded-2xl p-4">
            <h3 className="font-bold text-dark text-sm mb-1">
              Have an idea for {neighbourhood === 'All Helsinki' ? 'your neighbourhood' : neighbourhood}?
            </h3>
            <p className="text-xs text-muted mb-3">Submit a proposal. 50+ votes sends it to the district council.</p>
            <button className="bg-accent text-dark font-semibold text-xs px-4 py-2 rounded-full hover:bg-accent/90 transition-colors">
              + Submit a proposal
            </button>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">{tab === 'voting' ? '💡' : '✅'}</div>
            <p className="text-muted text-sm">
              {tab === 'voting' ? 'No active votes in this area.' : 'No approved ideas yet.'}
            </p>
          </div>
        ) : (
          filtered.map(idea => (
            <div key={idea.id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="h-1 bg-light">
                <div className="h-full bg-primary transition-all"
                  style={{ width: `${Math.min(100, (idea.votes / 200) * 100)}%` }} />
              </div>
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <button onClick={() => vote(idea.id)}
                    className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl border-2 transition-all flex-shrink-0
                      ${idea.userVoted
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted hover:border-primary hover:text-primary'}`}>
                    {idea.status === 'approved'
                      ? <CheckIcon className="w-5 h-5 text-green-600" />
                      : <ArrowUpIcon className="w-5 h-5" />
                    }
                    <span className="text-sm font-bold">{idea.votes}</span>
                  </button>
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
                      {idea.status === 'voting' && idea.daysLeft > 0 ? (
                        <span className="text-[11px] bg-accent/20 text-dark font-semibold px-2 py-0.5 rounded-full">
                          {idea.daysLeft}d left
                        </span>
                      ) : idea.status === 'approved' ? (
                        <span className="text-[11px] bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">
                          ✓ Approved
                        </span>
                      ) : null}
                      {idea.votes >= 50 && idea.status === 'voting' && (
                        <span className="text-[11px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                          Meets threshold
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
