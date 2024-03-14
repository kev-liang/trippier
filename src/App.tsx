import { APIProvider } from '@vis.gl/react-google-maps';
import MapComponent from './components/MapComponent';
import { useState } from "react";
// import MarkerGroup from './components/MarkerGroup';
import MarkerGroup from './components/MarkerGroups';
function App() {
  const position = { lat: 53.54992, lng: 10.00678 };

  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_API_KEY || ''}>
      <MarkerGroup />
      <div style={{ height: "100vh", width: "100vw" }}>
        <MapComponent />
      </div>
    </APIProvider>
  );
}

export default App;