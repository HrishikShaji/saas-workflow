"use client"

import * as React from 'react';
import Map from 'react-map-gl/mapbox';
// If using with mapbox-gl v1:
// import Map from 'react-map-gl/mapbox-legacy';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function MapBox() {
  console.log("MAPBOX API KEY", process.env.NEXT_PUBLIC_MAPBOX_API_KEY_1)
  return (
    <div className='h-full w-full flex justify-center items-center '>

      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY_1}
        initialViewState={{
          longitude: -122.4,
          latitude: 37.8,
          zoom: 14
        }}
        style={{ width: 600, height: 400 }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      />
    </div>
  );
}
