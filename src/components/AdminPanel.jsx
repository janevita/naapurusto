import { useState } from 'react'
import { XIcon, PencilIcon, TrashIcon, CheckIcon } from './Icons.jsx'
import { POST_TYPES, IMPL_STAGES } from '../data/mock.js'

// ── Edit post modal ────────────────────────────────────────────────────────
function EditPostModal({ post, onSave, onClose }) {
  const [form, setForm] = useState({
    title:        post.title,
    body:         post.body,
    type:         post.type,
    neighbourhood:post.neighbourhood,
    status:       post.status || '',
    imageUrl:     post.imageUrl || '',
    solved:       post.solved || false,
    resolution:   post.resolution || '',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function handleSave() {
    const updated = {
      ...post,
      ...form,
      imageUrl:   form.imageUrl || null,
      status:     form.status   || undefined,
      resolved:   form.solved ? true : false,
      resolution: form.solved ? (form.resolution || null) : null,
      resolvedAt: form.solved && !post.solved ? 'just now' : post.resolvedAt,
    }
    onSave(updated)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(10,61,82,0.6)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}>
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-natext">Edit post</h3>
          <button onClick={onClose}><XIcon className="w-5 h-5 text-muted" /></button>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-semibold text-muted block mb-1">Type</label>
            <select id="edit-type" name="type" value={form.type} onChange={e => set('type', e.target.value)}
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:border-primary">
              {Object.entries(POST_TYPES).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted block mb-1">Title</label>
            <input id="edit-title" name="title" value={form.title} onChange={e => set('title', e.target.value)}
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary" />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted block mb-1">Body</label>
            <textarea id="edit-body" name="body" value={form.body} onChange={e => set('body', e.target.value)} rows={4}
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary resize-none" />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted block mb-1">Neighbourhood</label>
            <input id="edit-neighbourhood" name="neighbourhood" value={form.neighbourhood} onChange={e => set('neighbourhood', e.target.value)}
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary" />
          </div>

          {/* Report-specific fields */}
          {form.type === 'report' && (
            <>
              <div>
                <label className="text-xs font-semibold text-muted block mb-1">Status label</label>
                <input id="edit-status" name="status" value={form.status} onChange={e => set('status', e.target.value)}
                  placeholder="e.g. City notified, Under review"
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary" />
              </div>

              {/* Solved toggle */}
              <div className={`rounded-xl border-2 p-3 transition-all ${form.solved ? 'border-green-400 bg-green-50' : 'border-border'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-natext">Mark as Solved</span>
                  <button type="button" onClick={() => set('solved', !form.solved)}
                    className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${form.solved ? 'bg-green-500' : 'bg-border'}`}>
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-all"
                      style={{ left: form.solved ? '22px' : '2px' }} />
                  </button>
                </div>
                {form.solved && (
                  <div className="mt-2">
                    <label className="text-xs font-semibold text-muted block mb-1">Resolution details</label>
                    <textarea
                      id="edit-resolution" name="resolution"
                      value={form.resolution}
                      onChange={e => set('resolution', e.target.value)}
                      placeholder="Describe how and when the issue was resolved…"
                      rows={3}
                      className="w-full border border-green-300 bg-white rounded-xl px-3 py-2 text-sm outline-none focus:border-green-500 resize-none"
                    />
                  </div>
                )}
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-semibold text-muted block mb-1">Image URL (optional)</label>
            <input id="edit-imageUrl" name="imageUrl" value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)}
              placeholder="https://picsum.photos/seed/example/600/340"
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary" />
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button onClick={onClose}
            className="flex-1 border border-border text-muted font-semibold py-2.5 rounded-xl text-sm">
            Cancel
          </button>
          <button onClick={handleSave}
            className="flex-1 bg-primary text-white font-bold py-2.5 rounded-xl text-sm">
            Save changes
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Edit idea / implementation status modal ───────────────────────────────
function EditIdeaModal({ idea, onSave, onClose }) {
  const [status, setStatus] = useState(idea.implementationStatus || 'forwarded')
  const [note, setNote]     = useState('')

  function handleSave() {
    const newUpdate = note.trim() ? [{
      stage: status,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      note: note.trim(),
    }] : []
    onSave({
      ...idea,
      implementationStatus: status,
      implementationUpdates: [...(idea.implementationUpdates || []), ...newUpdate],
    })
  }

  const currentIdx   = IMPL_STAGES.findIndex(s => s.id === status)
  const selectedStage = IMPL_STAGES[currentIdx]

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(10,61,82,0.6)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}>
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-natext">Update implementation</h3>
          <button onClick={onClose}><XIcon className="w-5 h-5 text-muted" /></button>
        </div>
        <p className="text-xs text-muted mb-4 line-clamp-2">{idea.title}</p>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-semibold text-muted block mb-2">Implementation stage</label>
            <div className="flex flex-col gap-2">
              {IMPL_STAGES.map((stage, i) => (
                <button key={stage.id} type="button" onClick={() => setStatus(stage.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all
                    ${status === stage.id ? 'border-primary bg-primary/5' : 'border-border hover:border-mid'}`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                    ${status === stage.id ? 'border-primary bg-primary' : 'border-border'}`}>
                    {status === stage.id && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-natext">{stage.label}</div>
                    <div className="text-xs text-muted">{stage.short}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted block mb-1">Update note (optional)</label>
            <textarea id="impl-note" name="note" value={note} onChange={e => setNote(e.target.value)} rows={3}
              placeholder={`Add a note about this ${selectedStage?.label?.toLowerCase()} update…`}
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary resize-none" />
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button onClick={onClose}
            className="flex-1 border border-border text-muted font-semibold py-2.5 rounded-xl text-sm">
            Cancel
          </button>
          <button onClick={handleSave}
            className="flex-1 bg-primary text-white font-bold py-2.5 rounded-xl text-sm">
            Save update
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main AdminPanel ────────────────────────────────────────────────────────
export default function AdminPanel({ posts, ideas, onClose, onUpdatePost, onDeletePost, onUpdateIdea, onDeleteIdea }) {
  const [tab, setTab]           = useState('posts')
  const [editingPost, setEditingPost] = useState(null)
  const [editingIdea, setEditingIdea] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  // Split ideas into voting vs forwarded
  const forwardedIdeas = ideas.filter(i => i.status === 'forwarded')
  const votingIdeas    = ideas.filter(i => i.status !== 'forwarded')

  const handleDeleteConfirm = () => {
    if (confirmDelete.kind === 'post') onDeletePost(confirmDelete.id)
    if (confirmDelete.kind === 'idea') onDeleteIdea(confirmDelete.id)
    setConfirmDelete(null)
  }

  // Quick "mark solved" shortcut directly from list
  function handleQuickSolve(post) {
    setEditingPost({ ...post, _quickSolve: true })
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex flex-col"
        style={{ background: 'rgba(10,61,82,0.5)', backdropFilter: 'blur(3px)' }}
        onClick={onClose}>
        <div className="mt-14 mx-auto w-full max-w-lg bg-white rounded-b-3xl shadow-2xl flex flex-col max-h-[88vh]"
          onClick={e => e.stopPropagation()}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-base">🛡️</span>
              <h2 className="font-bold text-natext">Admin Panel</h2>
            </div>
            <button onClick={onClose}
              className="w-7 h-7 rounded-full bg-light flex items-center justify-center text-muted">
              <XIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border flex-shrink-0">
            {[
              { key: 'posts',    label: `Posts (${posts.length})`   },
              { key: 'ideas',    label: `Proposals (${ideas.length})` },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex-1 py-2.5 text-sm font-semibold transition-colors
                  ${tab === t.key ? 'text-primary border-b-2 border-primary' : 'text-muted'}`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1">

            {/* ── Posts tab ── */}
            {tab === 'posts' && posts.map(post => {
              const typeStyle = POST_TYPES[post.type] || POST_TYPES.news
              const isReport  = post.type === 'report'
              return (
                <div key={post.id} className="flex items-start gap-3 px-4 py-3 border-b border-border">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${typeStyle.color}`}>
                        {typeStyle.label.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-muted">{post.neighbourhood}</span>
                      {isReport && post.solved && (
                        <span className="text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full">
                          ✓ Solved
                        </span>
                      )}
                      {isReport && !post.solved && post.status && (
                        <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full">
                          {post.status}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-natext line-clamp-1">{post.title}</p>
                    <p className="text-xs text-muted mt-0.5">👍 {post.votes} · 💬 {post.commentCount} · {post.timeAgo}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {/* Quick solve button for open reports */}
                    {isReport && !post.solved && (
                      <button onClick={() => handleQuickSolve(post)}
                        title="Mark as solved"
                        className="w-7 h-7 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors">
                        <CheckIcon className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button onClick={() => setEditingPost(post)}
                      className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                      <PencilIcon className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setConfirmDelete({ kind: 'post', id: post.id, title: post.title })}
                      className="w-7 h-7 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
                      <TrashIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}

            {/* ── Ideas tab ── */}
            {tab === 'ideas' && (
              <>
                {/* Forwarded proposals */}
                {forwardedIdeas.length > 0 && (
                  <>
                    <div className="px-4 py-2 bg-primary/5 border-b border-border">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-wide">
                        Forwarded to Council ({forwardedIdeas.length})
                      </p>
                    </div>
                    {forwardedIdeas.map(idea => {
                      const stage = IMPL_STAGES.find(s => s.id === idea.implementationStatus)
                      return (
                        <div key={idea.id} className="flex items-start gap-3 px-4 py-3 border-b border-border">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-natext line-clamp-2">{idea.title}</p>
                            <p className="text-xs text-muted mt-0.5">
                              {idea.author} · {idea.neighbourhood} · 👍 {idea.votes}
                            </p>
                            {stage && (
                              <span className="inline-block mt-1 text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                {stage.label}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button onClick={() => setEditingIdea(idea)}
                              className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
                              title="Update implementation status">
                              <PencilIcon className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setConfirmDelete({ kind: 'idea', id: idea.id, title: idea.title })}
                              className="w-7 h-7 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
                              <TrashIcon className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </>
                )}

                {/* Voting proposals */}
                {votingIdeas.length > 0 && (
                  <>
                    <div className="px-4 py-2 bg-light border-b border-border">
                      <p className="text-[10px] font-bold text-muted uppercase tracking-wide">
                        Active Votes ({votingIdeas.length})
                      </p>
                    </div>
                    {votingIdeas.map(idea => (
                      <div key={idea.id} className="flex items-start gap-3 px-4 py-3 border-b border-border">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-natext line-clamp-2">{idea.title}</p>
                          <p className="text-xs text-muted mt-0.5">
                            {idea.author} · {idea.neighbourhood} · 👍 {idea.votes} ·{' '}
                            <span className="text-mid font-medium">{idea.daysLeft}d left</span>
                          </p>
                        </div>
                        <button onClick={() => setConfirmDelete({ kind: 'idea', id: idea.id, title: idea.title })}
                          className="w-7 h-7 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors flex-shrink-0">
                          <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Edit post modal */}
      {editingPost && (
        <EditPostModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onSave={(updated) => { onUpdatePost(updated); setEditingPost(null) }}
        />
      )}

      {/* Edit idea / implementation modal */}
      {editingIdea && (
        <EditIdeaModal
          idea={editingIdea}
          onClose={() => setEditingIdea(null)}
          onSave={(updated) => { onUpdateIdea(updated); setEditingIdea(null) }}
        />
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-6"
          style={{ background: 'rgba(10,61,82,0.6)' }}
          onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-5 w-full max-w-xs" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-natext mb-2">Delete {confirmDelete.kind}?</h3>
            <p className="text-sm text-muted mb-5 line-clamp-2">"{confirmDelete.title}"</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 border border-border text-muted font-semibold py-2.5 rounded-xl text-sm">
                Cancel
              </button>
              <button onClick={handleDeleteConfirm}
                className="flex-1 bg-red-500 text-white font-bold py-2.5 rounded-xl text-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
