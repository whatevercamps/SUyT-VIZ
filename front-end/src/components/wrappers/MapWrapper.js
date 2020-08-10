import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Mapa from "./Mapa.js";
import * as d3 from "d3";
const MapWrapper = (props) => {
  const targetRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    d3.json(
      "https://gist.githubusercontent.com/whatevercamps/5fd930f47b3a6f7d30da3fb605f8eb5b/raw/17b637b6f163aa8a0be439c22460cc38c1fe45ba/zonas.json"
    ).then((dat) => {
      const mmp = Mapa(targetRef.current, dat);
      setMap(mmp);
    });
  }, []);

  useEffect(() => {
    if (map && props.data) {
      map.update(props.data, "peak");
    }
  });

  return (
    <div className='MapWrapper'>
      <div ref={targetRef} style={{ width: "100%", height: "100%" }}></div>
    </div>
  );
};

MapWrapper.propTypes = {
  data: PropTypes.array.isRequired,
  selectedZonas: PropTypes.array.isRequired,
};

export default MapWrapper;
