import { useState } from 'react'
import { POST_TYPES } from '../data/mock.js'
import { XIcon, ArrowUpIcon, ChatIcon, MapPinIcon, ShieldCheckIcon } from './Icons.jsx'

const MOCK_COMMENTS = [
  { id: 1, author: 'Timo V.',    initials: 'TV', timeAgo: '5 min ago',  body: 'Thanks for flagging this. I noticed the same thing yesterday.' },
  { id: 2, author: 'Hanna K.',   initials: 'HK', timeAgo: '20 min ago', body: "I've added my support. We should push the city to act faster." },
  { id: 3, author: 'Anonymous',  initials: '?',  timeAgo: '1 hr ago',   body: 'This has been an issue for months. Good to see it getting attention.' },
]

export default function PostModal({ post, onClose, onVote, currentUser }) {
  const typeInfo = POST_TYPES[post.type]
  const [commentText, setCommentText] = useState('')
  const [localComments, setLocalComments] = useState([])

  const allComments = [
    ...MOCK_COMMENTS.slice(0, Math.min(post.commentCount, 3)),
    ...localComments,
  ]

  const userInitials = currentUser
    ? currentUser.initials
    : 'Y'

  function handleAddComment(e) {
    e.preventDefault()
    if (!commentText.trim()) return
    setLocalComments(prev => [...prev, {
      id: Date.now(),
      author: currentUser?.name || 'You',
      initials: userInitials,
      timeAgo: 'just now',
      body: commentText.trim(),
    }])
    setCommentText('')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'rgba(10,61,82,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="mt-auto bg-white rounded-t-3xl max-h-[90vh] flex flex-col max-w-lg mx-auto w-full"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3 border-b border-border flex-shrink-0">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${typeInfo.color}`}>
            {typeInfo.label}
          </span>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-light flex items-center justify-center text-muted hover:text-natext transition-colors">
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 space-y-4">
          {/* Hero image */}
          {post.imageUrl && (
            <img src={post.imageUrl} alt="" className="w-full object-cover" style={{ maxHeight: 220 }} />
          )}

          <div className="px-4 space-y-4">
            {/* Author */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white
                ${post.anonymous ? 'bg-muted' : 'bg-primary'}`}>
                {post.author.initials}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-natext">{post.author.name}</span>
                  {post.author.verified && <ShieldCheckIcon className="w-4 h-4 text-mid" />}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted">
                  <MapPinIcon className="w-3 h-3" />
                  <span>{post.neighbourhood} · {post.timeAgo}</span>
                </div>
              </div>
            </div>

            {/* Title + body */}
            <div>
              <h2 className="text-lg font-bold text-natext leading-snug mb-2">{post.title}</h2>
              <p className="text-sm text-natext leading-relaxed">{post.body}</p>
            </div>

            {/* Report status & resolution */}
            {post.type === 'report' && post.solved && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" />
                  <span className="text-sm font-bold text-green-700">Issue Solved</span>
                  {post.resolvedAt && <span className="text-xs text-green-600 ml-auto">{post.resolvedAt}</span>}
                </div>
                {post.resolution && (
                  <p className="text-sm text-green-800 leading-relaxed pl-4">{post.resolution}</p>
                )}
              </div>
            )}
            {post.type === 'report' && !post.solved && post.status && (
              <div className="flex items-center gap-2 bg-amber-50 text-amber-700 text-sm font-medium px-3 py-2.5 rounded-xl border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                Status: {post.status}
              </div>
            )}

            {/* Tags */}
            {post.tags && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="text-xs bg-light text-primary font-medium px-2.5 py-1 rounded-full">#{tag}</span>
                ))}
              </div>
            )}

            {/* Vote bar */}
            <div className="flex items-center gap-3 py-3 border-y border-border">
              <button
                onClick={() => onVote(post.id, 'up')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all
                  ${post.voted === 'up'
                    ? 'bg-primary text-white'
                    : 'bg-light text-primary border border-primary hover:bg-primary/10'}`}
              >
                <ArrowUpIcon className="w-4 h-4" />
                Support · {post.votes}
              </button>
              <div className="flex items-center gap-1.5 text-sm text-muted ml-auto">
                <ChatIcon className="w-4 h-4" />
                <span>{post.commentCount + localComments.length} comments</span>
              </div>
            </div>

            {/* Comments */}
            <div>
              <h3 className="font-semibold text-sm text-natext mb-3">Comments</h3>
              <div className="space-y-3">
                {allComments.map(c => (
                  <div key={c.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-light border border-border flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                      {c.initials}
                    </div>
                    <div className="flex-1 bg-light rounded-xl px-3 py-2.5">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-xs font-semibold text-natext">{c.author}</span>
                        <span className="text-[10px] text-muted">{c.timeAgo}</span>
                      </div>
                      <p className="text-sm text-natext leading-relaxed">{c.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add comment */}
              <form onSubmit={handleAddComment} className="flex gap-2 mt-4 pb-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {userInitials}
                </div>
                <input
                  id="comment-text"
                  name="comment"
                  type="text"
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Add a comment…"
                  className="flex-1 bg-light border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                {commentText.trim() && (
                  <button type="submit"
                    className="px-3 py-2 bg-primary text-white text-xs font-bold rounded-xl">
                    Post
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
