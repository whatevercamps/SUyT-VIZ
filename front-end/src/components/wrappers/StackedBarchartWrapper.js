import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import StackedBarChart from "./StackedBarChart.js";

const StackedBarchartWrapper = (props) => {
  const targetRef = useRef(null);
  const [sorted, setSorted] = useState(false);
  const [bh, setBh] = useState(null);
  useEffect(() => {
    //;
    if (!bh) {
      const bhtemp = StackedBarChart(props.data, targetRef.current, [
        "peak",
        "opeak",
      ]);
      setBh(bhtemp);
    } else
      bh.update(
        props.data.filter((d) => props.selectedZonas.includes(d.id * 1)),
        500,
        sorted
      );
  });

  return (
    <div className='BarchartWrapper'>
      <div className='constrols'>
        <div className='form-check'>
          <input
            type='checkbox'
            className='form-check-input'
            id='sortedCheckbox'
            onChange={() => setSorted(!sorted)}
          />
          <label className='form-check-label'>Ordenar</label>
        </div>
      </div>
      <div ref={targetRef}></div>
    </div>
  );
};

StackedBarchartWrapper.propTypes = {
  data: PropTypes.array.isRequired,
};

export default StackedBarchartWrapper;
