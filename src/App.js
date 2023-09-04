import React, { Component } from "react";
import { createRef } from "react";
import ReactMapboxGL, { Source, Layer } from "react-map-gl";
import "./App.css";

const MAPBOX_TOKEN = "pk.eyJ1IjoieXVuYWhraW0iLCJhIjoiY2xtNTgybXd2MHdtMjNybnh6bXYweGNweiJ9.cfBakJXxub4ejba076E2Cw"; 
const DEFAULT_GEOJSON = "https://raw.githubusercontent.com/glynnbird/usstatesgeojson/master/california.geojson"


class App extends Component {

  state = {
    viewport: {
      width: "100vw",
      height: "90vh",
      latitude: 44.065256,
      longitude: -125.075801,
      zoom: 3,
    },
    selectedMapFile: DEFAULT_GEOJSON,
  };


  fileInput = createRef();

  loadMapClick = e => {
    this.fileInput.current.click();
  };

  mapChange = e => {

    let file = e.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsText(file);

    fileReader.onload = () => {
      let result = JSON.parse(JSON.parse(JSON.stringify(fileReader.result)))
      // console.log(typeof(result));
      // console.log(result['type']);
      this.setState({ selectedMapFile: result })

    };
    
  };

  
  render() {
    const {viewport, selectedMapFile} = this.state;
    return (
      <body>

        <div>
          {/* TODO: Change the desigin of button */}
          <button onClick={this.loadMapClick}>Load Map</button>
          <input type="file"
            id='mapFile'
            ref={this.fileInput}
            onChange={this.mapChange}
            style={{ display: "none" }} 
            accept='.json' />
          {/* For Test */}
          {/* <h4>Current Source: {selectedMapFile}</h4> */}
          
        </div>

        <div className="Mapbox">
          <ReactMapboxGL
            initialViewState={{
              longitude: -122.4,
              latitude: 37.8,
              zoom: 3,
            }}
            onViewportChange={(viewport) => this.setState({ viewport })}
            mapStyle="mapbox://styles/mapbox/outdoors-v11"
            mapboxAccessToken={MAPBOX_TOKEN}
          >
            <Source
              id="oregonjson"
              type="geojson"
              data={selectedMapFile}
            />
            <Layer
              id="anything"
              type="fill"
              source="oregonjson"
              paint={{ "fill-color": "#228b22", "fill-opacity": 0.4 }}
            />
          </ReactMapboxGL>
        </div>
      </body>
    );
  }
}

export default App;
