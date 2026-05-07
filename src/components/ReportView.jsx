import { useState } from 'react'
import { AlertIcon, CheckIcon, MapPinIcon } from './Icons.jsx'

const CATEGORIES = [
  { id: 'lighting',    label: '💡 Lighting',    desc: 'Broken streetlights'       },
  { id: 'roads',       label: '🚧 Roads',        desc: 'Potholes, damaged pavements'},
  { id: 'graffiti',    label: '🖌️ Graffiti',    desc: 'Vandalism & tagging'        },
  { id: 'waste',       label: '🗑️ Waste',        desc: 'Overflowing bins, dumping'  },
  { id: 'safety',      label: '⚠️ Safety',       desc: 'Unsafe conditions'          },
  { id: 'environment', label: '🌿 Environment',  desc: 'Trees, green spaces'        },
  { id: 'noise',       label: '🔊 Noise',        desc: 'Persistent disturbance'     },
  { id: 'other',       label: '📋 Other',        desc: 'Anything else'              },
]

const STATUS_STYLE = {
  solved:   { bg: 'bg-green-50',  border: 'border-green-200', text: 'text-green-700',  dot: 'bg-green-500',  label: 'Solved'      },
  active:   { bg: 'bg-amber-50',  border: 'border-amber-200', text: 'text-amber-700',  dot: 'bg-amber-400',  label: ''            },
  none:     { bg: 'bg-light',     border: 'border-border',    text: 'text-muted',      dot: 'bg-border',     label: 'Open'        },
}

function reportStyle(r) {
  if (r.solved)    return STATUS_STYLE.solved
  if (r.status)    return STATUS_STYLE.active
  return STATUS_STYLE.none
}

export default function ReportView({ neighbourhood, posts = [], onOpenPost }) {
  const [tab, setTab]             = useState('open')
  const [cat, setCat]             = useState(null)
  const [desc, setDesc]           = useState('')
  const [location, setLocation]   = useState('')
  const [submitted, setSubmitted] = useState(false)

  const allReports = posts.filter(p =>
    p.type === 'report' &&
    (neighbourhood === 'All Helsinki' || p.neighbourhood === neighbourhood)
  )
  const openReports   = allReports.filter(r => !r.solved)
  const solvedReports = allReports.filter(r => r.solved)

  function handleSubmit(e) {
    e.preventDefault()
    if (!cat || !desc.trim()) return
    setSubmitted(true)
  }

  return (
    <div className="pb-24 max-w-lg mx-auto px-4 pt-4 space-y-5">

      {/* ── Report form ─────────────────────────────────────────────── */}
      <section className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="bg-red-600 px-4 py-3 flex items-center gap-2">
          <AlertIcon className="w-5 h-5 text-white" />
          <h2 className="font-bold text-white">Report an Issue</h2>
          <span className="ml-auto text-xs text-red-200 font-medium">Anonymous</span>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center py-10 px-4 text-center">
            <div className="w-14 h-14 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mb-3">
              <CheckIcon className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="font-bold text-natext mb-1">Report submitted</h3>
            <p className="text-sm text-muted mb-4">
              Reference #NN-{Math.floor(Math.random() * 9000 + 1000)}
            </p>
            <button
              onClick={() => { setSubmitted(false); setCat(null); setDesc(''); setLocation('') }}
              className="text-primary text-sm font-semibold"
            >
              Submit another report
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted uppercase tracking-wide mb-2 block">Category</label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map(c => (
                  <button key={c.id} type="button" onClick={() => setCat(c.id)}
                    className={`text-left p-2.5 rounded-xl border-2 transition-all
                      ${cat === c.id ? 'border-red-500 bg-red-50' : 'border-border hover:border-muted'}`}>
                    <div className="text-sm font-medium text-natext">{c.label}</div>
                    <div className="text-[10px] text-muted">{c.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted uppercase tracking-wide mb-2 block">Location (optional)</label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input id="report-location" name="location" type="text" value={location} onChange={e => setLocation(e.target.value)}
                  placeholder="Street name or landmark…"
                  className="w-full bg-light border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none focus:border-red-400" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted uppercase tracking-wide mb-2 block">Description</label>
              <textarea id="report-description" name="description" value={desc} onChange={e => setDesc(e.target.value)}
                placeholder="Describe the issue. Include when you noticed it…"
                rows={3}
                className="w-full bg-light border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400 resize-none" />
            </div>

            <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-3">
              <AlertIcon className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 leading-relaxed">
                Reports are anonymous by default. Your identity is never shared with the city or other users.
              </p>
            </div>

            <button type="submit" disabled={!cat || !desc.trim()}
              className="w-full bg-red-600 text-white font-semibold py-3 rounded-2xl text-sm transition-all disabled:opacity-40 hover:bg-red-700 active:scale-[0.98]">
              Submit Report
            </button>
          </form>
        )}
      </section>

      {/* ── Reports list ────────────────────────────────────────────── */}
      {allReports.length > 0 && (
        <section>
          {/* Tabs */}
          <div className="flex gap-2 mb-3">
            {[
              { id: 'open',   label: `Open (${openReports.length})`   },
              { id: 'solved', label: `Solved (${solvedReports.length})` },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all
                  ${tab === t.id
                    ? t.id === 'solved'
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-muted border-border hover:border-muted'}`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {(tab === 'open' ? openReports : solvedReports).map(r => {
              const s = reportStyle(r)
              return (
                <button key={r.id} onClick={() => onOpenPost?.(r)}
                  className={`w-full text-left bg-white rounded-2xl border ${s.border} p-4 shadow-sm hover:shadow-md transition-shadow`}>

                  {/* Title + status pill */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-sm text-natext leading-snug">{r.title}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${s.bg} ${s.text} border ${s.border}`}>
                      {r.solved ? 'Solved' : (r.status || 'Open')}
                    </span>
                  </div>

                  <p className="text-xs text-muted line-clamp-2 leading-relaxed">{r.body}</p>

                  {/* Resolution box */}
                  {r.solved && r.resolution && (
                    <div className="mt-2.5 bg-green-50 rounded-xl px-3 py-2 border border-green-100">
                      <p className="text-xs font-semibold text-green-700 mb-0.5">Resolution</p>
                      <p className="text-xs text-green-700/80 line-clamp-2 leading-relaxed">{r.resolution}</p>
                      {r.resolvedAt && (
                        <p className="text-[10px] text-green-600 mt-1">Resolved {r.resolvedAt}</p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-1 mt-2.5 text-xs text-muted">
                    <MapPinIcon className="w-3 h-3" />
                    <span>{r.neighbourhood} · {r.timeAgo} · {r.votes} supports</span>
                  </div>
                </button>
              )
            })}

            {(tab === 'open' ? openReports : solvedReports).length === 0 && (
              <div className="text-center py-10 text-muted text-sm">
                {tab === 'open' ? 'No open reports in this area.' : 'No solved reports yet.'}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
