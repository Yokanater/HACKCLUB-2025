import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

interface LocationSearchProps {
  value: {label: string, value: string} | null;
  placeholder: string;
  onChange: ({label, value}: {label: string, value: string}) => void

}


export default function LocationSearchBox({value, placeholder, onChange}: LocationSearchProps) {
  const map = useMap()
	const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);
	const placesLibrary = useMapsLibrary('places');

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
		if (placesLibrary && map) {
			setPlacesService(new placesLibrary.PlacesService(map));
		}
  }, [])

  return <AsyncSelect cacheOptions loadOptions={(input, callback) => {
    console.log(input)
    navigator.geolocation.getCurrentPosition((location) => {
      placesService?.textSearch({
        query: input,
        location: {
          lat: location.coords.latitude,
          lng: location.coords.longitude
        }    
      }, (results) => {
        if(!results) {
          callback([])
          return
        }

        const displayResults = results.map(result => {
          return {
            label: `${result.name}, ${result.formatted_address}`,
            value: `${result.geometry?.location?.lat()}, ${result.geometry?.location?.lng()}`
          }
        });

        console.log(displayResults)
        callback(displayResults)
      })
    });
  }}
  value={value}
  // @ts-ignore
  onChange={onChange}
  placeholder={placeholder}
  noOptionsMessage={({inputValue}) => {
    if(!inputValue.length) return <p>Type to begin searching...</p>
    return <p>No Results</p>
  }}
  styles={{
  }}
/>
}
