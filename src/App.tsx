import { APIProvider } from '@vis.gl/react-google-maps';
import MapComponent from './components/MapComponent';
import AutoComplete from './components/Autocomplete';
import { useState } from "react";

function App() {
  const position = { lat: 53.54992, lng: 10.00678 };
  const [markers, setMarkers] = useState([])

  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_API_KEY || ''}>
      {markers.length}
      <div style={{ height: "100vh", width: "100vw" }}>
        <AutoComplete setMarkers={setMarkers} />
        <MapComponent markers={markers} />
      </div>
    </APIProvider>
  );
}

export default App;