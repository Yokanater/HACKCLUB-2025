"use client";

import React, { useEffect, useState } from "react";
import Directions from "./Directions";

let landmarks_ =[]
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
		if (!map) return;
		console.log
		if (landmarks.length>0){
			landmarks.forEach((landmark) => {
				landmarks_.push({
					name: landmark.name,
					lat: landmark.geometry?.location?.lat(),
					lng: landmark.geometry?.location?.lng(),
				})
			})
			return
		}
		
		
		if (placesLibrary) {
			setPlacesService(new placesLibrary.PlacesService(map));
		}

		console.log(placesService?.nearbySearch(
			{
				location: { lat: 43.65, lng: -79.38 },
				radius: 5000,
				type: "restaurant",
			},
			(results, status) => {console.log(
				results,
				status
			)

			setLandmarks(results || [])
			},
		));
		
	}, [map, placesLibrary, placesService, landmarks]);

	return (
		<>
		</>
	);
}


export default Maps;
