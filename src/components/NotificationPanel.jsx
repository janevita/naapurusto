import { XIcon } from './Icons.jsx'

const TYPE_ICONS = {
  vote:    { emoji: '👍', bg: 'bg-primary/10 text-primary' },
  comment: { emoji: '💬', bg: 'bg-mid/10 text-mid' },
  post:    { emoji: '📍', bg: 'bg-accent/20 text-dark' },
  status:  { emoji: '✅', bg: 'bg-green-100 text-green-700' },
}

export default function NotificationPanel({ notifications, onClose, onMarkAllRead }) {
  const unread = notifications.filter(n => !n.read).length

  return (
    <div className="fixed inset-0 z-50 flex flex-col" onClick={onClose}
      style={{ background: 'rgba(10,61,82,0.4)', backdropFilter: 'blur(3px)' }}>
      <div className="mt-14 mx-auto w-full max-w-lg bg-white rounded-b-3xl shadow-2xl flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-natext">Notifications</h2>
            {unread > 0 && (
              <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">{unread}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {unread > 0 && (
              <button onClick={onMarkAllRead} className="text-xs text-primary font-semibold">
                Mark all read
              </button>
            )}
            <button onClick={onClose}
              className="w-7 h-7 rounded-full bg-light flex items-center justify-center text-muted">
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto divide-y divide-border">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-muted text-sm">No notifications yet</div>
          ) : (
            notifications.map(n => {
              const icon = TYPE_ICONS[n.type] || TYPE_ICONS.post
              return (
                <div key={n.id}
                  className={`flex gap-3 px-4 py-3 transition-colors ${n.read ? '' : 'bg-primary/5'}`}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${icon.bg}`}>
                    {icon.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-snug ${n.read ? 'text-muted' : 'text-natext font-medium'}`}>
                      {n.text}
                    </p>
                    <p className="text-xs text-muted mt-0.5">{n.timeAgo}</p>
                  </div>
                  {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
