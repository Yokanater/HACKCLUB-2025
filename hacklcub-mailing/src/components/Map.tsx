"use client";

import React, { useEffect, useState } from "react";
import Directions from "./Directions";

let landmarks_ = []
import {
	APIProvider,
	// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
	Map,
    useMap,
    useMapsLibrary,
} from "@vis.gl/react-google-maps";

const API_KEY = "AIzaSyBHCiPwbVsm1LreUIYbPMJV8Y-wCO3IAQM";

const Maps = () => (
	<APIProvider apiKey={API_KEY}>
		<div className="flex ">
            <Landmarks />
			<Directions />
            <div style={{width: "70vw", height: "100vh"}}>
                <Map
                    defaultCenter={{ lat: 43.65, lng: -79.38 }}
                    defaultZoom={9}
                    gestureHandling={"greedy"}
                    fullscreenControl={true}
                />
            </div>
		</div>
	</APIProvider>
);


function Landmarks() {
	
	const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);
	const placesLibrary = useMapsLibrary('places');
	const [landmarks, setLandmarks] = useState<google.maps.places.PlaceResult[]>([]);

	const map = useMap();

	useEffect(() => {
		if (!map || landmarks.length>0) return;
		
		if (placesLibrary) {
			setPlacesService(new placesLibrary.PlacesService(map));
		}

		placesService?.nearbySearch(
			{
				location: { lat: 28.504218886439443, lng: 77.09561933574918 },
				radius: 5000,
				type: "restaurant",
			},
			(results, status) => {
			    setLandmarks(results || [])
                landmarks_ = results || []
			},
		);


		
	}, [map, placesLibrary, placesService]);


	return (
		<>
		</>
	);
}


export default Maps;
