"use client"

import { GenericMap } from "@/components/maps/GenericMap"
import JsonBuilder from "@/components/workflow/json-builder/JsonBuilder"
import { stateIncomeData } from "@/lib/constants"
import { useEffect, useState } from "react"
import MapBox from "./components/MapBox"
import GeoMap from "./components/GeoMap"
import { mockStateIncomeData } from "@/lib/maps/mockStateIncomeData"
import RenderMap from "./components/RenderMap"

// Example color scale
const incomeColorScale = (income: number) => {
  if (income >= 80000) return "#0f766e"
  if (income >= 70000) return "#14b8a6"
  if (income >= 60000) return "#2dd4bf"
  if (income >= 50000) return "#5eead4"
  return "#ccfbf1"
}

export default function Page() {
  const [country, setCountry] = useState('India');
  const [geojson, setGeojson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGeoJSON = async () => {
      try {
        const response = await fetch("https://raw.githubusercontent.com/HrishikShaji/saas-workflow/main/lib/maps/us-1.json");
        const data = await response.json();
        const enrichedFeatures = data.features.map(feature => {
          const stateData = mockStateIncomeData.find(
            state => state.name.toLowerCase() === feature.properties.NAME_1.toLowerCase()
          );

          return {
            ...feature,
            properties: {
              ...feature.properties,
              averageIncome: stateData?.averageIncome || 50000
            }
          };
        });

        setGeojson({
          ...data,
          features: enrichedFeatures
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching GeoJSON:", error);
        setLoading(false);
      }
    };

    fetchGeoJSON();
  }, []);

  if (loading) {
    return <div>Loading map...</div>;
  }

  if (!geojson) {
    return <div>Error loading map data</div>;
  }

  return (
    <div>
      {geojson ? (
        <RenderMap geoJson={geojson} dataKey="averageIncome" mapType="heatmap" />
      ) : <div>Loading...</div>}
    </div>
  );
};
