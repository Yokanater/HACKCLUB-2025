"use client";

import React, { useEffect, useState } from "react";
import Directions from "./Directions";

let landmarks_ = []
import {
	APIProvider,
	// biome-ignore lint/suspicious/noShadowRestrictedNames: stfu
	Map,
    useMap,
    useMapsLibrary,
} from "@vis.gl/react-google-maps";

const API_KEY = "AIzaSyBHCiPwbVsm1LreUIYbPMJV8Y-wCO3IAQM";

const Maps = () => (
	<APIProvider apiKey={API_KEY}>
		<div className="flex ">
			<Directions />
            <div style={{width: "75vw", height: "100vh"}}>
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




export default Maps;
