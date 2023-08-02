import { MapView, SearchBar } from "../components";
import { MapProvider, PlacesProvider } from "../context";
export const HomeScreen = () => {
	return (
		<div className=" max-w-[600px] max-h-[600px] flex flex-wrap gap-4">
			{/* <PlacesProvider>
				<MapProvider>
					<MapView width="190px" height="190px" />
				</MapProvider>
			</PlacesProvider>

			<PlacesProvider>
				<MapProvider>

					<MapView width="390px" height="190px" />
				</MapProvider>
			</PlacesProvider>

			<PlacesProvider>
				<MapProvider>
					<MapView width="190px" height="390px" />
				</MapProvider>
			</PlacesProvider> */}
			<PlacesProvider>
				<MapProvider>
					<MapView width="390px" height="390px" />

				</MapProvider>
			</PlacesProvider >
		</div >
	);
};
