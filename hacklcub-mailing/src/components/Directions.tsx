"use client"

import { useState, useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import Input from "./ui/Input";
import LocationSearchBox from "./LocationSearch";

type SelectValue = {
  label: string;
  value: string;
}

function Directions() {

  const [fromValue, setFromValue] = useState<SelectValue | null>(null);
  const [toValue, setToValue] = useState<SelectValue | null>(null);

	const [location, setLocation] = useState({
		lat: 28.504218886439443,
		lng: 77.09561933574918,
	});
	
	console.log(location);
	const routesLibrary = useMapsLibrary("routes");
	const [directionsService, setDirectionsService] =
		useState<google.maps.DirectionsService>();
	const [directionsRenderer, setDirectionsRenderer] =
		useState<google.maps.DirectionsRenderer>();
	const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
	const [routeIndex, setRouteIndex] = useState(0);
	const selected = routes[routeIndex];
	const leg = selected?.legs[0];
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
				// for each place, get only its lat, and lng and set it in the state
				let temp:any = [];
				results?.forEach((place) => {
					temp.push({
						lat: place.geometry?.location?.lat(),
						lng: place.geometry?.location?.lng(),
					});
				});

				setLandmarks(() => temp);
			},
		);


		
	}, [map, placesLibrary, placesService]);
	console.log(landmarks);

	// Initialize directions service and renderer
	useEffect(() => {
		if (!routesLibrary || !map) return;
		setDirectionsService(new routesLibrary.DirectionsService());
		setDirectionsRenderer(
			new routesLibrary.DirectionsRenderer({
				draggable: true, 
				map,
			}),
		);
	}, [routesLibrary, map]);


	useEffect(() => {
		if (!directionsRenderer) return;


		const listener = directionsRenderer.addListener(
			"directions_changed",
			() => {

				const result = directionsRenderer.getDirections();
				if (result) {
					setRoutes(result.routes);
				}
			},
		);

		return () => google.maps.event.removeListener(listener);
	}, [directionsRenderer]);


	useEffect(() => {
		if (!directionsService || !directionsRenderer) return;

		directionsService
			.route({
				origin: location,
				destination: "DLF Ambience Gurugram",
				travelMode: google.maps.TravelMode.DRIVING,
				provideRouteAlternatives: true,
			})
			.then((response) => {
				directionsRenderer.setDirections(response);
				setRoutes(response.routes);
			});

		return () => directionsRenderer.setMap(null);
	}, [location, directionsService, directionsRenderer]);

	// Update direction route
	useEffect(() => {
		if (!directionsRenderer) return;
		directionsRenderer.setRouteIndex(routeIndex);
	}, [routeIndex, directionsRenderer]);

	if (!leg) return null;
	return (
		<div className="directions bg-[#fff] p-[20px]" style={{width: "25vw"}}>
       <h1 className="font-[700] text-[30px]">Hack Club Maps</h1>
       <p className="pt-[10px]">Enter destination and source</p>
       <form className="pt-[-10px]" onSubmit={(e) => {
         e.preventDefault()
         if(!fromValue) return

         const fromString = fromValue.value;
         const parts = fromString.split(',')

         setLocation({
           lat: Number.parseFloat(parts[0]),
           lng: Number.parseFloat(parts[1])
         })
       }}>
       <LocationSearchBox value={fromValue} placeholder="From" onChange={setFromValue} />
       <LocationSearchBox value={toValue} placeholder="To" onChange={setToValue} />
          <div className="w-[100%] flex justify-end">
          <button type="submit" className="cursor-pointer bg-[#3B82F6] px-[40px] h-[50px] mt-[10px] outline-none border-none rounded-[10px] text-[#fff]">Go!</button>
          </div>
      </form>

      <div className="w-[100%] h-[2px] bg-[#00000020] my-[20px]" />

			<h2>{selected.summary}</h2>
			<p>
				{leg.start_address.split(",")[0]} to {leg.end_address.split(",")[0]}
			</p>
			<p>Distance: {leg.distance?.text}</p>
			<p>Duration: {leg.duration?.text}</p>

			<h2>Other Routes</h2>
			<ul>
				{routes.map((route, index) => (
					<li key={route.summary}>
						<button type="submit" onClick={() => setRouteIndex(index)}>
							{route.summary}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}



export default Directions;
