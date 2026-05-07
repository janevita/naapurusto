import { useState } from 'react'
import { AlertIcon, CheckIcon, MapPinIcon } from './Icons.jsx'
import { MOCK_POSTS } from '../data/mock.js'

const CATEGORIES = [
  { id: 'lighting',     label: '💡 Lighting',      desc: 'Broken streetlights' },
  { id: 'roads',        label: '🚧 Roads',         desc: 'Potholes, damaged pavements' },
  { id: 'graffiti',     label: '🖌️ Graffiti',     desc: 'Vandalism & tagging' },
  { id: 'waste',        label: '🗑️ Waste',         desc: 'Overflowing bins, dumping' },
  { id: 'safety',       label: '⚠️ Safety',        desc: 'Unsafe conditions' },
  { id: 'environment',  label: '🌿 Environment',   desc: 'Trees, green spaces' },
  { id: 'noise',        label: '🔊 Noise',         desc: 'Persistent disturbance' },
  { id: 'other',        label: '📋 Other',         desc: 'Anything else' },
]

export default function ReportView({ neighbourhood }) {
  const [cat, setCat]           = useState(null)
  const [desc, setDesc]         = useState('')
  const [location, setLocation] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const reports = MOCK_POSTS.filter(p => p.type === 'report' &&
    (neighbourhood === 'All Helsinki' || p.neighbourhood === neighbourhood))

  function handleSubmit(e) {
    e.preventDefault()
    if (!cat || !desc.trim()) return
    setSubmitted(true)
  }

  return (
    <div className="pb-24 max-w-lg mx-auto px-4 pt-4 space-y-6">
      {/* Report form */}
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
            <p className="text-sm text-muted mb-4">Reference #NN-{Math.floor(Math.random()*9000+1000)}</p>
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
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCat(c.id)}
                    className={`text-left p-2.5 rounded-xl border-2 transition-all
                      ${cat === c.id ? 'border-red-500 bg-red-50' : 'border-border hover:border-muted'}`}
                  >
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
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Street name or landmark…"
                  className="w-full bg-light border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none focus:border-red-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted uppercase tracking-wide mb-2 block">Description</label>
              <textarea
                value={desc}
                onChange={e => setDesc(e.target.value)}
                placeholder="Describe the issue. Include when you noticed it…"
                rows={3}
                className="w-full bg-light border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400 resize-none"
              />
            </div>

            <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-3">
              <AlertIcon className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 leading-relaxed">
                Reports are anonymous by default. Your identity is never shared with the city or other users.
              </p>
            </div>

            <button
              type="submit"
              disabled={!cat || !desc.trim()}
              className="w-full bg-red-600 text-white font-semibold py-3 rounded-2xl text-sm transition-all disabled:opacity-40 hover:bg-red-700 active:scale-[0.98]"
            >
              Submit Report
            </button>
          </form>
        )}
      </section>

      {/* Recent reports */}
      {reports.length > 0 && (
        <section>
          <h3 className="font-semibold text-natext mb-3">Recent Reports</h3>
          <div className="space-y-3">
            {reports.map(r => (
              <div key={r.id} className="bg-white rounded-2xl border border-border p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-sm text-natext leading-snug">{r.title}</h4>
                  {r.status && (
                    <span className="text-[10px] bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
                      {r.status}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted mt-1 line-clamp-2">{r.body}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted">
                  <MapPinIcon className="w-3 h-3" />
                  <span>{r.neighbourhood} · {r.timeAgo} · {r.votes} supports</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
