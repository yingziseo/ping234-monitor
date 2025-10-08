'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// 修复 Leaflet 默认图标问题
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface IPMapProps {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export default function IPMap({ latitude, longitude, city, country }: IPMapProps) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={10}
      style={{ height: '400px', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]}>
        <Popup>
          <div className="text-center">
            <strong>{city || '未知城市'}</strong>
            <br />
            {country || '未知国家'}
            <br />
            <small>
              {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </small>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
