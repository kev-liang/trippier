import { useRef, useEffect } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { setSelectedPlace } from "../store/markerGroupSlice";
import { useDispatch } from "react-redux";

const AutoComplete = (props: any) => {
  const dispatch = useDispatch();
  const autoCompleteRef = useRef<google.maps.places.SearchBox | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const map = useMap();
  const placesLibrary = useMapsLibrary("places");

  const options = {
    componentRestrictions: { country: "ng" },
    fields: ["address_components", "geometry", "icon", "name"],
    types: ["establishment"],
  };

  useEffect(() => {
    if (!map) return;
    // map.fitBounds()
  }, [map]);

  useEffect(() => {
    if (!placesLibrary || !map || !inputRef.current) return;
    const { SearchBox } = placesLibrary;
    autoCompleteRef.current = new SearchBox(inputRef.current);
    if (!autoCompleteRef.current || !inputRef.current) return;
    autoCompleteRef.current.addListener("places_changed", onPlacesChanged);
  }, [placesLibrary, map]);

  const onPlacesChanged = () => {
    if (!autoCompleteRef.current) return;
    const places = autoCompleteRef.current.getPlaces();
    if (!places) return;
    const newMarkers: any[] = [];

    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }
      newMarkers.push(place);
      const newPlace: any = {geometry: {}};
      console.log("PLACE", place)
      // TODO find what data necessary in place
      if (place.geometry?.location) {
        newPlace.geometry.location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        newPlace.formattedAddress = place.formatted_address
        dispatch(setSelectedPlace(newPlace));
      }
    });
  };

  return (
    <div>
      <label>enter address :</label>
      <input ref={inputRef} />
    </div>
  );
};
export default AutoComplete;
