import { useRef, useEffect } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { setSelectedPlace } from "../store/markerGroupSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";

// markers type
const getMapBounds = (markers: any[]): google.maps.LatLngBounds => {
  if (markers.length === 0) {
    const coords = new google.maps.LatLng(
      47.49953800467987,
      -122.00863460863837
    );
    return new google.maps.LatLngBounds(coords);
  }
  let south = Number.MAX_SAFE_INTEGER;
  let east = Number.MIN_SAFE_INTEGER;
  let north = Number.MIN_SAFE_INTEGER;
  let west = Number.MAX_SAFE_INTEGER;

  markers.forEach((marker) => {
    let lat = marker.geometry.location.lat;
    let lng = marker.geometry.location.lng;
    south = Math.min(south, lat);
    north = Math.max(north, lat);
    east = Math.max(east, lng);
    west = Math.min(west, lng);
  });
  const southWest = new google.maps.LatLng(south, west);
  const northEast = new google.maps.LatLng(north, east);

  return new google.maps.LatLngBounds(southWest, northEast);
};

const AutoComplete = (props: any) => {
  const dispatch = useDispatch();
  const autoCompleteRef = useRef<google.maps.places.SearchBox | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const map = useMap();
  const placesLibrary = useMapsLibrary("places");
  const markers: any = useSelector((state: RootState) =>
    state.markerGroup.groups.flatMap(({ markers }) => markers)
  );

  const options = {
    componentRestrictions: { country: "ng" },
    fields: ["address_components", "geometry", "icon", "name"],
    types: ["establishment"],
  };

  const fitMapBounds = (map: any, mapBounds: google.maps.LatLngBounds) => {
    if (!mapBounds) return;
    map.fitBounds(mapBounds);
  };

  useEffect(() => {
    if (!map || !markers) return;
    const mapBounds = getMapBounds(markers);
    console.log("AF", mapBounds);
    fitMapBounds(map, mapBounds);
    if (markers.length === 1) map.setZoom(15);
  }, [map, markers]);

  // ADDING SEARCHBOX AND ADDING LISTENER
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
      const newPlace: any = { geometry: {} };
      console.log("PLACE", place);
      // TODO find what data necessary in place
      if (place.geometry?.location) {
        newPlace.geometry.location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        newPlace.formattedAddress = place.formatted_address;
        newPlace.placeId = place.place_id;
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
