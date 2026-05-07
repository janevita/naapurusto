import { useState } from 'react'
import { XIcon, ShieldCheckIcon } from './Icons.jsx'
import { MOCK_USERS, NEIGHBOURHOODS } from '../data/mock.js'

export default function AuthModal({ onClose, onLogin }) {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [form, setForm] = useState({ name: '', email: '', neighbourhood: 'Kallio', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSignIn = () => {
    setError('')
    const user = MOCK_USERS.find(u => u.name.toLowerCase().includes(form.email.toLowerCase()) ||
      form.email.toLowerCase() === 'jane.vita@gmail.com')
    if (!form.email) { setError('Enter your email or name'); return }
    setLoading(true)
    setTimeout(() => {
      // Match by email prefix or just log in as Jane for demo
      const matched = MOCK_USERS.find(u => form.email.toLowerCase().includes(u.name.split(' ')[0].toLowerCase()))
        || MOCK_USERS[0]
      setLoading(false)
      onLogin(matched)
    }, 800)
  }

  const handleSignUp = () => {
    setError('')
    if (!form.name.trim()) { setError('Enter your name'); return }
    if (!form.email.trim()) { setError('Enter your email'); return }
    if (form.password.length < 4) { setError('Password too short'); return }
    setLoading(true)
    setTimeout(() => {
      const newUser = {
        id: 'u_new',
        name: form.name.trim(),
        initials: form.name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
        neighbourhood: form.neighbourhood,
        bio: 'New Naapurusto member.',
        posts: 0,
        votes: 0,
        badge: 'Newcomer',
        verified: false,
      }
      setLoading(false)
      onLogin(newUser)
    }, 900)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(10,61,82,0.5)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}>
      <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-lg text-natext">
              {mode === 'signin' ? 'Sign in' : 'Create account'}
            </h2>
            <p className="text-xs text-muted mt-0.5">Join your neighbourhood community</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-light flex items-center justify-center text-muted">
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Demo user quick-select (sign in only) */}
        {mode === 'signin' && (
          <div className="mb-4">
            <p className="text-xs text-muted font-medium mb-2">Quick demo login:</p>
            <div className="flex gap-2 flex-wrap">
              {MOCK_USERS.slice(0, 4).map(u => (
                <button key={u.id} onClick={() => onLogin(u)}
                  className="flex items-center gap-1.5 bg-light rounded-full px-2.5 py-1 text-xs font-medium text-natext hover:bg-primary/10 transition-colors">
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center">{u.initials}</span>
                  {u.name.split(' ')[0]}
                  {u.verified && <ShieldCheckIcon className="w-3 h-3 text-primary" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        {mode === 'signin' && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted">or sign in manually</span>
            <div className="flex-1 h-px bg-border" />
          </div>
        )}

        {/* Form */}
        <div className="flex flex-col gap-3">
          {mode === 'signup' && (
            <div>
              <label className="text-xs font-semibold text-muted block mb-1">Full name</label>
              <input value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="Your name"
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary transition-colors" />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-muted block mb-1">Email</label>
            <input value={form.email} onChange={e => set('email', e.target.value)}
              placeholder="you@example.com" type="email"
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary transition-colors" />
          </div>

          {mode === 'signup' && (
            <div>
              <label className="text-xs font-semibold text-muted block mb-1">Neighbourhood</label>
              <select value={form.neighbourhood} onChange={e => set('neighbourhood', e.target.value)}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary transition-colors bg-white">
                {NEIGHBOURHOODS.filter(n => n !== 'All Helsinki').map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-muted block mb-1">Password</label>
            <input value={form.password} onChange={e => set('password', e.target.value)}
              placeholder={mode === 'signup' ? 'Create a password' : 'Your password'}
              type="password"
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary transition-colors" />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            onClick={mode === 'signin' ? handleSignIn : handleSignUp}
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-3 rounded-xl mt-1 disabled:opacity-60 transition-opacity">
            {loading ? '…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </div>

        {/* Toggle */}
        <p className="text-xs text-center text-muted mt-4">
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError('') }}
            className="text-primary font-semibold">
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
