import { Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useEffect, useState } from "react";
import type { MarkerGroup } from "../store/markerGroupSlice";

const MapComponent = (props: any) => {
  // todo marker type
  const markers: any = useSelector((state: RootState) =>
    state.markerGroup.groups.flatMap(({ markers }) => markers)
  );
  console.log("MARKERS MAP", markers);
  const groups: MarkerGroup[] = useSelector(
    (state: RootState) => state.markerGroup.groups
  );
  const position = { lat: 53.54992, lng: 10.00678 };

  useEffect(() => {
    const _markers = [];
    groups.forEach((group) => {
      (markers as any[]).concat(group.markers);
    });
  }, [groups]);

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
      {markers.map((marker: any) => {
        return <AdvancedMarker position={marker.geometry.location} />;
      })}
    </Map>
  );
};

export default MapComponent;
