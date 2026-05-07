import { useState, useEffect, useRef } from 'react'
import { XIcon, SearchIcon, MapPinIcon } from './Icons.jsx'
import { POST_TYPES } from '../data/mock.js'

export default function SearchOverlay({ posts, onClose, onOpenPost }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const q = query.trim().toLowerCase()
  const results = q.length < 2 ? [] : posts.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.body.toLowerCase().includes(q) ||
    p.neighbourhood.toLowerCase().includes(q) ||
    (p.tags || []).some(t => t.toLowerCase().includes(q))
  )

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'rgba(10,61,82,0.5)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}>
      <div className="mt-14 mx-auto w-full max-w-lg bg-white rounded-b-3xl shadow-2xl flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}>

        {/* Search input */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <SearchIcon className="w-5 h-5 text-muted flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search posts, issues, ideas…"
            className="flex-1 text-sm text-natext bg-transparent outline-none placeholder:text-muted"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-muted">
              <XIcon className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="ml-1 text-xs text-primary font-semibold">
            Cancel
          </button>
        </div>

        {/* Results */}
        <div className="overflow-y-auto">
          {q.length < 2 && (
            <div className="py-10 text-center text-muted text-sm">Type to search across all posts</div>
          )}
          {q.length >= 2 && results.length === 0 && (
            <div className="py-10 text-center text-muted text-sm">No results for "<span className="text-natext">{query}</span>"</div>
          )}
          {results.map(post => {
            const typeStyle = POST_TYPES[post.type] || POST_TYPES.news
            return (
              <button key={post.id} onClick={() => { onOpenPost(post); onClose() }}
                className="w-full flex gap-3 px-4 py-3 border-b border-border text-left hover:bg-light transition-colors">
                {post.imageUrl ? (
                  <img src={post.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-light flex items-center justify-center flex-shrink-0 text-xl">
                    {post.type === 'report' ? '⚠️' : post.type === 'idea' ? '💡' : post.type === 'event' ? '📅' : '📰'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${typeStyle.color}`}>
                      {typeStyle.label.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-muted flex items-center gap-0.5">
                      <MapPinIcon className="w-3 h-3" />{post.neighbourhood}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-natext truncate">{post.title}</p>
                  <p className="text-xs text-muted line-clamp-1 mt-0.5">{post.body}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
