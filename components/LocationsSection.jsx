// "use client";

// import dynamic from "next/dynamic";
// import { useEffect, useState } from "react";

// const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// export function LocationsSection() {
//   const [locations, setLocations] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchLocations = async () => {
//       const res = await fetch("/api/locations");
//       const data = await res.json();
//       setLocations(data.filter((loc) => loc.is_active));
//       setLoading(false);
//     };
//     fetchLocations();
//   }, []);

//   return (
//     <section className="relative py-12">
//       <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
//         {/* Animation */}
//         <div className="w-full md:w-1/2">
//           <Lottie
//             animationData={require("@/public/red dots world map.json")}
//             loop
//             autoplay
//           />
//         </div>

//         {/* Locations List */}
//         <div className="w-full md:w-1/2">
//           <h2 className="text-2xl font-bold mb-4">Where We’ve Been</h2>
//           <div className="flex flex-wrap gap-2 text-lg text-gray-400">
//             {loading ? (
//               <div className="text-center">Loading</div>
//             ) : (
//               <div>
//                 {locations.map((loc, idx) => (
//                   <span className="hover:text-white" key={loc.id}>
//                     {loc.name}
//                     {idx < locations.length - 1 && " | "}
//                   </span>
//                 ))}
//                 {locations.length > 0 && (
//                   <span className="font-semibold">
//                     &nbsp; & All Around The World
//                   </span>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";

export function LocationsSection() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    const fetchLocations = async () => {
      const res = await fetch("/api/locations");
      const data = await res.json();
      const activeLocations = data.filter(
        (loc) => loc.is_active && loc.latitude && loc.longitude
      );
      setLocations(activeLocations);
      setLoading(false);
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !mapRef.current ||
      locations.length === 0
    )
      return;

    // Load Leaflet CSS and JS
    const loadLeaflet = async () => {
      if (!window.L) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href =
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css";
        document.head.appendChild(link);

        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js";
        script.onload = initMap;
        document.head.appendChild(script);
      } else {
        initMap();
      }
    };

    const initMap = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      const map = window.L.map(mapRef.current, {
        center: [20, 0],
        zoom: 6,
        minZoom: 2,
        maxZoom: 10,
        worldCopyJump: true,
        zoomControl: true,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Dark theme tile layer
      window.L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 20,
        }
      ).addTo(map);

      // Custom red marker icon
      // Replace the redIcon definition with this:
      const redIcon = window.L.divIcon({
        className: "custom-marker",
        html: `
    <div style="position: relative;">
      <div style="
        position: absolute;
        background-color: rgba(239, 68, 68, 0.4);
        width: 24px;
        height: 24px;
        border-radius: 50%;
        top: 50%;
        left: 30%;
        transform: translate(-50%, -50%);
        animation: pulsing 2s ease-out infinite;
      "></div>
      <div style="
        background-color: #ef4444;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 10px rgba(239, 68, 68, 0.6);
        position: relative;
        z-index: 1;
      "></div>
    </div>
    <style>
      @keyframes pulsing {
        0% {
          transform: translate(-50%, -50%) scale(0.3);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) scale(2);
          opacity: 0;
        }
      }
    </style>
  `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      // Add markers for each location
      locations.forEach((loc) => {
        const marker = window.L.marker(
          [parseFloat(loc.latitude), parseFloat(loc.longitude)],
          {
            icon: redIcon,
          }
        ).addTo(map);

        marker.bindPopup(`
          <div style="color: #000; font-weight: 600; padding: 4px 0;">
            ${loc.name}
            ${
              loc.description
                ? `<br/><span style="font-weight: 400; font-size: 12px; color: #666;">${loc.description}</span>`
                : ""
            }
          </div>
        `);
      });

      // Fit bounds to show all markers
      if (locations.length > 0) {
        const bounds = window.L.latLngBounds(
          locations.map((loc) => [
            parseFloat(loc.latitude),
            parseFloat(loc.longitude),
          ])
        );
        map.fitBounds(bounds, { padding: [50, 40], maxZoom: 4 });
        map.setZoom(Math.min(map.getZoom() + 0.5, 10));
      }
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locations]);

  return (
    <section className="relative py-12">
      <div className="container mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-8">
        {/* Map */}
        <div className="w-full md:w-1/2 h-[300px] md:h-[350px] rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div ref={mapRef} className="w-full h-full" />
          )}
        </div>

        {/* Locations List */}
        <div className="w-full md:w-1/2">
          <h2 className="text-xl sm:text-2xl font-bold sm:mb-4 text-white">
            Where We've Been
          </h2>
          <div className="flex flex-wrap gap-2 text-lg text-gray-400">
            {loading ? (
              <div className="text-center animate-bounce">Loading...</div>
            ) : locations.length > 0 ? (
              <div>
                {locations.map((loc, idx) => (
                  <span
                    className="hover:text-white text-sm sm:text-base transition-colors cursor-pointer"
                    key={loc.id}
                  >
                    {loc.name}
                    {idx < locations.length - 1 && <span className='hover:text-gray-400'> | </span>}
                  </span>
                ))}
                <span className="font-semibold text-sm sm:text-base">
                  &nbsp; & All Around The World
                </span>
              </div>
            ) : (
              <div className="text-gray-500">No locations added yet</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
