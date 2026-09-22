"use client";

import dynamic from "next/dynamic";
import { Layers } from "lucide-react";

// Dynamically import the Mapbox map component without SSR
export const StartupMap = dynamic(
  () => import("@/components/maps/StartupMap"),
  {
    ssr: false,
    loading: () => (
      <div className="relative w-full h-[520px] sm:h-[620px] rounded-2xl overflow-hidden border shadow-sm bg-muted/30 flex flex-col items-center justify-center text-center p-6 animate-pulse">
        <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
          <Layers className="h-6 w-6 text-muted-foreground animate-spin" />
        </div>
        <p className="text-sm font-semibold text-foreground">Loading Nagpur Startup Map...</p>
        <p className="text-xs text-muted-foreground mt-1">Preparing interactive Mapbox visualization</p>
      </div>
    ),
  }
);

export default StartupMap;
