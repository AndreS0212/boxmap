import React from 'react'
import ReactDOM from 'react-dom/client'
import { MapsApp } from './MapsApp';

import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = '';

if (!navigator.geolocation) {
  alert('El navegador no tiene opcion de geolocalizacion');

  throw new Error('El navegador no tiene opcion de geolocalizacion');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <MapsApp />
)
