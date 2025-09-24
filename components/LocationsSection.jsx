"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export function LocationsSection() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      const res = await fetch("/api/locations");
      const data = await res.json();
      setLocations(data.filter((loc) => loc.is_active));
      setLoading(false);
    };
    fetchLocations();
  }, []);

  return (
    <section className="relative py-12">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Animation */}
        <div className="w-full md:w-1/2">
          <Lottie
            animationData={require("@/public/red dots world map.json")}
            loop
            autoplay
          />
        </div>

        {/* Locations List */}
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl font-bold mb-4">Where We’ve Been</h2>
          <div className="flex flex-wrap gap-2 text-lg text-gray-400">
            {loading ? (
              <div className="text-center">Loading</div>
            ) : (
              <div>
                {locations.map((loc, idx) => (
                  <span key={loc.id}>
                    {loc.name}
                    {idx < locations.length - 1 && " | "}
                  </span>
                ))}
                {locations.length > 0 && (
                  <span className="font-semibold">
                    &nbsp; & All Around The World
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
