"use client";

import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

interface LocationSearchProps {
  value: { label: string; value: string } | null;
  placeholder: string;
  onChange: ({ label, value }: { label: string; value: string }) => void;
}

export default function LocationSearchBox({
  value,
  placeholder,
  onChange,
}: LocationSearchProps) {
  const map = useMap();
  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService | null>(null);
  const placesLibrary = useMapsLibrary("places");

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (placesLibrary && map) {
      setPlacesService(new placesLibrary.PlacesService(map));
    }
  }, []);

  return (
    <AsyncSelect
      cacheOptions
      loadOptions={(input, callback) => {
        console.log(input);
        navigator.geolocation.getCurrentPosition((location) => {
          placesService?.textSearch(
            {
              query: input,
              location: {
                lat: location.coords.latitude,
                lng: location.coords.longitude,
              },
            },
            (results) => {
              console.log(results);
              if (!results) {
                callback([]);
                return;
              }

              const displayResults = results.map((result) => {
                return {
                  label: `${result.name}, ${result.formatted_address}`,
                  value: `${result.geometry?.location?.lat()}, ${result.geometry?.location?.lng()}`,
                };
              });

              console.log(displayResults);
              callback(displayResults);
            },
          );
        });
      }}
      value={value}
      // @ts-ignore
      onChange={onChange}
      placeholder={placeholder}
      noOptionsMessage={({ inputValue }) => {
        if (!inputValue.length) return <p>Type to begin searching...</p>;
        return <p>No Results</p>;
      }}
      styles={{
        control: (base, state) => ({
          ...base,
          fontWeight: "400",
          fontSize: "16px",
          marginLeft: "0",
          marginBottom: "12px",
          // border: !state.isFocussed && "3px solid #e4e7eb",
          height: "56px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
            cursor: "pointer",
          },
          borderRadius: "12px",
        }),
        menu: (base, state) => ({
          ...base,
          borderRadius: "6px",
        }),
        valueContainer: (provided, state) => ({
          ...provided,
          color: "brown",
          height: "30px",
        }),
        singleValue: (provided) => ({
          ...provided,
          color: "#3e4c59",
        }),
        option: (base, state) => ({
          ...base,
          fontSize: "14px",
          fontWeight: "400",
          // borderRadius: '6px 6px 6px 6px',
          backgroundColor: state.isSelected
            ? "var(--primary-color-light)"
            : "#fff",
          color: state.isSelected ? "#F9F9F9" : "#3e4c59",
          "&:hover": {
            backgroundColor: state.isSelected
              ? "var(--primary-color-light)"
              : "var(--primary-button)",
            cursor: !state.isSelected ? "pointer" : "default",
          },
        }),
        menuList: (base, state) => ({
          ...base,
          paddingTop: "0",
          paddingBottom: "0",
        }),
      }}
    />
  );
}
