import React, { useEffect, useState } from 'react';
import Map, { Source, Layer } from 'react-map-gl/mapbox';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_API_KEY_1;

interface Props {
  countryQuery: string;
}

const mockStateIncomeData = [
  { id: "01", name: "Alabama", averageIncome: 49261 },
  { id: "02", name: "Alaska", averageIncome: 73391 },
  { id: "04", name: "Arizona", averageIncome: 58945 },
  { id: "05", name: "Arkansas", averageIncome: 47262 },
  { id: "06", name: "California", averageIncome: 78672 },
  { id: "08", name: "Colorado", averageIncome: 71887 },
  { id: "09", name: "Connecticut", averageIncome: 78833 },
  { id: "10", name: "Delaware", averageIncome: 64241 },
  { id: "11", name: "District of Columbia", averageIncome: 85703 },
  { id: "12", name: "Florida", averageIncome: 55735 },
  { id: "13", name: "Georgia", averageIncome: 58900 },
  { id: "15", name: "Hawaii", averageIncome: 81486 },
  { id: "16", name: "Idaho", averageIncome: 55207 },
  { id: "17", name: "Illinois", averageIncome: 65930 },
  { id: "18", name: "Indiana", averageIncome: 56235 },
  { id: "19", name: "Iowa", averageIncome: 59609 },
  { id: "20", name: "Kansas", averageIncome: 57818 },
  { id: "21", name: "Kentucky", averageIncome: 50247 },
  { id: "22", name: "Louisiana", averageIncome: 48952 },
  { id: "23", name: "Maine", averageIncome: 56519 },
  { id: "24", name: "Maryland", averageIncome: 86338 },
  { id: "25", name: "Massachusetts", averageIncome: 81804 },
  { id: "26", name: "Michigan", averageIncome: 56697 },
  { id: "27", name: "Minnesota", averageIncome: 70315 },
  { id: "28", name: "Mississippi", averageIncome: 44817 },
  { id: "29", name: "Missouri", averageIncome: 54880 },
  { id: "30", name: "Montana", averageIncome: 54315 },
  { id: "31", name: "Nebraska", averageIncome: 59666 },
  { id: "32", name: "Nevada", averageIncome: 58927 },
  { id: "33", name: "New Hampshire", averageIncome: 76801 },
  { id: "34", name: "New Jersey", averageIncome: 85245 },
  { id: "35", name: "New Mexico", averageIncome: 47169 },
  { id: "36", name: "New York", averageIncome: 67844 },
  { id: "37", name: "North Carolina", averageIncome: 54386 },
  { id: "38", name: "North Dakota", averageIncome: 64181 },
  { id: "39", name: "Ohio", averageIncome: 56202 },
  { id: "40", name: "Oklahoma", averageIncome: 51924 },
  { id: "41", name: "Oregon", averageIncome: 63246 },
  { id: "42", name: "Pennsylvania", averageIncome: 61340 },
  { id: "44", name: "Rhode Island", averageIncome: 64240 },
  { id: "45", name: "South Carolina", averageIncome: 52406 },
  { id: "46", name: "South Dakota", averageIncome: 56894 },
  { id: "47", name: "Tennessee", averageIncome: 52708 },
  { id: "48", name: "Texas", averageIncome: 59670 },
  { id: "49", name: "Utah", averageIncome: 68458 },
  { id: "50", name: "Vermont", averageIncome: 61028 },
  { id: "51", name: "Virginia", averageIncome: 72882 },
  { id: "53", name: "Washington", averageIncome: 73731 },
  { id: "54", name: "West Virginia", averageIncome: 46344 },
  { id: "55", name: "Wisconsin", averageIncome: 60247 },
  { id: "56", name: "Wyoming", averageIncome: 61884 }
];

const GeoMap = ({ countryQuery }: Props) => {
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

  console.log("json", geojson)

  return (
    <Map
      initialViewState={{
        longitude: -98,
        latitude: 39,
        zoom: 3,
      }}
      style={{ width: '100%', height: '600px' }}
      mapStyle="mapbox://styles/mapbox/light-v10"
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      <Source id="geojson" type="geojson" data={geojson}>
        <Layer
          id="state-fills"
          type="fill"
          paint={{
            'fill-color': [
              'interpolate',
              ['linear'],
              ['get', 'averageIncome'],
              40000, '#000000',
              50000, '#9ecae1',
              60000, '#4292c6',
              70000, '#000000',
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
    </Map>
  );
};

export default GeoMap;
