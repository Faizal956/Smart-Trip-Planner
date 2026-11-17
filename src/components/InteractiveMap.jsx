import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DESTINATIONS } from '../data/destinations';

// Fix Leaflet's default marker icon paths in React/Vite
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom numbered icon for ordered routes
function createNumberedIcon(number, isStart = false) {
  const bgColor = isStart ? '#0d9488' : '#0284c7';
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${bgColor};
        color: white;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 13px;
        border: 2px solid white;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
      ">
        ${number}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
}

export default function InteractiveMap({
  destinationIds = [],
  routeOrder = [],
  highlightPath = [],
  height = "420px",
  interactive = true
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if not yet created
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: interactive,
        dragging: interactive
      }).setView([20.5937, 78.9629], 5); // India center

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      layerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    // Determine nodes to display
    const activeIds = routeOrder.length > 0
      ? routeOrder
      : (highlightPath.length > 0 ? highlightPath : destinationIds);

    const latLngs = [];
    const pointsToFit = [];

    // Add markers
    activeIds.forEach((id, idx) => {
      const dest = DESTINATIONS.find(d => d.id === id);
      if (dest) {
        const point = [dest.lat, dest.lng];
        pointsToFit.push(point);

        const isStart = idx === 0;
        const icon = routeOrder.length > 0 || highlightPath.length > 0
          ? createNumberedIcon(idx + 1, isStart)
          : defaultIcon;

        const marker = L.marker(point, { icon });

        // Popup content
        const popupContent = `
          <div style="font-family: sans-serif; min-width: 180px; max-width: 240px; padding: 2px;">
            <img src="${dest.image}" style="width: 100%; height: 90px; object-fit: cover; border-radius: 6px; margin-bottom: 6px;" alt="${dest.name}" />
            <h4 style="margin: 0; font-size: 15px; font-weight: 700; color: #0f172a;">${dest.name}</h4>
            <p style="margin: 2px 0 6px; font-size: 12px; color: #64748b;">${dest.tagline}</p>
            <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 600; color: #0d9488;">
              <span>⭐ ${dest.rating}</span>
              <span>₹${dest.estimatedCostPerDay.toLocaleString('en-IN')}/day</span>
            </div>
          </div>
        `;
        marker.bindPopup(popupContent);
        layerGroup.addLayer(marker);

        latLngs.push(point);
      }
    });

    // Draw route polyline if multiple connected points exist
    if (latLngs.length > 1) {
      const polyline = L.polyline(latLngs, {
        color: '#0d9488',
        weight: 4,
        opacity: 0.85,
        dashArray: highlightPath.length > 0 ? '6, 8' : null
      });
      layerGroup.addLayer(polyline);
    }

    // Adjust map viewport to fit all points
    if (pointsToFit.length > 0) {
      map.fitBounds(L.latLngBounds(pointsToFit), {
        padding: [40, 40],
        maxZoom: 9
      });
    } else {
      map.setView([20.5937, 78.9629], 5);
    }

    // Trigger map invalidation for correct layout resizing
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

  }, [destinationIds, routeOrder, highlightPath, interactive]);

  // Clean up map instance on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
      <div ref={mapContainerRef} style={{ height }} className="w-full z-0" />
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 shadow-sm border border-slate-200 z-[400] flex items-center space-x-2">
        <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block animate-pulse"></span>
        <span>Interactive Leaflet Map • OpenStreetMap Data</span>
      </div>
    </div>
  );
}
