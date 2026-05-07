import { useState } from 'react'
import { XIcon, PencilIcon, TrashIcon } from './Icons.jsx'
import { POST_TYPES } from '../data/mock.js'

function EditPostModal({ post, onSave, onClose }) {
  const [form, setForm] = useState({
    title: post.title,
    body: post.body,
    type: post.type,
    neighbourhood: post.neighbourhood,
    status: post.status || '',
    imageUrl: post.imageUrl || '',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

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
            <select value={form.type} onChange={e => set('type', e.target.value)}
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:border-primary">
              {Object.entries(POST_TYPES).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted block mb-1">Title</label>
            <input value={form.title} onChange={e => set('title', e.target.value)}
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted block mb-1">Body</label>
            <textarea value={form.body} onChange={e => set('body', e.target.value)} rows={4}
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary resize-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted block mb-1">Neighbourhood</label>
            <input value={form.neighbourhood} onChange={e => set('neighbourhood', e.target.value)}
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary" />
          </div>
          {(form.type === 'report') && (
            <div>
              <label className="text-xs font-semibold text-muted block mb-1">Status label</label>
              <input value={form.status} onChange={e => set('status', e.target.value)}
                placeholder="e.g. City notified, Under review, Resolved"
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary" />
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-muted block mb-1">Image URL (optional)</label>
            <input value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)}
              placeholder="https://picsum.photos/seed/example/600/340"
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary" />
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button onClick={onClose}
            className="flex-1 border border-border text-muted font-semibold py-2.5 rounded-xl text-sm">
            Cancel
          </button>
          <button onClick={() => onSave({ ...post, ...form, imageUrl: form.imageUrl || null, status: form.status || undefined })}
            className="flex-1 bg-primary text-white font-bold py-2.5 rounded-xl text-sm">
            Save changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminPanel({ posts, ideas, onClose, onUpdatePost, onDeletePost, onUpdateIdea, onDeleteIdea }) {
  const [tab, setTab] = useState('posts')
  const [editingPost, setEditingPost] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const handleDeleteConfirm = () => {
    if (confirmDelete.kind === 'post') onDeletePost(confirmDelete.id)
    if (confirmDelete.kind === 'idea') onDeleteIdea(confirmDelete.id)
    setConfirmDelete(null)
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'rgba(10,61,82,0.5)', backdropFilter: 'blur(3px)' }}
        onClick={onClose}>
        <div className="mt-14 mx-auto w-full max-w-lg bg-white rounded-b-3xl shadow-2xl flex flex-col max-h-[88vh]"
          onClick={e => e.stopPropagation()}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-base">🛡️</span>
              <h2 className="font-bold text-natext">Admin Panel</h2>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-light flex items-center justify-center text-muted">
              <XIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border flex-shrink-0">
            {[
              { key: 'posts', label: `Posts (${posts.length})` },
              { key: 'ideas', label: `Ideas (${ideas.length})` },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                  tab === t.key
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted'
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1">
            {tab === 'posts' && posts.map(post => {
              const typeStyle = POST_TYPES[post.type] || POST_TYPES.news
              return (
                <div key={post.id} className="flex items-start gap-3 px-4 py-3 border-b border-border">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${typeStyle.color}`}>
                        {typeStyle.label.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-muted">{post.neighbourhood}</span>
                    </div>
                    <p className="text-sm font-medium text-natext line-clamp-1">{post.title}</p>
                    <p className="text-xs text-muted mt-0.5">👍 {post.votes} · 💬 {post.commentCount} · {post.timeAgo}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
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

            {tab === 'ideas' && ideas.map(idea => (
              <div key={idea.id} className="flex items-start gap-3 px-4 py-3 border-b border-border">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-natext line-clamp-2">{idea.title}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {idea.author} · {idea.neighbourhood} · 👍 {idea.votes} ·
                    <span className={`ml-1 font-semibold ${idea.status === 'approved' ? 'text-green-600' : 'text-mid'}`}>
                      {idea.status === 'approved' ? 'Approved' : `${idea.daysLeft}d left`}
                    </span>
                  </p>
                </div>
                <button onClick={() => setConfirmDelete({ kind: 'idea', id: idea.id, title: idea.title })}
                  className="w-7 h-7 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors flex-shrink-0">
                  <TrashIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit modal */}
      {editingPost && (
        <EditPostModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onSave={(updated) => { onUpdatePost(updated); setEditingPost(null) }}
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
