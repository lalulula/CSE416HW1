// import React, { Component } from "react";
// import { createRef } from "react";
// import ReactMapboxGL, { Source, Layer } from "react-map-gl";
// import "./App.css";

// const MAPBOX_TOKEN =
//   "pk.eyJ1IjoieXVuYWhraW0iLCJhIjoiY2xtNTgybXd2MHdtMjNybnh6bXYweGNweiJ9.cfBakJXxub4ejba076E2Cw";
// const DEFAULT_GEOJSON =
//   "https://raw.githubusercontent.com/glynnbird/usstatesgeojson/master/california.geojson";

// class App extends Component {
//   state = {
//     viewport: {
//       width: "100vw",
//       height: "90vh",
//       latitude: 44.065256,
//       longitude: -125.075801,
//       zoom: 3,
//     },
//     selectedMapFile: DEFAULT_GEOJSON,
//   };

//   fileInput = createRef();

//   loadMapClick = (e) => {
//     this.fileInput.current.click();
//   };

//   mapChange = (e) => {
//     let file = e.target.files[0];

//     // console.log(file['name'])
//     // TODO: check the type of file.
//     // If it is not json file, convert it into json format
//     // file['name'] contain the name of file. We should check it's subfix
//     let fileReader = new FileReader();
//     fileReader.readAsText(file);

//     fileReader.onload = () => {
//       // Making text into Json object
//       let result = JSON.parse(JSON.parse(JSON.stringify(fileReader.result)));

//       this.setState({ selectedMapFile: result });
//     };
//   };

//   render() {
//     const { viewport, selectedMapFile } = this.state;
//     return (
//       <body>
//         <div>
//           {/* TODO: Change the desigin of button */}
//           <button onClick={this.loadMapClick}>Load Map</button>
//           <input
//             type="file"
//             id="mapFile"
//             ref={this.fileInput}
//             onChange={this.mapChange}
//             style={{ display: "none" }}
//             accept=".json, .geojson"
//           />
//         </div>

//         <div className="Mapbox">
//           <ReactMapboxGL
//             initialViewState={{
//               longitude: -122.4,
//               latitude: 37.8,
//               zoom: 3,
//             }}
//             onViewportChange={(viewport) => this.setState({ viewport })}
//             mapStyle="mapbox://styles/mapbox/outdoors-v11"
//             mapboxAccessToken={MAPBOX_TOKEN}
//           >
//             {/* TODO: Adding text Label on it */}
//             <Source
//               id="geoSource"
//               type="geojson"
//               generateId={true}
//               data={selectedMapFile}
//             >
//               <Layer
//                 type="fill"
//                 source="geoSource"
//                 paint={{
//                   "fill-color": "#228b22",
//                   "fill-opacity": 0.4,
//                   "fill-outline-color": "#000000",
//                 }}
//               />
//               <Layer
//                 type="symbol"
//                 source="geoSource"
//                 layout={{
//                   "text-field": ["get", "name"],
//                 }}
//               />
//             </Source>
//           </ReactMapboxGL>
//         </div>
//       </body>
//     );
//   }
// }

// export default App;
import React, { useState, useEffect, useRef } from "react";
import ReactMapboxGL, { Source, Layer } from "react-map-gl";
import "./App.css";

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
    zoom: 3,
  });
  const fileInput = useRef(null);
  const [selectedMapFile, setSelectedMapFile] = useState(DEFAULT_GEOJSON);
  const [fileName, setFileName] = useState("init.geojson");
  const handleLoadMap = () => {
    fileInput.current.click();
  };
  const handleMapChange = (e) => {
    let file = e.target.files[0];
    let fileReader = new FileReader();
    setFileName(file["name"]);
    // console.log(file["name"].replace(/\.geojson$/, ""));
    fileReader.readAsText(file);
    fileReader.onload = () => {
      let uploadedFile = JSON.parse(
        JSON.parse(JSON.stringify(fileReader.result))
      );
      setSelectedMapFile(uploadedFile);
    };
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
          accept=".json, .geojson"
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
          mapStyle="mapbox://styles/mapbox/outdoors-v11"
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
                  "fill-color": "#228b22",
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
            </Source>
          )}
        </ReactMapboxGL>
      </div>
    </>
  );
}

export default App;
