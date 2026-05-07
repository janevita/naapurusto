import { POST_TYPES } from '../data/mock.js'
import { ArrowUpIcon, ChatIcon, MapPinIcon, ShieldCheckIcon } from './Icons.jsx'

export default function PostCard({ post, onOpenPost, onVote, currentUser }) {
  const typeInfo = POST_TYPES[post.type]

  return (
    <article
      onClick={() => onOpenPost(post)}
      className="bg-white rounded-2xl shadow-sm border border-border cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99] mb-3 overflow-hidden"
    >
      {/* Post image */}
      {post.imageUrl && (
        <img src={post.imageUrl} alt="" className="w-full h-40 object-cover" loading="lazy" />
      )}

      <div className="p-4">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0
              ${post.anonymous ? 'bg-muted' : 'bg-primary'}`}>
              {post.author.initials}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-natext">{post.author.name}</span>
                {post.author.verified && <ShieldCheckIcon className="w-3.5 h-3.5 text-mid" />}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted">
                <MapPinIcon className="w-3 h-3" />
                <span>{post.neighbourhood}</span>
                <span>·</span>
                <span>{post.timeAgo}</span>
              </div>
            </div>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 uppercase tracking-wide ${typeInfo.color}`}>
            {typeInfo.label}
          </span>
        </div>

        {/* Content */}
        <h3 className="font-semibold text-natext text-[15px] leading-snug mb-1">{post.title}</h3>
        <p className="text-sm text-muted line-clamp-2 leading-relaxed">{post.body}</p>

        {/* Status / solved badge for reports */}
        {post.type === 'report' && post.solved && (
          <div className="mt-2 flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
            <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-1" />
            <div className="min-w-0">
              <span className="text-xs font-bold text-green-700">Solved</span>
              {post.resolution && (
                <p className="text-xs text-green-700/80 mt-0.5 line-clamp-2 leading-relaxed">{post.resolution}</p>
              )}
            </div>
          </div>
        )}
        {post.type === 'report' && !post.solved && post.status && (
          <div className="mt-2 inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-medium px-2.5 py-1 rounded-full border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            {post.status}
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {post.tags.map(tag => (
              <span key={tag} className="text-[11px] bg-light text-primary font-medium px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
          <button
            onClick={e => { e.stopPropagation(); onVote(post.id, 'up') }}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors
              ${post.voted === 'up' ? 'text-primary' : 'text-muted hover:text-primary'}`}
          >
            <ArrowUpIcon className="w-4 h-4" />
            <span>{post.votes}</span>
          </button>
          <button className="flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors">
            <ChatIcon className="w-4 h-4" />
            <span>{post.commentCount}</span>
          </button>
          <div className="ml-auto">
            <span className="text-xs text-border font-medium">Tap to read more</span>
          </div>
        </div>
      </div>
    </article>
  )
}
