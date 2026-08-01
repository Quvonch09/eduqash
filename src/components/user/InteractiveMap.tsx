"use client";

import { useEffect, useState } from "react";
import { LearningCenter } from "@/types";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { MapPin, Star, Phone, BookOpen, ExternalLink } from "lucide-react";

interface InteractiveMapProps {
  centers: LearningCenter[];
  onSelectCenter: (center: LearningCenter) => void;
  selectedCenterId?: string | null;
}

export default function InteractiveMap({
  centers,
  onSelectCenter,
}: InteractiveMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full min-h-[400px] bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-slate-400">
        <MapPin className="w-8 h-8 mr-2 animate-bounce text-brand-600" />
        <span className="font-medium">Xarita yuklanmoqda...</span>
      </div>
    );
  }

  const customIcon = L.divIcon({
    className: "custom-div-icon",
    html: `<div class="custom-marker-pin"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
  });

  // Default Qashqadaryo center (Qarshi)
  const defaultLat = 38.8605;
  const defaultLng = 65.7891;

  return (
    <div className="w-full h-full min-h-[420px] rounded-2xl overflow-hidden shadow-lg border border-slate-200 relative">
      <MapContainer
        center={[defaultLat, defaultLng]}
        zoom={11}
        scrollWheelZoom={true}
        className="w-full h-full min-h-[420px]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {centers.map((center) => (
          <Marker
            key={center.id}
            position={[center.lat, center.lng]}
            icon={customIcon}
          >
            <Popup className="custom-popup max-w-xs">
              <div className="p-1">
                <div className="h-28 w-full rounded-lg overflow-hidden mb-2">
                  <img
                    src={center.image}
                    alt={center.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-semibold px-2 py-0.5 bg-brand-50 text-brand-700 rounded-md">
                    {center.district}
                  </span>
                  <div className="flex items-center text-amber-500 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                    {center.rating}
                  </div>
                </div>
                <h4 className="font-bold text-slate-900 text-sm leading-tight mb-1">
                  {center.name}
                </h4>
                <p className="text-xs text-slate-500 mb-2 line-clamp-2">
                  {center.address}
                </p>
                <button
                  onClick={() => onSelectCenter(center)}
                  className="w-full py-1.5 px-3 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center transition"
                >
                  <BookOpen className="w-3.5 h-3.5 mr-1" />
                  Markazni ko'rish
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
