// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import axiosInstance from "../api/axiosInstance";

// // ─── Constants ────────────────────────────────────────────────────────────────
// const BRAND = "#FF5252";
// const POLL_INTERVAL = 3000; // 3 seconds me refresh

// // ─── API ──────────────────────────────────────────────────────────────────────
// const apiTrackOrder = (orderId) =>
//   axiosInstance.get(`/orders/${orderId}/trackvendor`, { withCredentials: true });

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// const formatUpdatedAt = (timestamp) => {
//   if (!timestamp) return "—";
//   const diff = Math.floor((Date.now() - timestamp) / 1000);
//   if (diff < 10) return "Just now";
//   if (diff < 60) return `${diff}s ago`;
//   if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
//   return new Date(timestamp).toLocaleTimeString("en-IN");
// };

// // ─── Map Component ────────────────────────────────────────────────────────────
// const TrackingMap = ({ driverLat, driverLng, orderId }) => {
//   const mapRef = useRef(null);
//   const mapInstanceRef = useRef(null);
//   const markerRef = useRef(null);
//   const [mapLoaded, setMapLoaded] = useState(false);

//   // Load Leaflet dynamically
//   useEffect(() => {
//     if (window.L) { setMapLoaded(true); return; }

//     // Load Leaflet CSS
//     const link = document.createElement("link");
//     link.rel = "stylesheet";
//     link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
//     document.head.appendChild(link);

//     // Load Leaflet JS
//     const script = document.createElement("script");
//     script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
//     script.onload = () => setMapLoaded(true);
//     document.head.appendChild(script);
//   }, []);

//   // Init map
//   useEffect(() => {
//     if (!mapLoaded || !mapRef.current || mapInstanceRef.current) return;
//     if (!driverLat || !driverLng) return;

//     const L = window.L;
//     const map = L.map(mapRef.current, {
//       center: [driverLat, driverLng],
//       zoom: 15,
//       zoomControl: true,
//     });

//     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       attribution: "© OpenStreetMap",
//     }).addTo(map);

//     // Custom driver icon
//     const driverIcon = L.divIcon({
//       className: "",
//       html: `
//         <div style="
//           width: 44px; height: 44px;
//           background: #FF5252;
//           border: 3px solid white;
//           border-radius: 50%;
//           display: flex; align-items: center; justify-content: center;
//           font-size: 20px;
//           box-shadow: 0 4px 12px rgba(255,82,82,0.5);
//           animation: pulse 2s infinite;
//         ">🛵</div>
//         <style>
//           @keyframes pulse {
//             0% { box-shadow: 0 0 0 0 rgba(255,82,82,0.4); }
//             70% { box-shadow: 0 0 0 12px rgba(255,82,82,0); }
//             100% { box-shadow: 0 0 0 0 rgba(255,82,82,0); }
//           }
//         </style>
//       `,
//       iconSize: [44, 44],
//       iconAnchor: [22, 22],
//     });

//     const marker = L.marker([driverLat, driverLng], { icon: driverIcon })
//       .addTo(map)
//       .bindPopup(`<b>Driver</b><br>Order: ${orderId}`)
//       .openPopup();

//     mapInstanceRef.current = map;
//     markerRef.current = marker;
//   }, [mapLoaded, driverLat, driverLng, orderId]);

//   // Update marker position
//   useEffect(() => {
//     if (!mapInstanceRef.current || !markerRef.current) return;
//     if (!driverLat || !driverLng) return;

//     markerRef.current.setLatLng([driverLat, driverLng]);
//     mapInstanceRef.current.panTo([driverLat, driverLng], { animate: true, duration: 1 });
//   }, [driverLat, driverLng]);

//   if (!driverLat || !driverLng) {
//     return (
//       <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 rounded-2xl">
//         <div className="text-4xl mb-3">📍</div>
//         <p className="text-gray-500 font-semibold text-sm">Location not available yet</p>
//         <p className="text-gray-400 text-xs mt-1">Waiting for driver location...</p>
//       </div>
//     );
//   }

//   return (
//     <div ref={mapRef} className="w-full h-full rounded-2xl overflow-hidden"
//       style={{ minHeight: 400 }} />
//   );
// };

// // ─── Main ─────────────────────────────────────────────────────────────────────
// function LiveTracking() {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const orderId = searchParams.get("orderId");

//   const [tracking, setTracking] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [lastRefresh, setLastRefresh] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);
//   const intervalRef = useRef(null);

//   const fetchTracking = useCallback(async (isAuto = false) => {
//     if (!orderId) return;
//     if (isAuto) setRefreshing(true);
//     else setLoading(true);
//     setError(null);

//     try {
//       const res = await apiTrackOrder(orderId);
//       const data = res.data;
//       setTracking(data);
//       setLastRefresh(Date.now());
//     } catch (err) {
//       setError(err?.response?.data?.message || "Failed to fetch tracking info.");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, [orderId]);

//   // Initial fetch
//   useEffect(() => {
//     fetchTracking(false);
//   }, [fetchTracking]);

//   // Auto poll every 3 seconds
//   useEffect(() => {
//     intervalRef.current = setInterval(() => fetchTracking(true), POLL_INTERVAL);
//     return () => clearInterval(intervalRef.current);
//   }, [fetchTracking]);

//   // ── No orderId ─────────────────────────────────────────────────────────────
//   if (!orderId) {
//     return (
//       <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
//         <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100 max-w-sm w-full">
//           <div className="text-5xl mb-4">⚠️</div>
//           <h2 className="text-lg font-bold text-gray-800 mb-2">No Order ID</h2>
//           <p className="text-gray-500 text-sm mb-5">Please open tracking from Orders page.</p>
//           <button onClick={() => navigate("/dashboard/orders")}
//             style={{ background: BRAND }}
//             className="px-5 py-2.5 rounded-xl text-white text-sm font-bold hover:opacity-90 transition-opacity">
//             ← Go to Orders
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50 p-4 md:p-6">
//       <div className="max-w-5xl mx-auto">

//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-3">
//             <button onClick={() => navigate(-1)}
//               className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors">
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//                 <path d="M19 12H5M12 19l-7-7 7-7" />
//               </svg>
//             </button>
//             <div>
//               <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Live Tracking</h1>
//               <p className="text-xs text-gray-400 font-mono mt-0.5">{orderId}</p>
//             </div>
//           </div>

//           {/* Refresh indicator */}
//           <div className="flex items-center gap-2">
//             {refreshing && (
//               <span className="text-xs text-blue-500 font-semibold flex items-center gap-1">
//                 <svg width="12" height="12" viewBox="0 0 24 24" className="animate-spin" fill="none" stroke="currentColor" strokeWidth="2.5">
//                   <path d="M21 12a9 9 0 11-6.219-8.56" />
//                 </svg>
//                 Updating...
//               </span>
//             )}
//             {lastRefresh && !refreshing && (
//               <span className="text-xs text-gray-400">
//                 Updated {formatUpdatedAt(lastRefresh)}
//               </span>
//             )}
//             <button onClick={() => fetchTracking(false)}
//               className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors"
//               title="Refresh">
//               <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//                 <path d="M21 2v6h-6M3 12a9 9 0 0115-6.7L21 8M3 22v-6h6M21 12a9 9 0 01-15 6.7L3 16" />
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* Error */}
//         {error && (
//           <div className="mb-4 flex items-center justify-between bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
//             <span>{error}</span>
//             <button onClick={() => fetchTracking(false)}
//               className="ml-4 font-bold underline text-red-600 text-xs">Retry</button>
//           </div>
//         )}

//         {/* Loading skeleton */}
//         {loading && (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//             <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden" style={{ height: 460 }}>
//               <div className="w-full h-full bg-gray-100 animate-pulse" />
//             </div>
//             <div className="space-y-3">
//               {[...Array(4)].map((_, i) => (
//                 <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4">
//                   <div className="h-3 bg-gray-100 rounded animate-pulse mb-2 w-1/2" />
//                   <div className="h-5 bg-gray-100 rounded animate-pulse w-3/4" />
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Main content */}
//         {!loading && tracking && (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

//             {/* Map */}
//             <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden"
//               style={{ height: 460 }}>
//               <TrackingMap
//                 driverLat={tracking.location?.lat}
//                 driverLng={tracking.location?.lng}
//                 orderId={orderId}
//               />
//             </div>

//             {/* Info Panel */}
//             <div className="space-y-3">

//               {/* Status Card */}
//               <div className="bg-white rounded-2xl border border-gray-200 p-4">
//                 <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Tracking Status</p>
//                 <div className="flex items-center gap-2">
//                   <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${tracking.trackingAvailable ? "bg-emerald-500" : "bg-amber-400"}`}
//                     style={tracking.trackingAvailable ? { animation: "pulse 2s infinite" } : {}} />
//                   <span className={`text-sm font-bold ${tracking.trackingAvailable ? "text-emerald-600" : "text-amber-600"}`}>
//                     {tracking.trackingAvailable ? "Live Tracking Active" : "Tracking Unavailable"}
//                   </span>
//                 </div>
//                 <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
//               </div>

//               {/* Driver Card */}
//               <div className="bg-white rounded-2xl border border-gray-200 p-4">
//                 <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Driver Info</p>
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-lg flex-shrink-0"
//                     style={{ background: BRAND }}>
//                     🛵
//                   </div>
//                   <div>
//                     <p className="text-sm font-bold text-gray-800">
//                       {tracking.driver?.name || `Driver #${tracking.driverId}`}
//                     </p>
//                     {tracking.driver?.phone && (
//                       <a href={`tel:${tracking.driver.phone}`}
//                         className="text-xs text-blue-500 font-semibold hover:underline">
//                         📞 {tracking.driver.phone}
//                       </a>
//                     )}
//                     {!tracking.driver?.phone && (
//                       <p className="text-xs text-gray-400">ID: {tracking.driverId}</p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Location Card */}
//               <div className="bg-white rounded-2xl border border-gray-200 p-4">
//                 <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Current Location</p>
//                 {tracking.location ? (
//                   <div className="space-y-2">
//                     <div className="flex justify-between items-center">
//                       <span className="text-xs text-gray-500">Latitude</span>
//                       <span className="text-xs font-mono font-bold text-gray-700">{tracking.location.lat?.toFixed(6)}</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-xs text-gray-500">Longitude</span>
//                       <span className="text-xs font-mono font-bold text-gray-700">{tracking.location.lng?.toFixed(6)}</span>
//                     </div>
//                     <hr className="border-gray-100" />
//                     <div className="flex justify-between items-center">
//                       <span className="text-xs text-gray-500">Last Update</span>
//                       <span className="text-xs font-semibold text-gray-600">
//                         {formatUpdatedAt(tracking.location.updatedAt)}
//                       </span>
//                     </div>
//                   </div>
//                 ) : (
//                   <p className="text-sm text-gray-400">No location data</p>
//                 )}
//               </div>

//               {/* Order Card */}
//               <div className="rounded-2xl p-4" style={{ background: "rgba(255,82,82,0.05)", border: "1px solid rgba(255,82,82,0.15)" }}>
//                 <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Order</p>
//                 <p className="text-sm font-mono font-bold" style={{ color: BRAND }}>{tracking.orderId}</p>
//                 <p className="text-xs text-gray-500 mt-1">
//                   Auto-refreshes every {POLL_INTERVAL / 1000}s
//                 </p>
//               </div>

//             </div>
//           </div>
//         )}

//         {/* Tracking not available */}
//         {!loading && tracking && !tracking.trackingAvailable && (
//           <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
//             <span className="text-2xl">⏳</span>
//             <div>
//               <p className="text-sm font-bold text-amber-700">Tracking Not Available Yet</p>
//               <p className="text-xs text-amber-600 mt-0.5">Driver location will appear once they start moving.</p>
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }

// export default LiveTracking

import { useEffect, useState, useRef, useCallback } from "react";

// ══════════════════════════════════════════════════════════════════
// DUMMY DATA — replace with real API
// ══════════════════════════════════════════════════════════════════
const BRAND = "#FF5252";
const POLL_INTERVAL = 3000;

const RESTAURANT = { lat: 28.6139, lng: 77.2090, name: "Spice Garden Restaurant" };
const DESTINATION = { lat: 28.6250, lng: 77.2280, name: "Customer Location" };

const WAYPOINTS = [
  [28.6139, 77.2090], [28.6148, 77.2105], [28.6158, 77.2120],
  [28.6167, 77.2138], [28.6175, 77.2155], [28.6183, 77.2170],
  [28.6191, 77.2188], [28.6198, 77.2202], [28.6207, 77.2218],
  [28.6215, 77.2232], [28.6224, 77.2248], [28.6233, 77.2262],
  [28.6241, 77.2270], [28.6250, 77.2280],
];

const MOCK_TRACKING = {
  orderId: "ORD-2025-8821",
  trackingAvailable: true,
  driverId: "DRV-441",
  driver: { name: "Rajan Kumar", phone: "+91 98765 43210" },
  location: { lat: WAYPOINTS[0][0], lng: WAYPOINTS[0][1], updatedAt: Date.now() },
};

// ══════════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════════
const formatUpdatedAt = (timestamp) => {
  if (!timestamp) return "—";
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 10) return "Just now";
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return new Date(timestamp).toLocaleTimeString("en-IN");
};

const getDistanceKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
};

// ══════════════════════════════════════════════════════════════════
// MAP COMPONENT
// ══════════════════════════════════════════════════════════════════
const TrackingMap = ({ driverLat, driverLng, orderId, driverName }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const lineRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (window.L) { setMapLoaded(true); return; }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstanceRef.current) return;
    if (!driverLat || !driverLng) return;

    const L = window.L;
    const map = L.map(mapRef.current, { zoomControl: false });
    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map);

    // ── Restaurant marker ──────────────────────────────────────
    const restaurantIcon = L.divIcon({
      className: "",
      html: `<div style="display:flex;flex-direction:column;align-items:center;">
        <div style="width:42px;height:42px;background:#f97316;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;border:3px solid white;box-shadow:0 4px 14px rgba(249,115,22,0.45);">🍽️</div>
        <div style="margin-top:3px;background:#f97316;color:white;font-size:9px;font-weight:700;padding:2px 7px;border-radius:99px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.15);">Restaurant</div>
      </div>`,
      iconSize: [80, 60], iconAnchor: [40, 22],
    });
    L.marker([RESTAURANT.lat, RESTAURANT.lng], { icon: restaurantIcon })
      .addTo(map)
      .bindPopup(`<b>🍽️ ${RESTAURANT.name}</b><br/><small style="color:#888">Pickup Point</small>`);

    // ── Destination marker ─────────────────────────────────────
    const destIcon = L.divIcon({
      className: "",
      html: `<div style="display:flex;flex-direction:column;align-items:center;">
        <div style="width:42px;height:42px;background:#10b981;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;border:3px solid white;box-shadow:0 4px 14px rgba(16,185,129,0.45);">📍</div>
        <div style="margin-top:3px;background:#10b981;color:white;font-size:9px;font-weight:700;padding:2px 7px;border-radius:99px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.15);">Delivery</div>
      </div>`,
      iconSize: [80, 60], iconAnchor: [40, 22],
    });
    L.marker([DESTINATION.lat, DESTINATION.lng], { icon: destIcon })
      .addTo(map)
      .bindPopup(`<b>📍 ${DESTINATION.name}</b><br/><small style="color:#888">Drop Point</small>`);

    // ── Dashed gray route (restaurant → destination) ───────────
    L.polyline(
      [[RESTAURANT.lat, RESTAURANT.lng], [DESTINATION.lat, DESTINATION.lng]],
      { color: "#cbd5e1", weight: 2.5, dashArray: "7 7", opacity: 0.8 }
    ).addTo(map);

    // ── Driver marker ──────────────────────────────────────────
    const driverIcon = L.divIcon({
      className: "",
      html: `<div style="display:flex;flex-direction:column;align-items:center;">
        <div style="width:48px;height:48px;background:#FF5252;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;border:3px solid white;box-shadow:0 0 0 6px rgba(255,82,82,0.18),0 4px 18px rgba(255,82,82,0.42);">🛵</div>
        <div style="margin-top:3px;background:#FF5252;color:white;font-size:9px;font-weight:700;padding:2px 7px;border-radius:99px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.15);">${driverName || "Driver"}</div>
      </div>`,
      iconSize: [110, 64], iconAnchor: [55, 24],
    });
    const driverMarker = L.marker([driverLat, driverLng], { icon: driverIcon })
      .addTo(map)
      .bindPopup(`<b>🛵 ${driverName || "Driver"}</b><br/><small style="color:#888">Order: ${orderId}</small>`)
      .openPopup();

    // ── Red solid line (driver → destination) ─────────────────
    const liveLine = L.polyline(
      [[driverLat, driverLng], [DESTINATION.lat, DESTINATION.lng]],
      { color: "#FF5252", weight: 3, opacity: 0.9 }
    ).addTo(map);

    // Fit bounds to show all 3 points
    map.fitBounds(
      L.latLngBounds([
        [RESTAURANT.lat, RESTAURANT.lng],
        [DESTINATION.lat, DESTINATION.lng],
        [driverLat, driverLng],
      ]),
      { padding: [60, 60] }
    );

    mapInstanceRef.current = map;
    markerRef.current = driverMarker;
    lineRef.current = liveLine;
  }, [mapLoaded, driverLat, driverLng, orderId, driverName]);

  // Update driver position + live line on each poll
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current || !driverLat || !driverLng) return;
    markerRef.current.setLatLng([driverLat, driverLng]);
    mapInstanceRef.current.panTo([driverLat, driverLng], { animate: true, duration: 1 });
    if (lineRef.current) {
      lineRef.current.setLatLngs([
        [driverLat, driverLng],
        [DESTINATION.lat, DESTINATION.lng],
      ]);
    }
  }, [driverLat, driverLng]);

  if (!driverLat || !driverLng) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 gap-3 rounded-2xl">
        <div className="text-5xl">📍</div>
        <p className="text-gray-500 font-semibold text-sm">Location not available yet</p>
        <p className="text-gray-400 text-xs">Waiting for driver location...</p>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-full" />;
};

// ══════════════════════════════════════════════════════════════════
// PULSE DOT
// ══════════════════════════════════════════════════════════════════
const PulseDot = () => (
  <span className="relative inline-flex w-2.5 h-2.5 flex-shrink-0">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
    <span className="relative inline-flex rounded-full w-2.5 h-2.5 bg-emerald-500" />
  </span>
);

// ══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════
export default function LiveTracking() {
  const [tracking, setTracking] = useState(MOCK_TRACKING);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [tick, setTick] = useState(0);
  const wpRef = useRef(1);

  // ── Polling (swap setTimeout block with real axiosInstance call) ─
  const fetchTracking = useCallback((isAuto = false) => {
    if (isAuto) setRefreshing(true);
    else setLoading(true);

    // ✅ TODO: Replace below with:
    // axiosInstance.get(`/orders/${orderId}/trackvendor`, { withCredentials: true })
    //   .then(res => { setTracking(res.data); setLastRefresh(Date.now()); })
    //   .catch(err => console.error(err))
    //   .finally(() => { setRefreshing(false); setLoading(false); });

    setTimeout(() => {
      const idx = wpRef.current % WAYPOINTS.length;
      const [lat, lng] = WAYPOINTS[idx];
      wpRef.current += 1;
      setTracking((prev) => ({
        ...prev,
        location: { lat, lng, updatedAt: Date.now() },
      }));
      setLastRefresh(Date.now());
      setRefreshing(false);
      setLoading(false);
    }, 400);
  }, []);

  useEffect(() => {
    const id = setInterval(() => fetchTracking(true), POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetchTracking]);

  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 5000);
    return () => clearInterval(id);
  }, []);

  const { location, driver, driverId, orderId, trackingAvailable } = tracking;

  const distToDestination = location
    ? getDistanceKm(location.lat, location.lng, DESTINATION.lat, DESTINATION.lng)
    : null;
  const totalDist = getDistanceKm(RESTAURANT.lat, RESTAURANT.lng, DESTINATION.lat, DESTINATION.lng);
  const progressPct = distToDestination
    ? Math.min(100, Math.round((1 - distToDestination / totalDist) * 100))
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">

        {/* ── HEADER ── */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Live Tracking</h1>
              <p className="text-xs text-gray-400 font-mono mt-0.5">{orderId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {refreshing ? (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-red-500">
                <svg width="12" height="12" viewBox="0 0 24 24" className="animate-spin" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
                Updating…
              </span>
            ) : (
              <span className="text-xs text-gray-400">Updated {formatUpdatedAt(lastRefresh)}</span>
            )}
            <button onClick={() => fetchTracking(false)}
              className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 2v6h-6M3 12a9 9 0 0115-6.7L21 8M3 22v-6h6M21 12a9 9 0 01-15 6.7L3 16" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── MAP LEGEND ── */}
        <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 mb-4 flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-sm border-2 border-white shadow-sm">🍽️</div>
            <span className="text-xs font-semibold text-gray-600 hidden sm:block">{RESTAURANT.name}</span>
            <span className="text-xs font-semibold text-gray-600 sm:hidden">Restaurant</span>
          </div>
          {/* dashed line = restaurant → driver route */}
          <div className="flex-1 flex items-center min-w-[30px]">
            <svg className="w-full" height="10" viewBox="0 0 100 10" preserveAspectRatio="none">
              <line x1="0" y1="5" x2="100" y2="5" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6 4" />
            </svg>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-sm border-2 border-white shadow-sm">🛵</div>
            <span className="text-xs font-semibold text-gray-600">{driver?.name?.split(" ")[0] || "Driver"}</span>
          </div>
          {/* solid red line = driver → destination */}
          <div className="flex-1 flex items-center min-w-[30px]">
            <svg className="w-full" height="10" viewBox="0 0 100 10" preserveAspectRatio="none">
              <line x1="0" y1="5" x2="100" y2="5" stroke="#FF5252" strokeWidth="2.5" />
            </svg>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-sm border-2 border-white shadow-sm">📍</div>
            <span className="text-xs font-semibold text-gray-600">You</span>
          </div>
        </div>

        {/* ── MAIN GRID ── */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 animate-pulse" style={{ height: 460 }} />
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4">
                  <div className="h-3 bg-gray-100 rounded animate-pulse mb-2 w-1/2" />
                  <div className="h-5 bg-gray-100 rounded animate-pulse w-3/4" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* MAP */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden relative"
              style={{ height: 460 }}>
              <TrackingMap
                driverLat={location?.lat}
                driverLng={location?.lng}
                orderId={orderId}
                driverName={driver?.name}
              />
              <div className="absolute top-3 left-3 z-[9999] flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl px-3 py-1.5 shadow-sm">
                <PulseDot />
                <span className="text-xs font-bold text-gray-700">Live</span>
              </div>
            </div>

            {/* SIDEBAR */}
            <div className="space-y-3">

              {/* Status + Progress */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Tracking Status</p>
                <div className="flex items-center gap-2 mb-3">
                  <PulseDot />
                  <span className="text-sm font-bold text-emerald-600">
                    {trackingAvailable ? "Live Tracking Active" : "Unavailable"}
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400 transition-all duration-700"
                    style={{ width: `${progressPct}%` }} />
                </div>
                <div className="flex justify-between text-[9px] font-semibold text-gray-400 mt-1.5 uppercase tracking-wide">
                  <span>🍽️ Picked up</span>
                  <span className="text-red-500 font-bold">{progressPct}%</span>
                  <span>📍 Delivered</span>
                </div>
              </div>

              {/* Driver */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Driver</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 shadow-md"
                    style={{ background: "linear-gradient(135deg,#FF5252,#ff8a65)" }}>
                    🛵
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{driver?.name || `Driver #${driverId}`}</p>
                    {driver?.phone && (
                      <a href={`tel:${driver.phone}`} className="text-xs text-blue-500 hover:underline mt-0.5 block">
                        📞 {driver.phone}
                      </a>
                    )}
                  </div>
                  {driver?.phone && (
                    <a href={`tel:${driver.phone}`}
                      className="w-9 h-9 rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors flex-shrink-0">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.69 12 19.79 19.79 0 011.63 3.38 2 2 0 013.6 1.21h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L7.91 8.84a16 16 0 006.29 6.29l.95-.95a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              {/* Journey — restaurant → driver → destination */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Journey</p>
                <div className="space-y-0">
                  {/* From */}
                  <div className="flex items-start gap-2.5">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-sm flex-shrink-0">🍽️</div>
                      <div className="w-px flex-1 bg-dashed my-1" style={{ background: "repeating-linear-gradient(to bottom,#e2e8f0 0,#e2e8f0 4px,transparent 4px,transparent 8px)", width: 1, minHeight: 16 }} />
                    </div>
                    <div className="flex-1 min-w-0 pb-3">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">From</p>
                      <p className="text-xs font-bold text-gray-700">{RESTAURANT.name}</p>
                    </div>
                  </div>

                  {/* Driver now */}
                  <div className="flex items-start gap-2.5">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-sm flex-shrink-0 ring-2 ring-red-300">🛵</div>
                      <div style={{ background: "repeating-linear-gradient(to bottom,#fca5a5 0,#fca5a5 4px,transparent 4px,transparent 8px)", width: 1, minHeight: 16 }} className="my-1" />
                    </div>
                    <div className="flex-1 min-w-0 pb-3">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">Driver Now</p>
                      <p className="text-xs font-bold text-gray-700 tabular-nums">
                        {location ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}` : "—"}
                      </p>
                      {distToDestination && (
                        <p className="text-[10px] text-red-500 font-semibold mt-0.5">{distToDestination} km remaining</p>
                      )}
                    </div>
                  </div>

                  {/* To */}
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-sm flex-shrink-0">📍</div>
                    <div className="flex-1 min-w-0 ml-0">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">To</p>
                      <p className="text-xs font-bold text-gray-700">{DESTINATION.name}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location + Order meta */}
              <div className="rounded-2xl p-4" style={{ background: "rgba(255,82,82,0.04)", border: "1px solid rgba(255,82,82,0.15)" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">Location</p>
                {location ? (
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-white rounded-xl p-2 border border-gray-100">
                      <p className="text-[9px] text-gray-400 uppercase tracking-wide mb-1">Latitude</p>
                      <p className="text-xs font-bold text-gray-700 tabular-nums">{location.lat.toFixed(6)}</p>
                    </div>
                    <div className="bg-white rounded-xl p-2 border border-gray-100">
                      <p className="text-[9px] text-gray-400 uppercase tracking-wide mb-1">Longitude</p>
                      <p className="text-xs font-bold text-gray-700 tabular-nums">{location.lng.toFixed(6)}</p>
                    </div>
                  </div>
                ) : <p className="text-xs text-gray-400 mb-3">No location data</p>}
                <div className="flex items-center justify-between border-t pt-2.5" style={{ borderColor: "rgba(255,82,82,0.15)" }}>
                  <span className="text-xs font-mono font-bold" style={{ color: BRAND }}>{orderId}</span>
                  <span className="text-[10px] text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded-lg">
                    ↻ {POLL_INTERVAL / 1000}s · {formatUpdatedAt(location?.updatedAt)}
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

        {!loading && !trackingAvailable && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">⏳</span>
            <div>
              <p className="text-sm font-bold text-amber-700">Tracking Not Available Yet</p>
              <p className="text-xs text-amber-600 mt-0.5">Driver location will appear once they start moving.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}