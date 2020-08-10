import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Linechart from "./Linechart.js";
import Controls from "./LinechartConstrols.js";
const LinechartWrapper = (props) => {
  const targetRef = useRef(null);
  const [linechart, setLinechart] = useState(null);
  const [parametros, setParametros] = useState([]);

  useEffect(() => {
    const linechart = Linechart(targetRef.current, null, props.height);
    setLinechart(linechart);
  }, []);

  useEffect(() => {
    if (
      linechart &&
      parametros.length &&
      props.dataLoaded &&
      props.tiempos &&
      props.tiempos.length
    ) {
      linechart.update(props.data, parametros, props.tiempos);
    }
  });

  return (
    <div className='LinechartWrapper'>
      <Controls
        {...props}
        parametros={parametros}
        changeParams={setParametros}
        data={props.data}
      />
      <div
        ref={targetRef}
        style={{ width: "100%", height: "100%", marginTop: "10px" }}
      ></div>
    </div>
  );
};

LinechartWrapper.propTypes = {
  data: PropTypes.array.isRequired,
  selectedZonas: PropTypes.array.isRequired,
};

export default LinechartWrapper;
