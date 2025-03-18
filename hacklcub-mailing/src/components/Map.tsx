"use client";

import React, { useEffect, useState } from "react";
import Directions from "./Directions";

import {
  APIProvider,
  // biome-ignore lint/suspicious/noShadowRestrictedNames: stfu
  Map,
} from "@vis.gl/react-google-maps";

const API_KEY = "remove this please";

const Maps = () => (
  <APIProvider apiKey={API_KEY}>
    <div className="flex ">
      <Directions />
      <div style={{ width: "75vw", height: "100vh" }}>
        <Map
          defaultCenter={{ lat: 28.504218886439443, lng: 77.09561933574918 }}
          defaultZoom={12}
          gestureHandling={"greedy"}
          fullscreenControl={true}
        />
      </div>
    </div>
  </APIProvider>
);

export default Maps;
