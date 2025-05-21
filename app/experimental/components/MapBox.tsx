"use client"

import * as React from 'react';
import Map, { Source, Layer, Popup } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mockStateIncomeData } from '@/lib/maps/mockStateIncomeData';


type StateIncomeData = {
  id: string;
  name: string;
  averageIncome: number;
};

type FeatureProperties = {
  STATE_ID: string;
  NAME: string;
  averageIncome?: number;
};

type GeoJsonFeature = {
  type: string;
  properties: FeatureProperties;
  geometry: any;
};

type GeoJsonData = {
  type: string;
  features: GeoJsonFeature[];
};

export default function MapBox() {
  const [geoJson, setGeoJson] = React.useState<GeoJsonData | null>(null);
  const [hoverInfo, setHoverInfo] = React.useState<{
    properties: FeatureProperties;
    x: number;
    y: number;
  } | null>(null);


  React.useEffect(() => {
    async function loadGeoJson() {
      try {
        // Load US states GeoJSON
        const response = await fetch('https://docs.mapbox.com/mapbox-gl-js/assets/us_states.geojson');
        const geoData: GeoJsonData = await response.json();

        // Enrich GeoJSON with income data
        const enrichedFeatures = geoData.features.map(feature => {
          const stateData = mockStateIncomeData.find(
            state => state.id === feature.properties.STATE_ID
          );

          return {
            ...feature,
            properties: {
              ...feature.properties,
              averageIncome: stateData?.averageIncome || 50000
            }
          };
        });

        setGeoJson({
          ...geoData,
          features: enrichedFeatures
        });
      } catch (error) {
        console.error('Error loading map data:', error);
      }
    }

    loadGeoJson();
  }, []);

  const onHover = React.useCallback((e: any) => {
    const feature = e.features?.[0];
    if (feature) {
      setHoverInfo({
        properties: feature.properties,
        x: e.point.x,
        y: e.point.y
      });
    } else {
      setHoverInfo(null);
    }
  }, []);

  if (!geoJson) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-lg">Loading map data...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full relative">
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY_1}
        initialViewState={{
          longitude: -98.5795,
          latitude: 39.8283,
          zoom: 3
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/light-v10"
        interactiveLayerIds={['state-fills']}
        onMouseMove={onHover}
      >
        <Source
          id="states"
          type="geojson"
          data={geoJson}
          promoteId="STATE_ID"
        >
          <Layer
            id="state-fills"
            type="fill"
            paint={{
              'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'averageIncome'],
                40000, '#f7fbff',
                50000, '#9ecae1',
                60000, '#4292c6',
                70000, '#2171b5',
                80000, '#084594',
                90000, '#08306b'
              ],
              'fill-opacity': 0.8,
              'fill-outline-color': '#ffffff'
            }}
          />
          <Layer
            id="state-borders"
            type="line"
            paint={{
              'line-color': '#ffffff',
              'line-width': 1
            }}
          />
        </Source>

        {hoverInfo && (
          <Popup
            longitude={hoverInfo.properties.NAME === "Alaska" ? -150 : hoverInfo.properties.NAME === "Hawaii" ? -157 : -98.5795}
            latitude={hoverInfo.properties.NAME === "Alaska" ? 64 : hoverInfo.properties.NAME === "Hawaii" ? 20.5 : 39.8283}
            closeButton={false}
            anchor="bottom"
            offset={20}
            style={{
              backgroundColor: 'white',
              padding: '8px',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              fontSize: '14px'
            }}
          >
            <div className="text-sm font-medium">
              {hoverInfo.properties.NAME}
            </div>
            <div className="text-sm">
              Avg. Income: ${hoverInfo.properties.averageIncome?.toLocaleString()}
            </div>
          </Popup>
        )}
      </Map>

      <div className="absolute bottom-4 left-4 bg-white p-4 rounded shadow-md">
        <div className="flex items-center mb-2">
          <div className="w-6 h-6 bg-[#f7fbff] mr-2"></div>
          <span>&lt; $50K</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-6 h-6 bg-[#9ecae1] mr-2"></div>
          <span>$50K - $60K</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-6 h-6 bg-[#4292c6] mr-2"></div>
          <span>$60K - $70K</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-6 h-6 bg-[#2171b5] mr-2"></div>
          <span>$70K - $80K</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-[#084594] mr-2"></div>
          <span>&gt; $80K</span>
        </div>
      </div>
    </div>
  );
}
