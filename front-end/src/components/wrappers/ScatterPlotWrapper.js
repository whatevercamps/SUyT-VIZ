import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import ScatterPlotChart from "./ScatterPlot.js";

const ScatterPlotWrapper = (props) => {
  const targetRef = useRef(null);
  const [chart, setChart] = useState(null);

  useEffect(() => {
    if (!chart) {
      const chartt = ScatterPlotChart(targetRef.current);
      setChart(chartt);
    } else {
      //;
      chart.update(
        props.data.filter((d) => props.selectedZonas.includes(d.id * 1)),
        "peak",
        "opeak"
      );
    }
  });

  return (
    <div className='ScatterPlotWrapper'>
      <div className='constrols'></div>
      <div ref={targetRef}></div>
    </div>
  );
};

ScatterPlotWrapper.propTypes = {
  data: PropTypes.array.isRequired,
  selectedZonas: PropTypes.array.isRequired,
};

export default ScatterPlotWrapper;
