"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  MapPin,
  Building2,
  Briefcase,
  ExternalLink,
  CheckCircle2,
  X,
  AlertTriangle,
  Layers,
  Sparkles,
  ArrowRight,
  Navigation,
  List,
} from "lucide-react";

// Color mapping for sector markers
const SECTOR_COLORS: Record<string, string> = {
  "AI": "#8b5cf6",               // Purple
  "SaaS": "#3b82f6",             // Blue
  "Fintech": "#06b6d4",          // Cyan
  "Healthtech": "#ec4899",       // Pink
  "Edtech": "#f59e0b",           // Amber
  "Agritech": "#84cc16",         // Lime
  "Deeptech": "#6366f1",         // Indigo
  "Cybersecurity": "#ef4444",    // Red
  "Ecommerce": "#14b8a6",        // Teal
  "D2C": "#f43f5e",              // Rose
  "IT Services": "#f97316",       // Warm Orange
  "Software": "#10b981",         // Emerald Green
  "Media & Marketing": "#d946ef",// Fuchsia
};

const DEFAULT_SECTOR_COLOR = "#f97316";

const NAGPUR_AREAS = [
  { name: "All Nagpur", lng: 79.0882, lat: 21.1458, zoom: 11 },
  { name: "MIHAN SEZ", lng: 79.0585, lat: 21.0920, zoom: 13.5 },
  { name: "IT Park", lng: 79.0495, lat: 21.1270, zoom: 14 },
  { name: "Dharampeth", lng: 79.0770, lat: 21.1440, zoom: 14 },
  { name: "Civil Lines", lng: 79.0805, lat: 21.1530, zoom: 14 },
  { name: "Ramdaspeth", lng: 79.0730, lat: 21.1360, zoom: 14 },
  { name: "Sadar", lng: 79.0845, lat: 21.1500, zoom: 14 },
  { name: "Hingna", lng: 79.0250, lat: 21.1150, zoom: 13.5 },
  { name: "Besa", lng: 79.0800, lat: 21.0860, zoom: 14 },
  { name: "Central Avenue", lng: 79.1150, lat: 21.1510, zoom: 14 },
];

const INDORE_AREAS = [
  { name: "All Indore", lng: 75.8577, lat: 22.7196, zoom: 11 },
  { name: "Super Corridor", lng: 75.8115, lat: 22.7560, zoom: 13.5 },
  { name: "Vijay Nagar", lng: 75.8937, lat: 22.7533, zoom: 14 },
  { name: "Crystal IT Park", lng: 75.8647, lat: 22.6841, zoom: 14 },
  { name: "Palasia", lng: 75.8872, lat: 22.7230, zoom: 14 },
  { name: "Bhawarkua", lng: 75.8665, lat: 22.6922, zoom: 14 },
  { name: "AB Road", lng: 75.8790, lat: 22.7285, zoom: 14 },
  { name: "Pithampur Tech Zone", lng: 75.6800, lat: 22.6100, zoom: 13 },
  { name: "MR 10", lng: 75.8800, lat: 22.7650, zoom: 14 },
  { name: "Geeta Bhawan", lng: 75.8770, lat: 22.7180, zoom: 14 },
];

const BHOPAL_AREAS = [
  { name: "All Bhopal", lng: 77.4126, lat: 23.2599, zoom: 11 },
  { name: "MP Nagar", lng: 77.4339, lat: 23.2332, zoom: 14 },
  { name: "Arera Colony", lng: 77.4290, lat: 23.2120, zoom: 14 },
  { name: "Govindpura IT Zone", lng: 77.4490, lat: 23.2560, zoom: 13.5 },
  { name: "Kolar Road", lng: 77.4190, lat: 23.1870, zoom: 14 },
  { name: "Indrapuri / BHEL", lng: 77.4680, lat: 23.2510, zoom: 14 },
];

const SECTOR_OPTIONS = [
  "All",
  "AI",
  "SaaS",
  "Fintech",
  "Healthtech",
  "Edtech",
  "Agritech",
  "Deeptech",
  "Cybersecurity",
  "Ecommerce",
  "D2C",
  "IT Services",
  "Software",
];

// Timeout for map loading (10 seconds)
const MAP_LOAD_TIMEOUT_MS = 10000;

export interface StartupMapProps {
  cityName?: string;
  citySlug?: string;
  center?: [number, number];
  zoom?: number;
  areas?: Array<{ name: string; lng: number; lat: number; zoom: number }>;
  companiesList?: any[];
}

export default function StartupMap({
  cityName = "Nagpur",
  citySlug = "nagpur",
  center,
  zoom = 11,
  areas,
  companiesList,
}: StartupMapProps = {}) {
  const router = useRouter();
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const mapInstanceRef = React.useRef<mapboxgl.Map | null>(null);
  const popupRef = React.useRef<mapboxgl.Popup | null>(null);
  const userMarkerRef = React.useRef<mapboxgl.Marker | null>(null);
  const [isMobileMapCollapsed, setIsMobileMapCollapsed] = React.useState(false);
  const [showUserLocation, setShowUserLocation] = React.useState(false);
  const [locationError, setLocationError] = React.useState<string | null>(null);

  const defaultCenter: [number, number] = React.useMemo(() => {
    if (center) return center;
    if (citySlug === "indore") return [75.8577, 22.7196];
    if (citySlug === "bhopal") return [77.4126, 23.2599];
    return [79.0882, 21.1458];
  }, [center, citySlug]);

  const effectiveCompanies = React.useMemo(() => {
    if (companiesList && companiesList.length > 0) return companiesList;
    return [];
  }, [companiesList]);

  const effectiveAreas = React.useMemo(() => {
    if (areas && areas.length > 0 && areas !== NAGPUR_AREAS) return areas;
    if (citySlug === "indore") {
      return INDORE_AREAS;
    }
    if (citySlug === "bhopal") {
      return BHOPAL_AREAS;
    }
    return NAGPUR_AREAS;
  }, [areas, citySlug]);

  const [selectedSector, setSelectedSector] = React.useState<string>("All");
  const [selectedArea, setSelectedArea] = React.useState<string>(`All ${cityName}`);
  const [activeCompany, setActiveCompany] = React.useState<any | null>(null);
  const [mapLoaded, setMapLoaded] = React.useState(false);
  const [mapError, setMapError] = React.useState<string | null>(null);
  const [mapTimedOut, setMapTimedOut] = React.useState(false);

  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  // Filter companies based on sector selection
  const filteredCompanies = React.useMemo(() => {
    return effectiveCompanies.filter((c) => {
      if (selectedSector === "All") return true;
      return c.sector === selectedSector || (c.tags && c.tags.includes(selectedSector));
    });
  }, [selectedSector, effectiveCompanies]);

  // Convert companies to GeoJSON feature collection
  const geojsonData = React.useMemo<GeoJSON.FeatureCollection<GeoJSON.Point>>(() => {
    const features: GeoJSON.Feature<GeoJSON.Point>[] = [];

    for (const c of filteredCompanies) {
      if (!c.latitude || !c.longitude) continue;
      const lng = parseFloat(c.longitude);
      const lat = parseFloat(c.latitude);
      if (isNaN(lng) || isNaN(lat)) continue;

      features.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
        properties: {
          id: c.id,
          name: c.name,
          slug: c.slug,
          sector: c.sector || "Technology",
          companyType: c.companyType || "Startup",
          locationName: c.locationName || "",
          hiring: c.hiring,
          descriptionShort: c.descriptionShort || "",
          logoUrl: c.logoUrl || "",
          teamSize: c.teamSize || "",
          color: SECTOR_COLORS[c.sector] || DEFAULT_SECTOR_COLOR,
        },
      });
    }

    return {
      type: "FeatureCollection",
      features,
    };
  }, [filteredCompanies]);

  // WebGL check before map init
  const isWebGLSupported = React.useMemo(() => {
    if (typeof window === "undefined") return true;
    try {
      const canvas = document.createElement("canvas");
      return !!(
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      );
    } catch {
      return false;
    }
  }, []);

  // Initialize Mapbox map
  React.useEffect(() => {
    if (!token) {
      setMapError("Mapbox access token is missing.");
      return;
    }

    if (!isWebGLSupported) {
      setMapError("WebGL is not supported in your browser or graphics hardware.");
      return;
    }

    if (!mapboxgl.supported()) {
      setMapError("WebGL is not supported in your browser or graphics hardware.");
      return;
    }

    if (mapInstanceRef.current || !mapContainerRef.current) return;

    // Set loading timeout
    const timeoutId = setTimeout(() => {
      if (!mapLoaded) {
        setMapTimedOut(true);
        setMapError("Map took too long to load. View companies in the list below.");
      }
    }, MAP_LOAD_TIMEOUT_MS);

    try {
      mapboxgl.accessToken = token;

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: defaultCenter,
        zoom: zoom,
        minZoom: 8,
        maxZoom: 18,
        attributionControl: true,
      });

      // Add navigation controls (zoom, compass)
      map.addControl(new mapboxgl.NavigationControl({ showCompass: true, showZoom: true }), "top-right");

      // Add fullscreen control on desktop devices
      if (typeof window !== "undefined" && window.innerWidth >= 768) {
        map.addControl(new mapboxgl.FullscreenControl(), "top-right");
      }

      map.on("load", () => {
        clearTimeout(timeoutId);
        mapInstanceRef.current = map;

        // Add clustered GeoJSON source
        map.addSource("companies-source", {
          type: "geojson",
          data: geojsonData,
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 45,
        });

        // 1. Cluster circles
        map.addLayer({
          id: "clusters",
          type: "circle",
          source: "companies-source",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": [
              "step",
              ["get", "point_count"],
              "#ea580c", // Warm Orange for < 5
              5,
              "#c2410c", // Deep Orange for 5 - 10
              10,
              "#9a3412", // Darker Orange for 10+
            ],
            "circle-radius": [
              "step",
              ["get", "point_count"],
              18,
              5,
              24,
              10,
              30,
            ],
            "circle-stroke-width": 2.5,
            "circle-stroke-color": "#ffffff",
          },
        });

        // 2. Cluster text labels (count)
        map.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "companies-source",
          filter: ["has", "point_count"],
          layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12,
          },
          paint: {
            "text-color": "#ffffff",
          },
        });

        // 3. Unclustered points outer glow / ring
        map.addLayer({
          id: "unclustered-glow",
          type: "circle",
          source: "companies-source",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": ["get", "color"],
            "circle-radius": 14,
            "circle-opacity": 0.25,
          },
        });

        // 4. Unclustered points primary pin
        map.addLayer({
          id: "unclustered-point",
          type: "circle",
          source: "companies-source",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": ["get", "color"],
            "circle-radius": 8,
            "circle-stroke-width": 2.5,
            "circle-stroke-color": "#ffffff",
          },
        });

        // Mouse cursor updates
        map.on("mouseenter", "clusters", () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", "clusters", () => {
          map.getCanvas().style.cursor = "";
        });
        map.on("mouseenter", "unclustered-point", () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", "unclustered-point", () => {
          map.getCanvas().style.cursor = "";
        });

        // Cluster click to zoom in
        map.on("click", "clusters", (e) => {
          const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
          if (!features.length) return;
          const clusterId = features[0].properties?.cluster_id;
          const source = map.getSource("companies-source") as mapboxgl.GeoJSONSource;

          source.getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err || zoom === null || zoom === undefined) return;
            const coords = (features[0].geometry as any).coordinates;
            map.easeTo({
              center: coords,
              zoom: Math.min(zoom, 16),
              duration: 800,
            });
          });
        });

        // Unclustered point click: Open popup & select company
        map.on("click", "unclustered-point", (e) => {
          if (!e.features?.length) return;
          const feature = e.features[0];
          const props = feature.properties as any;
          const coords = (feature.geometry as any).coordinates.slice();

          // Ensure coordinates wrap properly over anti-meridian
          while (Math.abs(e.lngLat.lng - coords[0]) > 180) {
            coords[0] += e.lngLat.lng > coords[0] ? 360 : -360;
          }

          // Find company in data
          const fullCompany = effectiveCompanies.find((c: any) => c.slug === props.slug);
          if (fullCompany) {
            setActiveCompany(fullCompany);
          }

          // Clean up old popup
          if (popupRef.current) {
            popupRef.current.remove();
          }

          // Build custom HTML popup
          const popupContent = document.createElement("div");
          popupContent.className = "p-3 font-sans max-w-[280px]";

          const logoHtml = props.logoUrl
            ? `<img src="${props.logoUrl}" alt="${props.name}" style="width: 32px; height: 32px; object-fit: contain; border-radius: 8px; border: 1px solid #e2e8f0; padding: 2px; background: #ffffff; flex-shrink: 0;" />`
            : `<div style="width: 32px; height: 32px; border-radius: 8px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #475569; flex-shrink: 0;">${props.name.slice(0, 2).toUpperCase()}</div>`;

          const hiringBadge = props.hiring === true || props.hiring === "true"
            ? `<span style="background-color: #dcfce7; color: #15803d; padding: 2px 7px; border-radius: 9999px; font-size: 10px; font-weight: 600;">Hiring</span>`
            : "";

          const typeBadge = props.companyType
            ? `<span style="background-color: #f1f5f9; color: #475569; padding: 2px 7px; border-radius: 9999px; font-size: 9px; font-weight: 600;">${props.companyType}</span>`
            : "";

          popupContent.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 6px;">
              ${logoHtml}
              <div style="min-width: 0; flex: 1;">
                <h4 style="font-size: 13px; font-weight: 700; color: #0f172a; margin: 0; line-height: 1.3;">${props.name}</h4>
                <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
                  <span style="font-weight: 600; color: ${props.color};">${props.sector}</span> • ${props.locationName}
                </div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 6px;">
              ${typeBadge}
              ${hiringBadge}
            </div>
            <p style="font-size: 11px; color: #334155; line-height: 1.4; margin: 0 0 10px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
              ${props.descriptionShort || ""}
            </p>
            <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px; border-top: 1px solid #f1f5f9; padding-top: 8px;">
              <button id="view-company-btn-${props.slug}" style="background-color: #f97316; color: #ffffff; border: none; border-radius: 6px; padding: 5px 12px; font-size: 11px; font-weight: 600; cursor: pointer; margin-left: auto;">
                View Company →
              </button>
            </div>
          `;

          // Add click listener that utilizes Next.js router.push without page reload
          const btn = popupContent.querySelector(`#view-company-btn-${props.slug}`);
          if (btn) {
            btn.addEventListener("click", () => {
              router.push(`/${citySlug || "nagpur"}/company/${props.slug}`);
            });
          }

          const popup = new mapboxgl.Popup({
            offset: 14,
            closeButton: true,
            closeOnClick: false,
            className: "startup-mapbox-popup",
          })
            .setLngLat(coords)
            .setDOMContent(popupContent)
            .addTo(map);

          popupRef.current = popup;

          // Pan smoothly to center clicked marker
          map.easeTo({
            center: coords,
            duration: 500,
          });
        });

        setMapLoaded(true);
      });

      map.on("error", (e) => {
        // If map fails with style/token error
        if (e?.error?.message?.includes("Forbidden") || e?.error?.message?.includes("Unauthorized")) {
          clearTimeout(timeoutId);
          setMapError("Mapbox access token is invalid or unauthorized.");
        }
      });
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error("Mapbox initialization error:", err);
      setMapError("Failed to initialize Mapbox GL JS.");
    }

    return () => {
      clearTimeout(timeoutId);
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Update GeoJSON source when filter changes without re-initializing map
  React.useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;

    const source = map.getSource("companies-source") as mapboxgl.GeoJSONSource | undefined;
    if (source && typeof source.setData === "function") {
      source.setData(geojsonData);
    }
  }, [geojsonData, mapLoaded]);

  // Area jump fly-to
  const handleAreaClick = (area: { name: string; lng: number; lat: number; zoom: number }) => {
    setSelectedArea(area.name);
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo({
        center: [area.lng, area.lat],
        zoom: area.zoom,
        duration: 1200,
        essential: true,
      });
    }
  };

  // User location — ONLY when user clicks "Use my location"
  const handleShowMyLocation = React.useCallback(() => {
    if (!("geolocation" in navigator)) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const map = mapInstanceRef.current;

        if (map) {
          // Remove old marker if exists
          if (userMarkerRef.current) {
            userMarkerRef.current.remove();
          }

          // Create a pulsing blue dot marker
          const el = document.createElement("div");
          el.className = "user-location-marker";
          el.style.cssText = `
            width: 16px; height: 16px; border-radius: 50%;
            background: #3b82f6; border: 3px solid #ffffff;
            box-shadow: 0 0 0 4px rgba(59,130,246,0.3), 0 2px 4px rgba(0,0,0,0.2);
          `;

          const marker = new mapboxgl.Marker({ element: el })
            .setLngLat([longitude, latitude])
            .setPopup(
              new mapboxgl.Popup({ offset: 12 }).setHTML(
                '<div style="font-size:12px;font-weight:600;padding:4px 8px;">You are here</div>'
              )
            )
            .addTo(map);

          userMarkerRef.current = marker;
          setShowUserLocation(true);

          // Fly to user's location
          map.flyTo({
            center: [longitude, latitude],
            zoom: 13,
            duration: 1500,
          });
        }
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location permission denied. You can enable it in your browser settings.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out.");
            break;
          default:
            setLocationError("An unknown error occurred.");
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  // Remove user location
  const handleRemoveLocation = React.useCallback(() => {
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
    setShowUserLocation(false);
    setLocationError(null);
  }, []);

  // Fallback UI if map cannot load
  if (mapError) {
    return (
      <div className="relative w-full rounded-2xl overflow-hidden border shadow-sm bg-card p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
        <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-bold text-foreground">
          Map unavailable — View all companies in list
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mt-1 mb-6">
          {mapError} You can still browse and discover all {effectiveCompanies.length} verified companies directly in the directory.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`/${citySlug}/startups`}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-colors shadow-sm"
          >
            <span className="flex items-center gap-1.5">
              <List className="h-3.5 w-3.5" />
              Browse All Companies
            </span>
          </Link>
          <Link
            href={`/${citySlug}/hiring`}
            className="px-5 py-2.5 rounded-xl border text-xs font-semibold hover:bg-muted transition-colors"
          >
            Companies Hiring Now
          </Link>
        </div>

        {/* Quick fallback company cards grid */}
        {filteredCompanies.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl mt-8 text-left">
            {filteredCompanies.slice(0, 3).map((c: any) => (
              <Link
                key={c.slug}
                href={`/${citySlug || "nagpur"}/company/${c.slug}`}
                className="p-3.5 rounded-xl border bg-background hover:border-primary/50 transition-colors shadow-xs group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm group-hover:text-primary transition-colors">{c.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{c.sector}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">{c.locationName}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border shadow-lg bg-card transition-all duration-300 ${isMobileMapCollapsed ? "h-14 min-h-[56px]" : "min-h-[480px] sm:min-h-[620px]"}`}>
      {/* Mobile Collapse Toggle Button */}
      <div className="sm:hidden absolute top-2.5 right-2.5 z-20 pointer-events-auto">
        <button
          type="button"
          onClick={() => setIsMobileMapCollapsed(!isMobileMapCollapsed)}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-background/95 backdrop-blur-md border shadow-xs text-foreground hover:bg-muted"
        >
          <Layers className="h-3 w-3 text-primary" />
          <span>{isMobileMapCollapsed ? "Expand Map" : "Collapse"}</span>
        </button>
      </div>

      {isMobileMapCollapsed ? (
        <div 
          onClick={() => setIsMobileMapCollapsed(false)}
          className="w-full h-14 flex items-center justify-between px-4 cursor-pointer hover:bg-muted/40 transition-colors"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span>Interactive {cityName} Map ({effectiveCompanies.length} pins)</span>
          </div>
          <span className="text-[11px] text-primary font-medium hover:underline">Tap to view map →</span>
        </div>
      ) : (
        <>
          {/* Top Filter and Controls Overlay */}
          <div className="absolute top-3 left-3 right-24 sm:right-14 z-10 flex flex-nowrap items-center gap-2 pointer-events-none overflow-x-auto scrollbar-none pb-1">
            {/* Sector Pills */}
            <div className="flex items-center gap-1.5 p-1.5 bg-background/90 backdrop-blur-md rounded-xl border shadow-sm pointer-events-auto shrink-0">
              {SECTOR_OPTIONS.map((sector) => (
                <button
                  key={sector}
                  onClick={() => setSelectedSector(sector)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    selectedSector === sector
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {sector}
                </button>
              ))}
            </div>

            {/* Quick Area Jump */}
            <div className="hidden lg:flex items-center gap-1 p-1.5 bg-background/90 backdrop-blur-md rounded-xl border shadow-sm pointer-events-auto shrink-0">
              <MapPin className="h-3.5 w-3.5 text-primary ml-1.5 mr-0.5" />
              {effectiveAreas.map((area) => (
                <button
                  key={area.name}
                  onClick={() => handleAreaClick(area)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    selectedArea === area.name
                      ? "bg-accent text-accent-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {area.name}
                </button>
              ))}
            </div>
          </div>

          {/* User Location Button — bottom left, only appears on loaded map */}
          {mapLoaded && (
            <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-2">
              {!showUserLocation ? (
                <button
                  type="button"
                  onClick={handleShowMyLocation}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-background/95 backdrop-blur-md border shadow-sm text-foreground hover:bg-muted transition-colors"
                  title="Show my location on map"
                >
                  <Navigation className="h-3.5 w-3.5 text-blue-500" />
                  <span>Use my location</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRemoveLocation}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-500/10 border border-blue-500/30 shadow-sm text-blue-600 hover:bg-blue-500/20 transition-colors"
                  title="Hide my location"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  <span>Hide location</span>
                </button>
              )}
              {locationError && (
                <div className="px-3 py-1.5 text-[10px] font-medium rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 max-w-[220px]">
                  {locationError}
                </div>
              )}
            </div>
          )}

          {/* Mapbox Canvas Container */}
          <div
            ref={mapContainerRef}
            className="w-full h-[480px] sm:h-[620px] bg-muted/20"
            style={{ minHeight: "480px" }}
          />
        </>
      )}

      {/* Bottom Floating Card for Selected Company */}
      {activeCompany && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:max-w-md z-20 bg-background/95 backdrop-blur-md border rounded-2xl p-4 shadow-xl animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-card border overflow-hidden flex items-center justify-center shrink-0 p-1">
                {activeCompany.logoUrl ? (
                  <img
                    src={activeCompany.logoUrl}
                    alt={activeCompany.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="font-bold text-sm text-primary">
                    {activeCompany.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="font-bold text-base text-foreground">{activeCompany.name}</h4>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 flex-wrap">
                  {activeCompany.companyType && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground border">
                      {activeCompany.companyType}
                    </span>
                  )}
                  <span className="font-medium text-foreground">{activeCompany.sector}</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <MapPin className="h-3 w-3" /> {activeCompany.locationName}, {cityName}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveCompany(null);
                if (popupRef.current) popupRef.current.remove();
              }}
              className="text-muted-foreground hover:text-foreground text-xs p-1 rounded-md"
              aria-label="Close details"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-xs text-muted-foreground mt-2.5 line-clamp-2 leading-relaxed">
            {activeCompany.descriptionShort}
          </p>

          <div className="flex items-center justify-between mt-3 pt-3 border-t">
            <div className="flex items-center gap-2">
              {activeCompany.hiring && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  <Briefcase className="h-3 w-3" /> Hiring Now
                </span>
              )}
              {activeCompany.teamSize && (
                <span className="text-[11px] text-muted-foreground">Team: {activeCompany.teamSize}</span>
              )}
            </div>
            <Link
              href={`/${citySlug}/company/${activeCompany.slug}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              View Company <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 right-4 hidden md:flex items-center gap-3 px-3 py-1.5 bg-background/90 backdrop-blur-md rounded-xl border shadow-sm text-[11px] text-muted-foreground pointer-events-none">
        <span className="font-semibold text-foreground">Sectors:</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-purple-500" /> AI
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-500" /> SaaS
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-orange-500" /> IT Services
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Software
        </span>
      </div>
    </div>
  );
}
