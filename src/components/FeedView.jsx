import { useState } from 'react'
import PostCard from './PostCard.jsx'

const FILTERS = ['All', 'News', 'Reports', 'Ideas', 'Events']
const FILTER_MAP = { All: null, News: 'news', Reports: 'report', Ideas: 'idea', Events: 'event' }

export default function FeedView({ posts, onVote, neighbourhood, onOpenPost, currentUser }) {
  const [filter, setFilter] = useState('All')

  const filtered = posts.filter(p => {
    const matchType = !FILTER_MAP[filter] || p.type === FILTER_MAP[filter]
    const matchArea = neighbourhood === 'All Helsinki' || p.neighbourhood === neighbourhood
    return matchType && matchArea
  })

  return (
    <div className="pb-24">
      {/* Filter pills */}
      <div className="bg-white border-b border-border sticky top-14 z-30">
        <div className="max-w-lg mx-auto px-4 py-2.5 flex gap-2 overflow-x-auto scrollbar-hide">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all
                ${filter === f
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-light text-muted border border-border hover:border-mid hover:text-primary'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="max-w-lg mx-auto px-4 pt-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🏘️</div>
            <p className="text-muted text-sm">No posts in {neighbourhood} yet.</p>
            <p className="text-muted text-xs mt-1">Be the first to post something!</p>
          </div>
        ) : (
          filtered.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onOpenPost={onOpenPost}
              onVote={onVote}
              currentUser={currentUser}
            />
          ))
        )}
      </div>
    </div>
  )
}
