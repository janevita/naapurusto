import { useState, useRef } from 'react'
import { XIcon, CameraIcon, CheckIcon } from './Icons.jsx'
import { NEIGHBOURHOODS } from '../data/mock.js'

const TYPES = [
  { id: 'news',   label: '📰 News',    desc: 'Share something happening nearby' },
  { id: 'report', label: '⚠️ Report',  desc: 'Flag an issue anonymously' },
  { id: 'idea',   label: '💡 Idea',    desc: 'Propose an improvement' },
  { id: 'event',  label: '📅 Event',   desc: 'Invite neighbours to something' },
]

export default function CreatePost({ onClose, onSubmit, neighbourhood, currentUser }) {
  const [type, setType]         = useState('news')
  const [title, setTitle]       = useState('')
  const [body, setBody]         = useState('')
  const [anon, setAnon]         = useState(false)
  const [area, setArea]         = useState(neighbourhood === 'All Helsinki' ? 'Kallio' : neighbourhood)
  const [submitted, setSubmitted] = useState(false)
  const [photoPreview, setPhotoPreview] = useState(null)
  const fileRef = useRef(null)

  function handlePhoto(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPhotoPreview(url)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return
    setSubmitted(true)
    setTimeout(() => {
      onSubmit({
        type, title, body,
        anonymous: anon,
        neighbourhood: area,
        imageUrl: photoPreview || null,
      })
      onClose()
    }, 1400)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'rgba(10,61,82,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="mt-auto bg-white rounded-t-3xl max-h-[92vh] flex flex-col max-w-lg mx-auto w-full"
        onClick={e => e.stopPropagation()}
      >
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <CheckIcon className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-natext mb-2">Post submitted!</h2>
            <p className="text-sm text-muted">Your post is live on the {area} feed.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-border rounded-full" />
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h2 className="font-bold text-natext text-lg">New Post</h2>
              <button onClick={onClose}
                className="w-8 h-8 rounded-full bg-light flex items-center justify-center text-muted hover:text-natext">
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-4 py-4 space-y-4">
              {/* Type selector */}
              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wide mb-2 block">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {TYPES.map(t => (
                    <button key={t.id} type="button"
                      onClick={() => { setType(t.id); if (t.id === 'report') setAnon(true) }}
                      className={`text-left p-3 rounded-xl border-2 transition-all
                        ${type === t.id ? 'border-primary bg-primary/5' : 'border-border bg-white hover:border-mid'}`}>
                      <div className="font-semibold text-sm text-natext">{t.label}</div>
                      <div className="text-[11px] text-muted mt-0.5">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Neighbourhood */}
              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wide mb-2 block">Neighbourhood</label>
                <select value={area} onChange={e => setArea(e.target.value)}
                  className="w-full bg-light border border-border rounded-xl px-3 py-2.5 text-sm text-natext outline-none focus:border-primary">
                  {NEIGHBOURHOODS.filter(n => n !== 'All Helsinki').map(n => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wide mb-2 block">Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="Short, clear summary…" maxLength={80}
                  className="w-full bg-light border border-border rounded-xl px-3 py-2.5 text-sm text-natext outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
              </div>

              {/* Body */}
              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wide mb-2 block">Details</label>
                <textarea value={body} onChange={e => setBody(e.target.value)}
                  placeholder="What's happening? Be specific about location, time, impact…"
                  rows={4}
                  className="w-full bg-light border border-border rounded-xl px-3 py-2.5 text-sm text-natext outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none" />
              </div>

              {/* Photo upload */}
              <div>
                {photoPreview ? (
                  <div className="relative rounded-xl overflow-hidden">
                    <img src={photoPreview} alt="preview" className="w-full h-40 object-cover" />
                    <button type="button" onClick={() => setPhotoPreview(null)}
                      className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white">
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileRef.current?.click()}
                    className="w-full flex items-center gap-3 px-3 py-3 border-2 border-dashed border-border rounded-xl text-muted hover:border-mid hover:text-primary transition-colors">
                    <CameraIcon className="w-5 h-5" />
                    <span className="text-sm">Add a photo (optional)</span>
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
              </div>

              {/* Anonymous toggle */}
              <div className="flex items-center justify-between py-1">
                <div>
                  <div className="text-sm font-medium text-natext">Post anonymously</div>
                  <div className="text-xs text-muted">Your name won't appear on this post</div>
                </div>
                <button type="button" onClick={() => setAnon(!anon)}
                  className={`w-12 h-6 rounded-full transition-all relative ${anon ? 'bg-primary' : 'bg-border'}`}>
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all"
                    style={{ left: anon ? '26px' : '2px' }} />
                </button>
              </div>

              {/* Submit */}
              <button type="submit" disabled={!title.trim() || !body.trim()}
                className="w-full bg-primary text-white font-semibold py-3.5 rounded-2xl text-sm transition-all
                  disabled:opacity-40 disabled:cursor-not-allowed hover:bg-dark active:scale-[0.98]">
                Post to {area}
              </button>

              <div className="h-2" />
            </form>
          </>
        )}
      </div>
    </div>
  )
}
