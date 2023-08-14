import { useContext, useEffect, useReducer } from "react";
import { AnySourceData, LngLatBounds, Map, Marker, Popup } from "mapbox-gl";
import { MapContext } from "./MapContext";
import { MapReducer } from "./MapReducer";
import { PlacesContext } from "../places/PlacesContext";
import { directionsAPI } from "../../APIS";
import { DirectionsResponse } from "../../interfaces/directions";

export interface MapState {
	isMapReady: boolean;
	map?: Map;
	markers: Marker[];
}

const INITIAL_STATE: MapState = {
	isMapReady: false,
	map: undefined,
	markers: [],
};

interface Props {
	children: JSX.Element | JSX.Element[];
}

export const MapProvider = ({ children }: Props) => {
	const [state, dispatch] = useReducer(MapReducer, INITIAL_STATE);
	const { places } = useContext(PlacesContext);

	// useEffect(() => {
	// 	state.markers.forEach((marker) => marker.remove());
	// 	const newMarkers: Marker[] = [];

	// 	for (const place of places) {
	// 		const [lng, lat] = place.center;



	// 		const newMarker = new Marker()
	// 			.setLngLat([lng, lat])
	// 			.addTo(state.map!);
	// 		let marketElement = newMarker.getElement();
	// 		marketElement?.addEventListener("click", () => {
	// 			redirectToUrlMaps(lng, lat);
	// 		});
	// 		marketElement.style.cursor = "pointer";



	// 		newMarkers.push(newMarker);
	// 	}

	// 	dispatch({ type: "setMarkers", payload: newMarkers });

	// 	state.map?.resize();

	// }, [places, state.map]);





	const setMap = (map: Map) => {



		dispatch({ type: "setMap", payload: map });
	};

	const getRouteBetweenPoints = async (start: [number, number], end: [number, number]) => {
		const resp = await directionsAPI.get<DirectionsResponse>(`/${start.join(',')};${end.join(',')}`);

		const { distance, duration, geometry } = resp.data.routes[0];

		const { coordinates: coords } = geometry;

		let kms = Math.round(((distance / 1000) * 100)) / 100;

		const minutes = Math.floor(duration / 60);

		console.log({ kms, minutes });

		const bounds = new LngLatBounds(

		);

		for (const coord of coords) {
			const newCoord: [number, number] = [coord[0], coord[1]];
			bounds.extend(newCoord);
		}

		state.map?.fitBounds(bounds, {
			padding: 200
		})

		const sourceData: AnySourceData = {
			type: 'geojson',
			data: {
				type: 'FeatureCollection',
				features: [
					{
						type: 'Feature',
						properties: {},
						geometry: {
							type: 'LineString',
							coordinates: coords
						}
					}
				]
			}
		}

		if (state.map?.getLayer('RouteString')) {
			state.map.removeLayer('RouteString');
			state.map.removeSource('RouteString');
		}

		state.map?.addSource('RouteString', sourceData);

		state.map?.addLayer({
			id: 'RouteString',
			type: 'line',
			source: 'RouteString',
			layout: {
				'line-cap': 'round',
				'line-join': 'round'
			},
			paint: {
				'line-color': 'black',
				'line-width': 3
			}
		})
	}

	return (
		<MapContext.Provider
			value={{
				...state,
				// Methods
				setMap,
				getRouteBetweenPoints
			}}
		>
			{children}
		</MapContext.Provider>
	);
};
