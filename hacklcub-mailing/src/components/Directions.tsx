"use client";

import { useState, useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { useMapsLibrary, Marker } from "@vis.gl/react-google-maps";
import Input from "./ui/Input";
import LocationSearchBox from "./LocationSearch";

type SelectValue = {
  label: string;
  value: string;
};

function Directions() {
  const [fromValue, setFromValue] = useState<SelectValue | null>(null);
  const [toValue, setToValue] = useState<SelectValue | null>(null);

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    {
      lat: 28.504218886439443,
      lng: 77.09561933574918,
    },
  );
  const [destination, setDestination] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [routeIndex, setRouteIndex] = useState(0);
  const selected = routes[routeIndex];
  const leg = selected?.legs[0];
  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService | null>(null);
  const placesLibrary = useMapsLibrary("places");
  const [landmarks, setLandmarks] = useState([]);
  const [waypoints, setWaypoints] = useState([]);

  const map = useMap();

  useEffect(() => {
    if (!map || landmarks.length > 0) return;
    if (placesLibrary) {
      setPlacesService(new placesLibrary.PlacesService(map));
    }
  }, [placesLibrary]);

  useEffect(() => {
    if (!map || landmarks.length > 0) return;
    if (!location) return;

    placesService?.nearbySearch(
      {
        location: location,
        radius: 5000,
        type: "restaurant",
      },
      (results, status) => {
        // for each place, get only its lat, and lng and set it in the state
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const temp: any = [];
        // biome-ignore lint/complexity/noForEach: <explanation>
        results?.forEach((place) => {
          console.log(place.geometry?.location?.lat);
          temp.push({
            location: {
              lat: place.geometry?.location?.lat().valueOf(),
              lng: place.geometry?.location?.lng().valueOf(),
            },
          });
        });

        setLandmarks(temp);
      },
    );
  }, [placesService, location]);

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
    if (!location) return;
    if (!toValue) return;

    setTimeout(() => {
      if (!directionsService || !directionsRenderer) return;
      if (!toValue) return;

      console.log(landmarks, "lolo");
      directionsService
        .route({
          origin: location,
          waypoints: landmarks.length === 0 ? [] : landmarks,
          destination: toValue.label,
          travelMode: google.maps.TravelMode.DRIVING,
          provideRouteAlternatives: false,
        })
        .then((response) => {
          directionsRenderer.setDirections(response);
          setRoutes(response.routes);
        });

      return () => directionsRenderer.setMap(null);
    }, 1000);
  }, [landmarks, location, directionsService, directionsRenderer, toValue]);

  // Update direction route
  useEffect(() => {
    if (!directionsRenderer) return;
    directionsRenderer.setRouteIndex(routeIndex);
  }, [routeIndex, directionsRenderer]);

  // if (!leg) return null;
  return (
    <div className="directions bg-[#fff] p-[20px]" style={{ width: "25vw" }}>
      <h1 className="font-[700] text-[30px]">Hack Club Maps</h1>
      <p className="pt-[10px] mb-[6px]">Enter destination and source</p>
      <form
        className="pt-[-10px]"
        onSubmit={(e) => {
          e.preventDefault();
          if (!fromValue || !toValue) return;

          const fromString = fromValue.value;
          const parts = fromString.split(",");

          setLocation({
            lat: Number.parseFloat(parts[0]),
            lng: Number.parseFloat(parts[1]),
          });

          const t2oString = toValue.value;
          const toParts = t2oString.split(",");

          setDestination({
            lat: Number.parseFloat(toParts[0]),
            lng: Number.parseFloat(toParts[1]),
          });
        }}
      >
        <LocationSearchBox
          value={fromValue}
          placeholder="From"
          onChange={setFromValue}
        />
        <LocationSearchBox
          value={toValue}
          placeholder="To"
          onChange={setToValue}
        />
        <div className="w-[100%] flex justify-end">
          <button
            type="submit"
            className="cursor-pointer bg-[#3B82F6] px-[40px] h-[50px] mt-[10px] outline-none border-none rounded-[10px] text-[#fff]"
          >
            Go!
          </button>
        </div>
      </form>

      <div className="w-[100%] h-[2px] bg-[#00000020] mt-[20px] mb-[10px]" />

	  <div className="mb-[16px] flex justify-between text-[#3B82F6]" style={{
		fontWeight: '600',
	  }}><p>Distance: {leg.distance?.text}</p>
			<p>Duration: {leg.duration?.text}</p></div>
			<div style={{
						maxHeight: '300px',
						overflow: 'auto',
						overflowX: 'hidden',
						overflowY: 'auto',
						paddingRight: '10px',
						
					}}>
						
					<h2 style={{
						fontSize: '22px',
						fontWeight: '800',
						color: 'black'
					}}>Directions</h2>
				<div className="flex justify-between items-center mt-[16px]">
				<div className="flex gap-[15px] items-center">
				<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#6d6d6d" d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7"/></svg>
				<div style={{
					fontSize: '16px',
					fontWeight: '700',
				}} className="text-gray-700">{leg.start_address.split(",")[0]}</div>
				</div>
				<div style={{
					fontSize: '16px',
					fontWeight: '700',
					color: '#8f8f8f',
				}}>START</div>
				</div>
				
				<div className="text-gray-300 ml-[11.6px]">•</div>
				<>
				{
				
				leg.steps.slice(0,4).map(function(item, i){
					return (<div >
						<div className="flex justify-between">
						<div className="flex gap-[10px] items-center">
						<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/><path fill="#6d6d6d" d="M15.764 4a3 3 0 0 1 2.683 1.658l1.386 2.771q.366-.15.72-.324a1 1 0 0 1 .894 1.79a32 32 0 0 1-.725.312l.961 1.923A3 3 0 0 1 22 13.473V16a3 3 0 0 1-1 2.236V19.5a1.5 1.5 0 0 1-3 0V19H6v.5a1.5 1.5 0 0 1-3 0v-1.264c-.614-.55-1-1.348-1-2.236v-2.528a3 3 0 0 1 .317-1.341l.953-1.908q-.362-.152-.715-.327a1.01 1.01 0 0 1-.45-1.343a1 1 0 0 1 1.342-.448q.355.175.72.324l1.386-2.77A3 3 0 0 1 8.236 4zM7.5 13a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3m9 0a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3m-.736-7H8.236a1 1 0 0 0-.832.445l-.062.108l-1.27 2.538C7.62 9.555 9.706 10 12 10c2.142 0 4.101-.388 5.61-.817l.317-.092l-1.269-2.538a1 1 0 0 0-.77-.545L15.765 6Z"/></g></svg>
						<div key="stuff" className="ml-[5px] text-gray-700" style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '180px', height:'25px'}} dangerouslySetInnerHTML={{__html: item.instructions.slice(0,55)}}></div>
						</div>
						<div className="ml-auto mt-auto mb-auto text-[#3B82F6]">{item.distance?.text}, {item.duration?.text}</div>
						</div>
						
						{item != leg.steps[leg.steps.length-1] ? (
							<>
								<div className="text-gray-300 ml-[11.6px]">•</div>
									
								<div className="text-gray-300 ml-[11.6px]">•</div>
							</>
						) : <br />}
						</div>
				)})
				}
				
				</>
				<div className="flex justify-between items-center">
				<div className="flex gap-[15px] items-center">
				<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#6d6d6d" d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7"/></svg>
				<div style={{
					fontSize: '16px',
					fontWeight: '700',
				}} className="text-gray-700">{leg.end_address.split(",")[0]}</div>
				</div>
				<div style={{
					fontSize: '16px',
					fontWeight: '700',
					color: '#8f8f8f',
				}}>END</div>
				</div>
				
			<br />
			</div>

		</div>
	);
}

export default Directions;
