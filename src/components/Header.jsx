import { useState } from 'react'
import { NEIGHBOURHOODS } from '../data/mock.js'
import { ChevronDownIcon, BellIcon, MapPinIcon, SearchIcon } from './Icons.jsx'

export default function Header({
  neighbourhood,
  onNeighbourhoodChange,
  notifCount = 0,
  onBellClick,
  onSearchClick,
  onLogoTap,
}) {
  const [open, setOpen] = useState(false)
  const [tapCount, setTapCount] = useState(0)

  function handleLogoTap() {
    const next = tapCount + 1
    setTapCount(next)
    if (next >= 5) { setTapCount(0); onLogoTap?.() }
    else setTimeout(() => setTapCount(0), 2000)
  }

  return (
    <header className="bg-dark text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={handleLogoTap}
          className="flex items-center gap-2 select-none active:opacity-70 transition-opacity"
        >
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
            <MapPinIcon className="w-4 h-4 text-dark" />
          </div>
          <span className="font-bold text-lg tracking-tight">Naapurusto</span>
        </button>

        {/* Neighbourhood selector */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 transition-colors rounded-full px-3 py-1.5 text-sm font-medium"
          >
            <span>{neighbourhood}</span>
            <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-border overflow-hidden z-50">
              {NEIGHBOURHOODS.map(n => (
                <button
                  key={n}
                  onClick={() => { onNeighbourhoodChange(n); setOpen(false) }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                    ${n === neighbourhood
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-natext hover:bg-light'
                    }`}
                >
                  {n}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={onSearchClick}
            className="relative p-1.5 hover:bg-white/10 rounded-full transition-colors"
          >
            <SearchIcon className="w-5 h-5" />
          </button>

          <button
            onClick={onBellClick}
            className="relative p-1.5 hover:bg-white/10 rounded-full transition-colors"
          >
            <BellIcon className="w-6 h-6" />
            {notifCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-accent text-dark rounded-full text-[10px] font-bold flex items-center justify-center leading-none">
                {notifCount > 9 ? '9+' : notifCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
