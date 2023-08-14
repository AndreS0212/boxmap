import { BtnMyLocation, Loading, SearchBar } from "./";
import { MapContext, PlacesContext } from "../context";
import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import mapboxgl, { LngLat, Marker } from "mapbox-gl";
import locationIcon from '../assets/565949.png'
import lockOpenIcon from '../assets/unlock.png'; // Ruta de la imagen de candado abierto
import lockClosedIcon from '../assets/lock.png'

interface MapViewProps {
	width: string;
	height: string;
}
interface CreateMapProps {
	center: [number, number] | LngLat;
}

export const MapView = ({ width, height }: MapViewProps) => {
	const { isLoading, userLocation, places, cleanPlaces } = useContext(PlacesContext);
	const { map, setMap } = useContext(MapContext)
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
	const styleNames: { [key: string]: string } = {
		'mapbox://styles/mapbox/streets-v9': 'Streets',
		'mapbox://styles/mapbox/outdoors-v11': 'Outdoors',
		'mapbox://styles/mapbox/light-v10': 'Light',
		'mapbox://styles/mapbox/dark-v10': 'Dark',
		// Agrega más estilos y sus nombres aquí si lo deseas
	};
	const sizes = {
		width: width,
		height: height
	}

	const createMap = ({ center }: CreateMapProps) => {
		const map = new mapboxgl.Map({
			accessToken: process.env.REACT_APP_MAPBOX_TOKEN || 'pk.',
			container: mapDiv.current!, // container ID
			style: styles[styleIndex], // Utiliza el estilo basado en el índice actual
			center: center,
			zoom: 15,
			attributionControl: false,
			logoPosition: 'bottom-right',
			doubleClickZoom: !isMapLocked,
			dragRotate: !isMapLocked,
			keyboard: !isMapLocked,
			pitchWithRotate: !isMapLocked,
			dragPan: !isMapLocked,
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
		let markerElement = marker?.getElement();
		if (markerElement) {
			markerElement.onclick = () => {
				redirectToUrlMaps(newMarkerPosition?.lng!, newMarkerPosition?.lat!);
			}
			markerElement.style.cursor = 'pointer';
		}
	};

	const redirectToUrlMaps = (lng: number, lat: number) => {
		//know if is a mobile device or not
		const isAndroid = /Android/i.test(navigator.userAgent);
		const isIos = /iPhone|iPad|iPod/i.test(navigator.userAgent);
		if (isAndroid) {
			window.location.href = `geo:${lat},${lng}?q=${lat},${lng}`;
		} else if (isIos) {
			window.open(`http://maps.apple.com/?q=${lat},${lng}`, "_blank");
		} else {
			window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, "_blank");
		}
	};

	const toggleMapLock = () => {
		setIsMapLocked((prevState) => !prevState);
	};

	const changeMapStyle = () => {
		// Incrementa el índice del estilo o regresa al primer estilo cuando llega al último
		setStyleIndex((prevIndex) => (prevIndex + 1) % styles.length);
	};

	const centerToUserLocation = () => {
		if (map && userLocation) {
			map.flyTo({ center: userLocation, zoom: 15 });
		}
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
		<div ref={mapDiv} className="rounded-xl shadow-xl relative" style={sizes}>
			<SearchBar />
			<input type="text" id="Title" defaultValue={''} className="shadow-xl rounded-xl p-1 w-[50%] absolute bottom-0 z-10" />

			{/* Botón para cambiar el estilo */}
			<button onClick={changeMapStyle} className="absolute top-0 right-2 z-10 px-4 py-2 bg-blue-500 text-white rounded-md">
				{styleNames[styles[styleIndex]]} {/* Muestra el nombre del estilo */}
			</button>


			{/* Botón para desbloquear o bloquear el mapa */}
			<button onClick={toggleMapLock} className="absolute top-[40px] left-2 z-10 p-2 bg-white text-white rounded-md">
				{isMapLocked ? (

					<img src={lockOpenIcon} alt="Lock Open" width="15" height="20" />
				) : (
					<img src={lockClosedIcon} alt="Lock Closed" width="15" height="20" />
				)}
			</button>
			<button className="w-12 h-12 absolute top-[40%] left-[44%] z-10" onClick={() => redirectToUrlMaps(map?.getCenter()?.lng!, map?.getCenter().lat!)} />
			<button onClick={centerToUserLocation} disabled={isMapLocked} className="absolute top-[80px] left-2 z-10 p-2 bg-white rounded-md">
				<img src={locationIcon} alt="Mi ubicación" className="w-4 h-4" />
			</button>
		</div>
	);
};
