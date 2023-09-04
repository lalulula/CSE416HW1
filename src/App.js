/* import * as React from "react";
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

export default App; */

import React, { Component } from "react";
import ReactMapboxGL, { Source, Layer } from "react-map-gl";
import "./App.css";

class App extends Component {
  state = {
    viewport: {
      width: "100vw",
      height: "90vh",
      latitude: 44.065256,
      longitude: -125.075801,
      zoom: 3,
    },
  };
  render() {
    return (
      <div className="Mapbox">
        <ReactMapboxGL
          initialViewState={{
            longitude: -122.4,
            latitude: 37.8,
            zoom: 14,
          }}
          onViewportChange={(viewport) => this.setState({ viewport })}
          mapStyle="mapbox://styles/mapbox/outdoors-v11"
          /* mapboxApiAccessToken="pk.eyJ1IjoieXVuYWhraW0iLCJhIjoiY2xtNTgybXd2MHdtMjNybnh6bXYweGNweiJ9.cfBakJXxub4ejba076E2Cw" */
          mapboxAccessToken="pk.eyJ1IjoieXVuYWhraW0iLCJhIjoiY2xtNTgybXd2MHdtMjNybnh6bXYweGNweiJ9.cfBakJXxub4ejba076E2Cw"
        >
          <Source
            id="oregonjson"
            type="geojson"
            data="https://raw.githubusercontent.com/glynnbird/usstatesgeojson/master/california.geojson"
          />
          <Layer
            id="anything"
            type="fill"
            source="oregonjson"
            paint={{ "fill-color": "#228b22", "fill-opacity": 0.4 }}
          />
        </ReactMapboxGL>
      </div>
    );
  }
}

export default App;
