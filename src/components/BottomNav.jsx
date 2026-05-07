import { HomeIcon, AlertIcon, LightbulbIcon, UsersIcon } from './Icons.jsx'

const TABS = [
  { id: 'feed',      label: 'Feed',      Icon: HomeIcon },
  { id: 'report',   label: 'Report',    Icon: AlertIcon },
  { id: 'ideas',    label: 'Ideas',     Icon: LightbulbIcon },
  { id: 'community',label: 'Community', Icon: UsersIcon },
]

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border safe-bottom">
      <div className="max-w-lg mx-auto flex">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 group"
            >
              <Icon
                className={`w-6 h-6 transition-colors ${
                  isActive ? 'text-primary' : 'text-muted group-hover:text-primary'
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-muted group-hover:text-primary'
                }`}
              >
                {label}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-b-full" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
