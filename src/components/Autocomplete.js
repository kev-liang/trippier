import { useRef, useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps"

const AutoComplete = (props) => {
  const { setMarkers } = props
  const autoCompleteRef = useRef();
  const inputRef = useRef();
  const map = useMap();

  const options = {
    componentRestrictions: { country: "ng" },
    fields: ["address_components", "geometry", "icon", "name"],
    types: ["establishment"]
  };

  useEffect(() => {
    if (!map) return;
    // map.fitBounds()
  }, [map]);

  useEffect(() => {
    if (!window.google) return
    autoCompleteRef.current = new window.google.maps.places.SearchBox(
      inputRef.current,
      options
    );

    autoCompleteRef.current.addListener("places_changed", onPlacesChanged);
  }, [window.google]);

  const onPlacesChanged = () => {
    const places = autoCompleteRef.current.getPlaces();
    const newMarkers = []

    places.forEach(place => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }
      newMarkers.push(place.geometry.location)
    })
    setMarkers(newMarkers)
  }
  // autoCompleteRef.current
  return (
    <div>
      <label>enter address :</label>
      <input ref={inputRef} />
    </div>
  );
};
export default AutoComplete;