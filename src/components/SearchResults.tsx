import { useContext, useState } from "react";
import { MapContext, PlacesContext } from "../context";
import { Feature } from "../interfaces/places";
import { LoadingPlaces } from "./LoadingPlaces";

interface Props {
	showResults: boolean;
	setShowResults: (show: boolean) => void;
}
export const SearchResults = ({ showResults, setShowResults }: Props) => {
	const { places, isLoadingPlaces, userLocation, setPlace } = useContext(PlacesContext);
	const { map, getRouteBetweenPoints } = useContext(MapContext);
	const [activeId, setActiveId] = useState("");


	const onPlaceClick = (place: Feature) => {
		setActiveId(place.id);
		setPlace(place);
		const [lng, lat] = place.center;

		map?.flyTo({
			zoom: 15,
			center: [lng, lat],
		});
		setShowResults(false);
	};

	const getRoute = (place: Feature) => {
		if (!userLocation) return;
		const [lng, lat] = place.center;
		getRouteBetweenPoints(userLocation, [lng, lat]);

	}

	if (isLoadingPlaces) return <LoadingPlaces />;

	if (places.length === 0) return <></>;

	return (
		<ul className="">
			{showResults && places.map((place) => (
				<li
					key={place.id}
					className={` ${activeId === place.id && "active"
						}`}
					onClick={() => onPlaceClick(place)}
				>
					<p style={{ fontSize: "10px" }}>
						{place.place_name}
					</p>

					{/* <button
						onClick={() => getRoute(place)}
						className={`btn btn-sm ${activeId === place.id
							? "btn-outline-light"
							: "btn-outline-primary"
							}`}
					>
						Direcciones
					</button> */}
				</li>
			))}
		</ul>
	);
};
