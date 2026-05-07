import { useState } from 'react'
import {
  MOCK_POSTS, MOCK_IDEAS, MOCK_NOTIFICATIONS, MOCK_USERS,
} from './data/mock.js'
import Header           from './components/Header.jsx'
import BottomNav        from './components/BottomNav.jsx'
import FeedView         from './components/FeedView.jsx'
import ReportView       from './components/ReportView.jsx'
import IdeasView        from './components/IdeasView.jsx'
import CommunityView    from './components/CommunityView.jsx'
import MapView          from './components/MapView.jsx'
import CreatePost       from './components/CreatePost.jsx'
import PostModal        from './components/PostModal.jsx'
import NotificationPanel from './components/NotificationPanel.jsx'
import SearchOverlay    from './components/SearchOverlay.jsx'
import AuthModal        from './components/AuthModal.jsx'
import ProfileView      from './components/ProfileView.jsx'
import AdminPanel       from './components/AdminPanel.jsx'
import { PlusIcon, UserIcon } from './components/Icons.jsx'

export default function App() {
  // ── Core state ──────────────────────────────────────────────────────────
  const [tab, setTab]               = useState('feed')
  const [neighbourhood, setNB]      = useState('Kallio')
  const [posts, setPosts]           = useState(MOCK_POSTS)
  const [ideas, setIdeas]           = useState(MOCK_IDEAS)
  const [notifications, setNotifs]  = useState(MOCK_NOTIFICATIONS)

  // ── Auth state ───────────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(MOCK_USERS[0]) // Jane Vita logged in by default
  const [showAuth, setShowAuth]       = useState(false)
  const [profileUser, setProfileUser] = useState(null) // whose profile to show

  // ── UI overlays ──────────────────────────────────────────────────────────
  const [showCreate, setShowCreate]   = useState(false)
  const [openPost, setOpenPost]       = useState(null)
  const [showNotifs, setShowNotifs]   = useState(false)
  const [showSearch, setShowSearch]   = useState(false)
  const [showAdmin, setShowAdmin]     = useState(false)

  // ── Computed ──────────────────────────────────────────────────────────────
  const unreadCount = notifications.filter(n => !n.read).length

  // ── Handlers ─────────────────────────────────────────────────────────────
  function handleVote(id, dir) {
    setPosts(prev => prev.map(p => {
      if (p.id !== id) return p
      const wasVoted = p.voted === dir
      return { ...p, voted: wasVoted ? null : dir, votes: wasVoted ? p.votes - 1 : (p.voted ? p.votes : p.votes + 1) }
    }))
    // Sync openPost if it matches
    setOpenPost(prev => {
      if (!prev || prev.id !== id) return prev
      const wasVoted = prev.voted === dir
      return { ...prev, voted: wasVoted ? null : dir, votes: wasVoted ? prev.votes - 1 : (prev.voted ? prev.votes : prev.votes + 1) }
    })
  }

  function handleNewPost(data) {
    const newPost = {
      id: Date.now(),
      type: data.type,
      authorId: data.anonymous ? null : currentUser?.id,
      author: data.anonymous
        ? { name: 'Anonymous', initials: '?', verified: false }
        : { name: currentUser?.name || 'You', initials: currentUser?.initials || 'Y', verified: currentUser?.verified || false },
      neighbourhood: data.neighbourhood,
      timeAgo: 'just now',
      title: data.title,
      body: data.body,
      imageUrl: data.imageUrl || null,
      votes: 0,
      commentCount: 0,
      tags: [],
      anonymous: data.anonymous,
      voted: null,
      lat: null, lng: null,
    }
    setPosts(prev => [newPost, ...prev])
    setTab('feed')
  }

  function handleMarkAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  }

  function handleLogin(user) {
    setCurrentUser(user)
    setShowAuth(false)
  }

  function handleLogout() {
    setCurrentUser(null)
    setProfileUser(null)
    setTab('feed')
  }

  function handleOpenPost(post) {
    // Sync with latest posts state
    const latest = posts.find(p => p.id === post.id) || post
    setOpenPost(latest)
  }

  function handleOpenProfile(user) {
    setProfileUser(user)
    setTab('profile')
  }

  // Admin handlers
  function handleUpdatePost(updated) {
    setPosts(prev => prev.map(p => p.id === updated.id ? updated : p))
    if (openPost?.id === updated.id) setOpenPost(updated)
  }
  function handleDeletePost(id) {
    setPosts(prev => prev.filter(p => p.id !== id))
    if (openPost?.id === id) setOpenPost(null)
  }
  function handleUpdateIdea(updated) {
    setIdeas(prev => prev.map(i => i.id === updated.id ? updated : i))
  }
  function handleDeleteIdea(id) {
    setIdeas(prev => prev.filter(i => i.id !== id))
  }

  // ── Render ────────────────────────────────────────────────────────────────
  const showFAB = (tab === 'feed' || tab === 'ideas') && tab !== 'profile'

  return (
    <div className="min-h-screen bg-light">
      <Header
        neighbourhood={neighbourhood}
        onNeighbourhoodChange={setNB}
        notifCount={unreadCount}
        onBellClick={() => setShowNotifs(true)}
        onSearchClick={() => setShowSearch(true)}
        onLogoTap={() => setShowAdmin(true)}
      />

      {/* Profile tab header */}
      {tab === 'profile' && profileUser && (
        <div className="bg-white border-b border-border sticky top-14 z-30">
          <div className="max-w-lg mx-auto px-4 py-2.5 flex items-center gap-2">
            <button onClick={() => setTab('community')} className="text-primary text-sm font-semibold mr-1">← Back</button>
            <h1 className="font-bold text-natext text-base">{profileUser.name}</h1>
          </div>
        </div>
      )}

      {/* Page title strip for non-feed tabs */}
      {tab !== 'feed' && tab !== 'map' && tab !== 'profile' && (
        <div className="bg-white border-b border-border">
          <div className="max-w-lg mx-auto px-4 py-2.5">
            <h1 className="font-bold text-natext text-base">
              {tab === 'report' && 'Report an Issue'}
              {tab === 'ideas'  && 'Ideas & Proposals'}
              {tab === 'community' && 'Community'}
            </h1>
          </div>
        </div>
      )}

      {/* Main views */}
      <div className={tab === 'map' ? 'fixed inset-0 top-14 bottom-14 z-0' : ''}>
        {tab === 'feed'      && <FeedView posts={posts} onVote={handleVote} neighbourhood={neighbourhood} onOpenPost={handleOpenPost} currentUser={currentUser} />}
        {tab === 'report'    && <ReportView neighbourhood={neighbourhood} posts={posts} onOpenPost={handleOpenPost} />}
        {tab === 'map'       && <MapView posts={posts} onOpenPost={handleOpenPost} />}
        {tab === 'ideas'     && <IdeasView neighbourhood={neighbourhood} ideas={ideas} />}
        {tab === 'community' && <CommunityView neighbourhood={neighbourhood} onOpenProfile={handleOpenProfile} />}
        {tab === 'profile'   && profileUser && (
          <ProfileView
            user={profileUser}
            allPosts={posts}
            currentUser={currentUser}
            onVote={handleVote}
            onOpenPost={handleOpenPost}
            onLogout={handleLogout}
          />
        )}
      </div>

      {/* Auth / Profile FAB for signed-out users */}
      {!currentUser && (
        <button
          onClick={() => setShowAuth(true)}
          className="fixed top-14 right-0 z-30 mt-3 mr-4 bg-white border border-border text-primary text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5"
        >
          <UserIcon className="w-4 h-4" />
          Sign in
        </button>
      )}

      {/* My profile button (signed in, not on profile tab) */}
      {currentUser && tab !== 'profile' && (
        <button
          onClick={() => { setProfileUser(currentUser); setTab('profile') }}
          className="fixed bottom-[72px] left-4 z-30 w-9 h-9 rounded-full bg-primary text-white text-xs font-bold shadow-md flex items-center justify-center border-2 border-white"
          title="My profile"
        >
          {currentUser.initials}
        </button>
      )}

      {/* FAB - new post */}
      {showFAB && (
        <button
          onClick={() => currentUser ? setShowCreate(true) : setShowAuth(true)}
          className="fixed bottom-20 right-4 z-30 w-14 h-14 bg-primary rounded-2xl shadow-lg
            flex items-center justify-center text-white
            hover:bg-dark transition-all active:scale-95"
          style={{ boxShadow: '0 4px 20px rgba(13,122,140,0.45)' }}
        >
          <PlusIcon className="w-7 h-7" />
        </button>
      )}

      <BottomNav active={tab} onChange={t => { setTab(t); if (t !== 'profile') setProfileUser(null) }} />

      {/* ── Overlays ── */}

      {showCreate && (
        <CreatePost
          neighbourhood={neighbourhood}
          currentUser={currentUser}
          onClose={() => setShowCreate(false)}
          onSubmit={handleNewPost}
        />
      )}

      {openPost && (
        <PostModal
          post={openPost}
          currentUser={currentUser}
          onClose={() => setOpenPost(null)}
          onVote={handleVote}
        />
      )}

      {showNotifs && (
        <NotificationPanel
          notifications={notifications}
          onClose={() => setShowNotifs(false)}
          onMarkAllRead={handleMarkAllRead}
        />
      )}

      {showSearch && (
        <SearchOverlay
          posts={posts}
          onClose={() => setShowSearch(false)}
          onOpenPost={(post) => { handleOpenPost(post); setShowSearch(false) }}
        />
      )}

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onLogin={handleLogin}
        />
      )}

      {showAdmin && (
        <AdminPanel
          posts={posts}
          ideas={ideas}
          onClose={() => setShowAdmin(false)}
          onUpdatePost={handleUpdatePost}
          onDeletePost={handleDeletePost}
          onUpdateIdea={handleUpdateIdea}
          onDeleteIdea={handleDeleteIdea}
        />
      )}
    </div>
  )
}
