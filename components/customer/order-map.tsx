'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface OrderMapProps {
  driverLocation?: { lat: number; lng: number }
  pickupLocation: { lat: number; lng: number }
}

// Custom driver icon
const driverIcon = L.divIcon({
  className: 'custom-driver-icon',
  html: `
    <div style="
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
      border: 3px solid white;
    ">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
        <path d="M15 18H9"/>
        <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
        <circle cx="17" cy="18" r="2"/>
        <circle cx="7" cy="18" r="2"/>
      </svg>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18]
})

// Custom home icon
const homeIcon = L.divIcon({
  className: 'custom-home-icon',
  html: `
    <div style="
      width: 32px;
      height: 32px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border: 3px solid #10B981;
    ">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
})

export default function OrderMap({ driverLocation, pickupLocation }: OrderMapProps) {
  const [animatedDriverPos, setAnimatedDriverPos] = useState(driverLocation)

  // Simulate driver movement
  useEffect(() => {
    if (!driverLocation) return

    const interval = setInterval(() => {
      setAnimatedDriverPos(prev => {
        if (!prev) return driverLocation
        return {
          lat: prev.lat + (Math.random() - 0.5) * 0.001,
          lng: prev.lng + (Math.random() - 0.5) * 0.001
        }
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [driverLocation])

  const center = driverLocation || pickupLocation

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={14}
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Pickup Location */}
      <Marker position={[pickupLocation.lat, pickupLocation.lng]} icon={homeIcon}>
        <Popup>
          <div className="text-sm font-medium">Pickup Location</div>
        </Popup>
      </Marker>

      {/* Driver Location */}
      {animatedDriverPos && (
        <Marker position={[animatedDriverPos.lat, animatedDriverPos.lng]} icon={driverIcon}>
          <Popup>
            <div className="text-sm font-medium">Driver Location</div>
          </Popup>
        </Marker>
      )}

      {/* Route Line */}
      {animatedDriverPos && (
        <Polyline
          positions={[
            [animatedDriverPos.lat, animatedDriverPos.lng],
            [pickupLocation.lat, pickupLocation.lng]
          ]}
          pathOptions={{
            color: '#0EA5E9',
            weight: 4,
            opacity: 0.8,
            dashArray: '10, 10'
          }}
        />
      )}
    </MapContainer>
  )
}
