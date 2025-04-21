'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface MapProps {
  address: string
  coordinates: [number, number] // [lat, lng]
}

export default function Map({ address, coordinates }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  
  useEffect(() => {
    // Vänta på att DOM är klar
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;
    
    // Rensa tidigare karta om den finns
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
    
    // Undvik att köra på serversidan
    if (typeof window === 'undefined') return;
    
    try {
      // Custom markör med modern design och animation
      const icon = L.divIcon({
        className: 'custom-map-marker',
        html: `<div class="marker-pin"></div>
               <div class="marker-pulse"></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      });
  
      // Initiera kartan med ett mer modernt utseende
      const map = L.map('map', {
        zoomControl: false, // Ta bort zoomkontroller
        attributionControl: false, // Ta bort attribution temporärt
        scrollWheelZoom: false, // Inaktivera zoom med mushjul
        dragging: false, // Inaktivera drag-funktionen för mer statisk karta
        touchZoom: false // Inaktivera zoom på touch-enheter
      }).setView(coordinates, 15); // Justera zoomnivå för att visa mer av området
      
      mapRef.current = map;
  
      // Lägg till anpassat kartlager med en stilren design
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);
  
      // Lägg till en markör direkt, utan fördröjning
      const marker = L.marker(coordinates, { icon }).addTo(map);
        
      // Lägg till en popup med adressinformation
      marker.bindPopup(`
        <div class="map-popup">
          <strong>ANO Fotografi</strong>
          <small>${address}</small>
        </div>
      `, { 
        closeButton: false,
        className: 'custom-popup'
      }).openPopup();
      
      // Lägg till attribution i nedre högra hörnet
      L.control.attribution({
        position: 'bottomright',
        prefix: '' // Ta bort "Leaflet" texter
      }).addTo(map);
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    // Städa upp när komponenten avmonteras
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    }
  }, [address, coordinates]);

  return (
    <>
      <div id="map" className="h-40 w-full rounded-md shadow-sm map-container" />
      <style jsx global>{`
        .map-container {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .map-container:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .custom-map-marker {
          position: relative;
        }
        
        .marker-pin {
          width: 20px;
          height: 20px;
          border-radius: 50% 50% 50% 0;
          background-color: #e55039;
          position: absolute;
          transform: rotate(-45deg);
          left: 50%;
          top: 50%;
          margin: -15px 0 0 -15px;
          border: 2px solid #ffffff;
          animation: bounce 1s ease-in-out infinite alternate;
        }
        
        @keyframes bounce {
          0% {
            transform: rotate(-45deg) translateY(0);
          }
          100% {
            transform: rotate(-45deg) translateY(-3px);
          }
        }
        
        .marker-pulse {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background-color: rgba(229, 80, 57, 0.4);
          position: absolute;
          left: 50%;
          top: 50%;
          margin: -7px 0 0 -7px;
          animation: pulse 1.5s infinite;
          z-index: -1;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          70% {
            transform: scale(2.5);
            opacity: 0;
          }
          100% {
            transform: scale(0.8);
            opacity: 0;
          }
        }
        
        .custom-popup .leaflet-popup-content-wrapper {
          background-color: white;
          border-radius: 6px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.15);
          padding: 0;
          animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .custom-popup .leaflet-popup-content {
          margin: 0;
          padding: 0;
        }
        
        .map-popup {
          padding: 8px 12px;
        }
        
        .map-popup strong {
          display: block;
          font-size: 14px;
          margin-bottom: 2px;
          color: #333;
        }
        
        .map-popup small {
          display: block;
          font-size: 12px;
          color: #666;
        }
        
        .directions-link {
          display: none;
        }
      `}</style>
    </>
  )
} 