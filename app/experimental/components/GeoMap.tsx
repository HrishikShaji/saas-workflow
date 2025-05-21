import React, { useEffect, useState } from 'react';
import Map, { Source, Layer } from 'react-map-gl/mapbox';
import axios from 'axios';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_API_KEY_1

interface Props {
  countryQuery: string;
}

const url = "https://raw.githubusercontent.com/HrishikShaji/saas-workflow/refs/heads/main/lib/maps/us-geodata.json"

const GeoMap = ({ countryQuery }: Props) => {
  const [geojsonData, setGeojsonData] = useState(null);

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&polygon_geojson=1&q=${countryQuery}`
        );
        if (res.data.length > 0 && res.data[0].geojson) {
          const geo = res.data[0].geojson;

          // Normalize to valid GeoJSON Feature
          const feature = {
            type: 'Feature',
            geometry: geo,
            properties: {
              name: res.data[0].display_name,
            },
          };

          setGeojsonData({
            type: 'FeatureCollection',
            features: [feature],
          });
        }
      } catch (err) {
        console.error('Error fetching geojson:', err);
      }
    };

    if (countryQuery) {
      fetchGeoData();
    }
  }, [countryQuery]);

  return (
    <Map
      initialViewState={{
        longitude: 0,
        latitude: 20,
        zoom: 2,
      }}
      style={{ width: '100%', height: '600px' }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      {geojsonData && (
        <Source id="geojson" type="geojson" data={url}>
          <Layer
            id="geojson-layer"
            type="fill"
            paint={{
              'fill-color': '#0080ff',
              'fill-opacity': 0.5,
            }}
          />
        </Source>
      )}
    </Map>
  );
};

export default GeoMap;
