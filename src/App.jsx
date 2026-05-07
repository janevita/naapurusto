import { useState } from 'react'
import { MOCK_POSTS } from './data/mock.js'
import Header      from './components/Header.jsx'
import BottomNav   from './components/BottomNav.jsx'
import FeedView    from './components/FeedView.jsx'
import ReportView  from './components/ReportView.jsx'
import IdeasView   from './components/IdeasView.jsx'
import CommunityView from './components/CommunityView.jsx'
import CreatePost  from './components/CreatePost.jsx'
import { PlusIcon } from './components/Icons.jsx'

export default function App() {
  const [tab, setTab]               = useState('feed')
  const [neighbourhood, setNB]      = useState('Kallio')
  const [posts, setPosts]           = useState(MOCK_POSTS)
  const [showCreate, setShowCreate] = useState(false)

  function handleVote(id, dir) {
    setPosts(prev => prev.map(p => {
      if (p.id !== id) return p
      const wasVoted = p.voted === dir
      return {
        ...p,
        voted: wasVoted ? null : dir,
        votes: wasVoted ? p.votes - 1 : (p.voted ? p.votes : p.votes + 1),
      }
    }))
  }

  function handleNewPost(data) {
    const newPost = {
      id: Date.now(),
      type: data.type,
      author: data.anonymous
        ? { name: 'Anonymous', initials: '?', verified: false }
        : { name: 'Jane V.',   initials: 'JV', verified: false },
      neighbourhood: data.neighbourhood,
      timeAgo: 'just now',
      title: data.title,
      body: data.body,
      votes: 0,
      commentCount: 0,
      tags: [],
      anonymous: data.anonymous,
      voted: null,
    }
    setPosts(prev => [newPost, ...prev])
    setTab('feed')
  }

  const TAB_TITLES = {
    feed:       `Feed · ${neighbourhood}`,
    report:     'Report an Issue',
    ideas:      'Ideas & Proposals',
    community:  'Community',
  }

  return (
    <div className="min-h-screen bg-light">
      <Header
        neighbourhood={neighbourhood}
        onNeighbourhoodChange={setNB}
      />

      {/* Page title strip */}
      {tab !== 'feed' && (
        <div className="bg-white border-b border-border">
          <div className="max-w-lg mx-auto px-4 py-2.5">
            <h1 className="font-bold text-natext text-base">{TAB_TITLES[tab]}</h1>
          </div>
        </div>
      )}

      {/* Content */}
      {tab === 'feed'      && <FeedView      posts={posts} onVote={handleVote} neighbourhood={neighbourhood} />}
      {tab === 'report'    && <ReportView    neighbourhood={neighbourhood} />}
      {tab === 'ideas'     && <IdeasView     neighbourhood={neighbourhood} />}
      {tab === 'community' && <CommunityView neighbourhood={neighbourhood} />}

      {/* FAB */}
      {(tab === 'feed' || tab === 'ideas') && (
        <button
          onClick={() => setShowCreate(true)}
          className="fixed bottom-20 right-4 z-30 w-14 h-14 bg-primary rounded-2xl shadow-lg
            flex items-center justify-center text-white
            hover:bg-dark transition-all active:scale-95"
          style={{ boxShadow: '0 4px 20px rgba(13,122,140,0.45)' }}
        >
          <PlusIcon className="w-7 h-7" />
        </button>
      )}

      <BottomNav active={tab} onChange={setTab} />

      {showCreate && (
        <CreatePost
          neighbourhood={neighbourhood}
          onClose={() => setShowCreate(false)}
          onSubmit={handleNewPost}
        />
      )}
    </div>
  )
}
