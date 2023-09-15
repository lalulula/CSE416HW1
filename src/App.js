/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import ReactMapboxGL, { Source, Layer } from "react-map-gl";
import * as shapefile from "shapefile"; // Import the shapefile library
import "./App.css";
import JSZip from "jszip";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoieXVuYWhraW0iLCJhIjoiY2xtNTgybXd2MHdtMjNybnh6bXYweGNweiJ9.cfBakJXxub4ejba076E2Cw";
const DEFAULT_GEOJSON =
  "https://raw.githubusercontent.com/glynnbird/usstatesgeojson/master/california.geojson";
function App() {
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "90vh",
    latitude: 44.065256,
    longitude: -125.075801,
    zoom: 5,
  });
  const fileInput = useRef(null);
  const [selectedMapFile, setSelectedMapFile] = useState(DEFAULT_GEOJSON);
  const [fileName, setFileName] = useState("init.geojson");
  const handleLoadMap = () => {
    fileInput.current.click();
  };

  const handleMapChange = async (e) => {
      const file = e.target.files[0];
      setFileName(file.name);

      const texts = await file.text();

      // uploadedFile -> type: json object
      let uploadedFile;

      if (file.name.endsWith(".json") || file.name.endsWith(".geojson")) {
        uploadedFile = JSON.parse(texts);
      } else if (file.name.endsWith(".kml")) {
        var tj = require("./togeojson");
        var kml = new DOMParser().parseFromString(texts, "text/xml");
        uploadedFile = JSON.parse(JSON.stringify(tj.kml(kml), null, 4));
      } else if (file.name.endsWith(".zip")) {
        JSZip.loadAsync(file).then(
          function ( zip ) 
          {
            var shpString = "";
            var dbfString = "";
            for (var i = 0; i < Object.keys(zip["files"]).length; i++) {
              // console.log(Object.keys(zip["files"])[i]);
              if (Object.keys(zip["files"])[i].endsWith(".shp")){
                shpString = Object.keys(zip["files"])[i];
              }
              else if(Object.keys(zip["files"])[i].endsWith(".dbf")){
                dbfString = Object.keys(zip["files"])[i];
              }
            } 
            
            // I want to convert it into arraybuffer. 
            const shpBuffer = zip["files"][shpString];
            const dbfBuffer = zip["files"][dbfString];

            
            console.log(shpBuffer);
            console.log(dbfBuffer);

            const geojson = shapefile.read(shpBuffer, dbfBuffer);
            uploadedFile = geojson;
            console.log(uploadedFile);
          }
        );
  
       
        
      }

      setSelectedMapFile(uploadedFile);
    
 
  };
  return (
    <>
      <div>
        <span>{fileName}</span>
        <button onClick={handleLoadMap}>Load Map</button>
        <input
          type="file"
          id="mapFile"
          ref={fileInput}
          onChange={handleMapChange}
          style={{ display: "none" }}
          accept=".json, .geojson, .kml, .zip"
        />
      </div>

      <div className="Mapbox">
        <ReactMapboxGL
          initialViewState={{
            longitude: -122.4,
            latitude: 37.8,
            zoom: 3,
          }}
          onViewportChange={setViewport}
          // This one is more like a plain view
          mapStyle="mapbox://styles/mapbox/outdoors-v11"
          //This is a round view - I just wanted to try things so I added it and wanted you guys to take a look at it
          // mapStyle="mapbox://styles/mapbox/light-v11"
          mapboxAccessToken={MAPBOX_TOKEN}
        >
          {selectedMapFile && (
            <Source
              id="geoSource"
              type="geojson"
              generateId={true}
              data={selectedMapFile}
            >
              <Layer
                type="fill"
                source="geoSource"
                paint={{
                  "fill-color": "#0080ff",
                  "fill-opacity": 0.4,
                  "fill-outline-color": "#000000",
                }}
              />
              <Layer
                type="symbol"
                source="geoSource"
                layout={{
                  "text-field": ["get", "name"],
                }}
              />
              <Layer
                id="outline"
                type="line"
                source="geoSource"
                paint={{
                  "line-color": "#000",
                  "line-width": 3,
                }}
              />
            </Source>
          )}
        </ReactMapboxGL>
      </div>
    </>
  );
}

export default App;
