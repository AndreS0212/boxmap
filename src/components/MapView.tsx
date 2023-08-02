import { Loading, SearchBar } from "./";
import { MapContext, PlacesContext } from "../context";
import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

interface MapViewProps {
	width: string;
	height: string;
}

export const MapView = ({ width, height }: MapViewProps) => {
	const { isLoading, userLocation, places } = useContext(PlacesContext);
	const { setMap } = useContext(MapContext)
	const inputValue = useRef('')
	const [actualPlace, setActualPlace] = useState('')
	const mapDiv = useRef<HTMLDivElement>(null);
	const sizes = {
		width: width,
		height: height
	}

	useLayoutEffect(() => {
		if (!isLoading) {
			const map = new mapboxgl.Map({
				accessToken: 'pk.eyJ1IjoiYW5kcmVzMDIxMiIsImEiOiJjbGtzcXh3ZGgwNjVrM2dyMGVwajg5NWZwIn0.2Azv717Np8mP_0KhSewMHw',
				container: mapDiv.current!, // container ID
				style: "mapbox://styles/mapbox/streets-v9", // style URL
				center: userLocation, // starting position [lng, lat]
				zoom: 14, // starting zoom
				attributionControl: false,
				logoPosition: 'bottom-right',
				dragRotate: false,
				pitchWithRotate: false,
				touchZoomRotate: false,
				doubleClickZoom: false,
				dragPan: false,
				keyboard: false,




			});
			// Set the map container size to match the specified dimensions
			map.resize();

			setMap(map);
		}
	}, [isLoading]);





	if (isLoading) return <Loading />;

	return (
		<div
			ref={mapDiv}
			className="rounded-xl shadow-xl relative"
			style={sizes}
		>
			<SearchBar setActualPlace={setActualPlace} />
			<input type="text" value={''} className="absolute bottom-0 z-10" />

		</div>

	);
};
