import * as React from "react";
import Map from "react-map-gl";
import "./App.css";

function App() {
  return (
    <>
      <form>
        <input type="file" />
      </form>
      <Map
        mapboxAccessToken="pk.eyJ1IjoieXVuYWhraW0iLCJhIjoiY2xtNTgybXd2MHdtMjNybnh6bXYweGNweiJ9.cfBakJXxub4ejba076E2Cw"
        initialViewState={{
          longitude: -122.4,
          latitude: 37.8,
          zoom: 14,
        }}
        style={{ width: 600, height: 400 }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      />
    </>
  );
}

export default App;
