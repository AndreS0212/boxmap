import { BtnMyLocation, Loading, SearchBar } from "./";
import { MapContext, PlacesContext } from "../context";
import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import mapboxgl, { LngLat, Marker } from "mapbox-gl";

interface MapViewProps {
	width: string;
	height: string;
}
interface CreateMapProps {
	center: [number, number] | LngLat;
}

export const MapView = ({ width, height }: MapViewProps) => {
	const { isLoading, userLocation, places } = useContext(PlacesContext);
	const { setMap } = useContext(MapContext)
	const [isMapLocked, setIsMapLocked] = useState(true);
	const [styleIndex, setStyleIndex] = useState(0); // Índice del estilo actualmente seleccionado
	const mapRef = useRef<mapboxgl.Map>();
	const [marker, setMarker] = useState<mapboxgl.Marker>();
	const mapDiv = useRef<HTMLDivElement>(null);
	const [markerPosition, setMarkerPosition] = useState<[number, number]>(); // Initial marker position
	const styles = [
		'mapbox://styles/mapbox/streets-v9',
		'mapbox://styles/mapbox/outdoors-v11',
		'mapbox://styles/mapbox/light-v10',
		'mapbox://styles/mapbox/dark-v10',
		// Agrega más estilos disponibles aquí si lo deseas
	];
	const sizes = {
		width: width,
		height: height
	}

	const createMap = ({ center }: CreateMapProps) => {
		const map = new mapboxgl.Map({
			accessToken: 'pk.eyJ1IjoiYW5kcmVzMDIxMiIsImEiOiJjbGtzcXh3ZGgwNjVrM2dyMGVwajg5NWZwIn0.2Azv717Np8mP_0KhSewMHw',
			container: mapDiv.current!, // container ID
			style: styles[styleIndex], // Utiliza el estilo basado en el índice actual
			center: center,
			zoom: 14,
			attributionControl: false,
			logoPosition: 'bottom-right',
			interactive: !isMapLocked,
			scrollZoom: !isMapLocked,
		});
		// Set the map container size to match the specified dimensions
		map.resize();
		// Create the marker and add it to the map
		const marker = new mapboxgl.Marker().setLngLat(map.getCenter()).addTo(map);
		setMarker(marker);
		mapRef.current = map;

		setMap(map);
	}
	useEffect(() => {
		if (userLocation) {
			createMap({ center: userLocation })
		}
	}, [userLocation])

	useEffect(() => {
		if (!isLoading && mapDiv.current) {
			createMap({ center: marker?.getLngLat()! });
		}
	}, [isMapLocked, styleIndex]); // Actualiza el mapa cuando cambia el índice de estilo


	const updateMarkerPosition = () => {
		const map = mapRef.current;
		const newMarkerPosition = map?.getCenter();
		setMarkerPosition([newMarkerPosition?.lng!, newMarkerPosition?.lat!]);
		marker?.setLngLat(newMarkerPosition!);
	};

	const toggleMapLock = () => {
		setIsMapLocked((prevState) => !prevState);
	};

	const changeMapStyle = () => {
		// Incrementa el índice del estilo o regresa al primer estilo cuando llega al último
		setStyleIndex((prevIndex) => (prevIndex + 1) % styles.length);
	};


	useEffect(() => {
		if (places.length == 1) {
			let titleInput = document.getElementById('Title') as HTMLInputElement
			titleInput.value = places[0].text_es
		}
	}, [places])
	useEffect(() => {
		const map = mapRef.current;
		if (map) {
			map.on('move', updateMarkerPosition);

			// Clean up the event listener on unmount
			return () => {
				map.off('move', updateMarkerPosition);
			};
		}
	}, [mapRef.current]);
	if (isLoading) return <Loading />;

	return (
		<div
			ref={mapDiv}
			className="rounded-xl shadow-xl relative"
			style={sizes}
		>
			<SearchBar />
			<input id="Title" type="text" className="absolute bottom-0 z-10" />
			{/* Botón para cambiar el estilo */}
			<button onClick={changeMapStyle} className="absolute top-0 right-2 z-10 px-4 py-2 bg-blue-500 text-white rounded-md">
				Estilo
			</button>

			{/* Botón para desbloquear o bloquear el mapa */}
			<button onClick={toggleMapLock} className="absolute top-25 left-2 z-10 px-4 py-2 bg-green-500 text-white rounded-md">
				{isMapLocked ? 'Desbloquear Mapa' : 'Bloquear Mapa'}
			</button>
		</div>

	);
};
