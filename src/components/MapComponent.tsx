import { Map, AdvancedMarker, Pin, useMap } from "@vis.gl/react-google-maps";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useEffect, useState } from "react";
import type { Marker, MarkerGroup } from "../store/markerGroupSlice";
import { RgbColor } from "react-colorful";
import { Constants } from "../utils/constants";
import { findGroup } from "../domain/groups";

// marker type
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

const MapComponent = (props: any) => {
  // todo marker type
  const markers: Marker[] = useSelector(
    (state: RootState) => state.markerGroup.allGroup.markers
  );
  const groups: MarkerGroup[] = useSelector(
    (state: RootState) => state.markerGroup.groups
  );
  const allGroup: MarkerGroup = useSelector(
    (state: RootState) => state.markerGroup.allGroup
  );

  const map = useMap();
  const position = { lat: 53.54992, lng: 10.00678 };

  const fitMapBounds = (map: any, mapBounds: google.maps.LatLngBounds) => {
    if (!mapBounds) return;
    map.fitBounds(mapBounds);
  };

  useEffect(() => {
    if (!map || markers.length === 0) return;
    const mapBounds = getMapBounds(markers);
    fitMapBounds(map, mapBounds);

    if (markers.length === 1) map.setZoom(15);
  }, [map, markers]);

  const getColorString = (color: RgbColor): string => {
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
  };

  const getMarkersFromGroups = () => {
    return markers.map((marker) => {
      console.log("MARKER", marker);
      const markerGroup =
        marker.groupId === Constants.DEFAULT_MARKER_GROUP_ID
          ? allGroup
          : findGroup(groups, marker.groupId);
      if (markerGroup && marker.geometry) {
        let color = getColorString(markerGroup.color);
        let secondaryColor = getColorString(markerGroup.secondaryColor);
        return (
          <AdvancedMarker position={marker.geometry.location}>
            <Pin
              background={color}
              borderColor={secondaryColor}
              glyphColor={secondaryColor}
            ></Pin>
          </AdvancedMarker>
        );
      }
    });
  };

  return (
    <Map mapId={"test"} defaultCenter={position} defaultZoom={10}>
      {/* <AdvancedMarker
        position={position}
        title={"AdvancedMarker with customized pin."}
      >
        <Pin
          background={"#22ccff"}
          borderColor={"#1e89a1"}
          glyphColor={"#0f677a"}
        ></Pin>
      </AdvancedMarker> */}
      {getMarkersFromGroups()}
    </Map>
  );
};

export default MapComponent;
