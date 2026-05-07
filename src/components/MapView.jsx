import { useEffect, useRef, useState } from 'react'
import { POST_TYPES } from '../data/mock.js'

const TYPE_EMOJI = { news: '📰', report: '⚠️', idea: '💡', event: '📅' }
const TYPE_COLOR = { news: '#0D7A8C', report: '#dc2626', idea: '#F2A541', event: '#1CA8BB' }

export default function MapView({ posts, onOpenPost }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const [filter, setFilter] = useState('all')
  const markersRef = useRef([])

  useEffect(() => {
    if (mapInstanceRef.current) return

    // Dynamically load Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    // Dynamically load Leaflet JS
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => initMap()
    document.head.appendChild(script)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  function initMap() {
    if (!mapRef.current || mapInstanceRef.current) return
    const L = window.L
    const map = L.map(mapRef.current, { zoomControl: false }).setView([60.1699, 24.9384], 13)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)
    L.control.zoom({ position: 'bottomright' }).addTo(map)
    mapInstanceRef.current = map
    renderMarkers(map, 'all')
  }

  function renderMarkers(map, currentFilter) {
    const L = window.L
    if (!L) return
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    posts
      .filter(p => currentFilter === 'all' || p.type === currentFilter)
      .filter(p => p.lat && p.lng)
      .forEach(post => {
        const color = TYPE_COLOR[post.type] || TYPE_COLOR.news
        const emoji = TYPE_EMOJI[post.type] || '📍'
        const icon = L.divIcon({
          className: '',
          html: `<div style="width:36px;height:36px;border-radius:50% 50% 50% 0;background:${color};transform:rotate(-45deg);border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
            <span style="transform:rotate(45deg);font-size:16px;line-height:1;">${emoji}</span></div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -38],
        })
        const marker = L.marker([post.lat, post.lng], { icon }).addTo(map)
        const typeStyle = POST_TYPES[post.type] || POST_TYPES.news
        marker.bindPopup(`
          <div style="min-width:200px;font-family:Inter,sans-serif;">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
              <span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:99px;background:${color};color:white;">
                ${typeStyle.label.toUpperCase()}
              </span>
              <span style="font-size:10px;color:#6b7280;">${post.neighbourhood}</span>
            </div>
            <p style="font-size:13px;font-weight:600;margin:0 0 4px;color:#0A3D52;line-height:1.3;">${post.title}</p>
            <p style="font-size:11px;color:#6b7280;margin:0 0 8px;line-height:1.4;">${post.body.slice(0, 90)}…</p>
            <button id="popup-open-${post.id}" style="font-size:11px;color:#0D7A8C;font-weight:600;background:none;border:none;cursor:pointer;padding:0;">
              View post →
            </button>
          </div>
        `, { maxWidth: 260 })
        marker.on('popupopen', () => {
          setTimeout(() => {
            document.getElementById(`popup-open-${post.id}`)?.addEventListener('click', () => {
              onOpenPost(post)
              marker.closePopup()
            })
          }, 50)
        })
        markersRef.current.push(marker)
      })
  }

  const handleFilter = (type) => {
    setFilter(type)
    if (mapInstanceRef.current) renderMarkers(mapInstanceRef.current, type)
  }

  const filterTypes = [
    { key: 'all', label: 'All' },
    { key: 'news', label: '📰 News' },
    { key: 'report', label: '⚠️ Reports' },
    { key: 'idea', label: '💡 Ideas' },
    { key: 'event', label: '📅 Events' },
  ]

  return (
    <div className="flex flex-col h-full relative">
      {/* Filter pills */}
      <div className="absolute top-3 left-0 right-0 z-10 flex gap-2 px-3 overflow-x-auto hide-scrollbar">
        {filterTypes.map(f => (
          <button key={f.key} onClick={() => handleFilter(f.key)}
            className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full shadow transition-colors ${
              filter === f.key
                ? 'bg-primary text-white'
                : 'bg-white text-natext border border-border'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Map container */}
      <div ref={mapRef} className="flex-1 w-full" style={{ minHeight: 0 }} />
    </div>
  )
}
