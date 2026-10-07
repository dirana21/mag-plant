import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, ExternalLink, Copy, Check } from 'lucide-react';

interface InteractiveMapProps {
  lat?: number;
  lng?: number;
  address?: string;
  companyName?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  lat = 50.3660,
  lng = 30.5600,
  address = 'м. Київ, вул. Промислова, 14',
  companyName = 'Завод «MAG» — Переробка шин та гумотехніка'
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    // Initialize Leaflet map
    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    mapInstanceRef.current = map;

    // High tech / modern CartoDB Dark Matter or OpenStreetMap tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    // Custom Industrial MAG Marker
    const customIcon = L.divIcon({
      className: 'custom-mag-marker',
      html: `
        <div style="
          position: relative;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translate(-10px, -20px);
        ">
          <div style="
            position: absolute;
            width: 44px;
            height: 44px;
            background: rgba(16, 185, 129, 0.35);
            border-radius: 50%;
            animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
          <div style="
            position: relative;
            background: #0f172a;
            border: 2px solid #10b981;
            box-shadow: 0 0 15px rgba(16, 185, 129, 0.6);
            width: 36px;
            height: 36px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #10b981;
            font-weight: 900;
            font-size: 13px;
            font-family: sans-serif;
          ">
            MAG
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });

    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

    marker.bindPopup(`
      <div style="font-family: sans-serif; padding: 4px; color: #0f172a;">
        <b style="font-size: 14px; color: #059669;">${companyName}</b><br/>
        <span style="font-size: 12px; color: #475569;">${address}</span><br/>
        <span style="font-size: 11px; color: #16a34a; font-weight: bold; margin-top: 4px; display: inline-block;">✓ Заїзд для фур та великогабаритного транспорту</span>
      </div>
    `).openPopup();

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [lat, lng, address, companyName]);

  const copyCoords = () => {
    navigator.clipboard.writeText(`${lat}, ${lng}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const wazeUrl = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
      {/* Top Map Bar */}
      <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold text-white">
            Локація заводу на карті: {address}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyCoords}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white text-xs border border-slate-800 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Скопійовано!' : `${lat.toFixed(4)}, ${lng.toFixed(4)}`}</span>
          </button>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs border border-emerald-500/30 transition-colors font-medium"
          >
            <span>Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href={wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 text-xs border border-slate-800 transition-colors"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Waze</span>
          </a>
        </div>
      </div>

      {/* Map Viewport */}
      <div ref={mapContainerRef} className="w-full h-[400px] sm:h-[480px] z-10" />

      {/* Map Footer Note */}
      <div className="p-3 bg-slate-950 text-slate-400 text-xs flex items-center justify-between border-t border-slate-800/80">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          КПП №1: Промислова зона «Корчувате», зручний розворот для вантажівок
        </span>
        <span className="hidden sm:inline text-slate-400">Цілодобовий заїзд на розвантаження шин</span>
      </div>
    </div>
  );
};
