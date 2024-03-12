import { Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps"

const MapComponent = (props) => {
  const { markers } = props
  const position = { lat: 53.54992, lng: 10.00678 };

  return (
    <Map mapId={"test"} defaultCenter={position} defaultZoom={10}>
      <AdvancedMarker
        position={position}
        title={'AdvancedMarker with customized pin.'}>
        <Pin
          background={'#22ccff'}
          borderColor={'#1e89a1'}
          glyphColor={'#0f677a'}></Pin>
      </AdvancedMarker>
      {markers.map(marker => {
        return <AdvancedMarker position={marker} />
      })}
    </Map>
  )
}

export default MapComponent