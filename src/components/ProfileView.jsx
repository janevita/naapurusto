import { ShieldCheckIcon, MapPinIcon } from './Icons.jsx'
import PostCard from './PostCard.jsx'

const BADGE_COLORS = {
  'Founder':        'bg-primary text-white',
  'Local Hero':     'bg-accent text-dark',
  'Verified Local': 'bg-mid text-white',
  'Idea Maker':     'bg-purple-500 text-white',
  'News Watcher':   'bg-green-600 text-white',
  'Campaigner':     'bg-red-500 text-white',
  'Newcomer':       'bg-border text-muted',
}

export default function ProfileView({ user, allPosts, currentUser, onVote, onOpenPost, onLogout, onEditBio }) {
  const userPosts = allPosts.filter(p => p.authorId === user.id)
  const badgeClass = BADGE_COLORS[user.badge] || 'bg-border text-muted'
  const isOwn = currentUser?.id === user.id

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-light">
      {/* Profile card */}
      <div className="bg-white px-5 pt-5 pb-6 shadow-sm">
        {/* Avatar + stats row */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 text-primary text-xl font-bold flex items-center justify-center flex-shrink-0 border-2 border-primary/30">
            {user.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="font-bold text-natext text-lg leading-tight">{user.name}</h2>
              {user.verified && <ShieldCheckIcon className="w-4 h-4 text-primary flex-shrink-0" />}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPinIcon className="w-3 h-3 text-muted" />
              <span className="text-xs text-muted">{user.neighbourhood}</span>
            </div>
            <span className={`inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeClass}`}>
              {user.badge}
            </span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-muted mt-3 leading-relaxed">{user.bio || 'No bio yet.'}</p>

        {/* Stats row */}
        <div className="flex gap-4 mt-4 pt-4 border-t border-border">
          {[
            { label: 'Posts', value: user.posts + userPosts.filter(p => !allPosts.some(ap => ap.id === p.id && ap.authorId === user.id && ap.id < 100)).length },
            { label: 'Votes received', value: user.votes },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-xl font-bold text-natext">{s.value}</p>
              <p className="text-xs text-muted">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        {isOwn && (
          <div className="flex gap-2 mt-4">
            {onEditBio && (
              <button onClick={onEditBio}
                className="flex-1 border border-primary text-primary text-sm font-semibold rounded-xl py-2 hover:bg-primary/5 transition-colors">
                Edit profile
              </button>
            )}
            <button onClick={onLogout}
              className="flex-1 border border-border text-muted text-sm font-semibold rounded-xl py-2 hover:bg-light transition-colors">
              Sign out
            </button>
          </div>
        )}
      </div>

      {/* Posts section */}
      <div className="px-3 pt-4 pb-24">
        <h3 className="text-xs font-bold text-muted uppercase tracking-wide mb-3 px-1">
          {isOwn ? 'Your posts' : `Posts by ${user.name.split(' ')[0]}`}
        </h3>
        {userPosts.length === 0 ? (
          <div className="text-center py-12 text-muted text-sm">
            {isOwn ? "You haven't posted yet." : 'No posts yet.'}
          </div>
        ) : (
          userPosts.map(post => (
            <PostCard key={post.id} post={post} currentUser={currentUser}
              onVote={onVote} onOpenPost={onOpenPost} />
          ))
        )}
      </div>
    </div>
  )
}
