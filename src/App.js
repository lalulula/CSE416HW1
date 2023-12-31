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
  const [selectedMapFile, setSelectedMapFile] = useState("");
  const [fileName, setFileName] = useState("init.geojson");
  const handleLoadMap = () => {
    fileInput.current.click();
  };

  const handleMapChange = async (e) => {
    try{
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
        try {
          const zip = new JSZip();
          const zipContents = await zip.loadAsync(file); // Load the ZIP file asynchronously
          // Find the .shp and .dbf files in the ZIP archive
          let shpBuffer, dbfBuffer;
          for (const fileName in zipContents.files) {
            if (fileName.endsWith(".shp")) {
              shpBuffer = await zipContents.files[fileName].async("arraybuffer");
            } else if (fileName.endsWith(".dbf")) {
              dbfBuffer = await zipContents.files[fileName].async("arraybuffer");
            }
          }
          // Process shpBuffer and dbfBuffer here
          // You can use a library like 'shapefile' to read the contents

          const geojson = await shapefile.read(shpBuffer, dbfBuffer);
          // console.log(geojson.features[0]);
          for (const data in geojson.features) {
            var i = 0;
            var name = "NAME_"
            for(i = 0; i < 10; i++){
              if(geojson.features[data].properties[name + i] === undefined){
                i--;
                break;
              }
            }
            
            geojson.features[data].properties.name = geojson.features[data].properties[name+i];
          }
          

          uploadedFile = geojson;
        } catch (error) {
          // Handle any errors that may occur during file processing
          console.error("Error processing the ZIP file:", error);
        }
      }
      setSelectedMapFile(uploadedFile);
    
    }
    catch (error){
      setSelectedMapFile(DEFAULT_GEOJSON);
      console.log(error)
    }
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
