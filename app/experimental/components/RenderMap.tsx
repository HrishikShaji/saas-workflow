"use client"

import React from 'react';
import Map, { Source, Layer } from 'react-map-gl/mapbox';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_API_KEY_1;

export interface GeoMapProps {
  geoJson: any; // GeoJSON FeatureCollection
  dataKey?: string; // Property key used for styling
  mapType?: 'choropleth' | 'point' | 'heatmap' | 'symbol';
  colorStops?: [number, string][];
  viewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  height?: string;
  width?: string;
}

const defaultView = {
  longitude: -98,
  latitude: 39,
  zoom: 3
};

export const defaultColorStops: [number, string][] = [
  [40000, '#000000'],
  [50000, '#9ecae1'],
  [60000, '#4292c6'],
  [70000, '#000000'],
  [80000, '#084594'],
  [90000, '#08306b']
];

const RenderMap = ({
  geoJson,
  dataKey = 'averageIncome',
  mapType = 'choropleth',
  colorStops = defaultColorStops,
  viewState = defaultView,
  height = '600px',
  width = '100%'
}: GeoMapProps) => {
  if (!geoJson) {
    return <div>No GeoJSON data provided</div>;
  }

  const layers = {
    choropleth: {
      id: 'choropleth-layer',
      type: 'fill',
      paint: {
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', dataKey],
          ...colorStops.flat()
        ],
        'fill-opacity': 0.8,
        'fill-outline-color': '#ffffff'
      }
    },
    point: {
      id: 'point-layer',
      type: 'circle',
      paint: {
        'circle-radius': 6,
        'circle-color': '#007cbf'
      }
    },
    heatmap: {
      id: 'heatmap-layer',
      type: 'heatmap',
      paint: {
        'heatmap-weight': ['get', dataKey],
        'heatmap-intensity': 1,
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(0, 0, 255, 0)',
          0.5, 'blue',
          1, 'red'
        ],
        'heatmap-radius': 15
      }
    },
    symbol: {
      id: 'symbol-layer',
      type: 'symbol',
      layout: {
        'text-field': ['get', dataKey],
        'text-size': 12
      },
      paint: {
        'text-color': '#333'
      }
    }
  };

  return (
    <Map
      initialViewState={viewState}
      style={{ width, height }}
      mapStyle="mapbox://styles/mapbox/light-v10"
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      <Source id="geojson" type="geojson" data={geoJson}>
        <Layer {...layers[mapType]} />
      </Source>
    </Map>
  );
};

export default RenderMap;
