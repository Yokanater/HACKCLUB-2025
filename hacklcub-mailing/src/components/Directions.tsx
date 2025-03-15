"use client"

import { useState, useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import Input from "./ui/Input";

function Directions() {

	const [location, setLocation] = useState({
		lat: 28.504218886439443,
		lng: 77.09561933574918,
	});
	
	console.log(location);
	const map = useMap();
	const routesLibrary = useMapsLibrary("routes");
	const [directionsService, setDirectionsService] =
		useState<google.maps.DirectionsService>();
	const [directionsRenderer, setDirectionsRenderer] =
		useState<google.maps.DirectionsRenderer>();
	const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
	const [routeIndex, setRouteIndex] = useState(0);
	const selected = routes[routeIndex];
	const leg = selected?.legs[0];

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

       }}>
          <Input
            placeholder="From"
            className="w-[100%] mt-[10px]"
          />
          <Input
            placeholder="To"
            className="w-[100%] mt-[10px]"
          />
          <div className="w-[100%] flex justify-end">
          <button type="submit" className="bg-[#3B82F6] px-[40px] h-[50px] mt-[10px] outline-none border-none rounded-[10px] text-[#fff]">Go!</button>
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
