import React, { useRef, useEffect, useState } from "react";
import Timeline from "./Timeline";
import * as d3 from "d3";

const TimelineWrapper = (props) => {
  const targetRef = useRef(null);

  const [timeline, setTimeline] = useState(null);
  useEffect(() => {
    const tm = Timeline(targetRef.current, props.setTiempos);
    setTimeline(tm);
  }, []);

  useEffect(() => {
    if (timeline) {
      const data = props.data || [];
      const additionalData = props.additionalData || [];
      timeline.update(data.concat(additionalData));
    }
  }, [props.data, props.additionalData, timeline]);

  return (
    <div className='Timeline'>
      <h3>
        Evolución de la Accesibilidad en el tiempo{" "}
        <small>(arrastre la barra gris para cambiar el tiempo)</small>
      </h3>
      <div className='timelineChart' ref={targetRef}></div>
    </div>
  );
};

export default TimelineWrapper;
