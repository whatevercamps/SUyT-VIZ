import React, { useState, useRef, useEffect } from "react";
import Heatmap from "./Heatmap.js";
import { Tab, Tabs, Button, ButtonGroup } from "react-bootstrap";
const HeatmapWrapper = (props) => {
  const targetRef = useRef(null);
  const [chart, setChart] = useState(null);

  useEffect(() => {
    const chartt = Heatmap(
      targetRef.current,
      props.width,
      props.height,
      props.setParDeZonas,
      props.setLineColorScale,
      props.withAxis,
      props.escala || 0,
      props.diferencia,
      props.minAndMax
    );
    setChart(chartt);
  }, []);

  useEffect(() => {
    if (chart && props.ultimaZonaInteresada) {
      chart.bordearZona(props.ultimaZonaInteresada.replace("UPZ", "a"));
    }
  }, [props.ultimaZonaInteresada]);

  useEffect(() => {
    if (chart) chart.resize(props.width, props.height);
    if (
      chart &&
      ((props.diferencia &&
        props.heatmapCompareData1 &&
        props.heatmapCompareData2) ||
        (!props.diferencia && props.heatmapData)) &&
      props.minUpz &&
      props.maxUpz
    ) {
      chart.update(
        props.chartLoaded,
        props.heatmapData,
        props.minUpz,
        props.maxUpz,
        null,
        props.sortt,
        props.minAndMax
      );
    } else if (
      chart &&
      ((props.diferencia &&
        props.heatmapCompareData1 &&
        props.heatmapCompareData2) ||
        (!props.diferencia && props.heatmapData)) &&
      props.zonasSeleccionadas &&
      props.zonasSeleccionadas.length > 0
    ) {
      chart.update(
        props.chartLoaded,
        props.heatmapData,
        null,
        null,
        props.zonasSeleccionadas,
        props.sortt,
        props.heatmapCompareData1,
        props.heatmapCompareData2,
        props.minAndMax
      );
    } else if (
      chart &&
      ((props.diferencia &&
        props.heatmapCompareData1 &&
        props.heatmapCompareData2) ||
        (!props.diferencia && props.heatmapData))
    ) {
      chart.update(
        props.chartLoaded,
        props.heatmapData,
        null,
        null,
        null,
        props.sortt,
        props.heatmapCompareData1,
        props.heatmapCompareData2,
        props.minAndMax
      );
    }
  }, [props.width, props.height]);

  useEffect(() => {
    if (props.minUpz === 1 && props.maxUpz === 32)
      console.log(
        "max and min upz",
        props.minUpz,
        props.maxUpz,
        props.heatmapData &&
          props.heatmapData.length &&
          props.heatmapCompareData1
      );
    if (
      chart &&
      ((props.diferencia &&
        props.heatmapCompareData1 &&
        props.heatmapCompareData2) ||
        (!props.diferencia && props.heatmapData)) &&
      props.minUpz &&
      props.maxUpz
    ) {
      chart.update(
        props.chartLoaded,
        props.heatmapData,
        props.minUpz,
        props.maxUpz,
        null,
        props.sortt,

        props.heatmapCompareData1,
        props.heatmapCompareData2,
        props.minAndMax
      );
    } else if (
      chart &&
      ((props.diferencia &&
        props.heatmapCompareData1 &&
        props.heatmapCompareData2) ||
        (!props.diferencia && props.heatmapData)) &&
      props.zonasSeleccionadas &&
      props.zonasSeleccionadas.length > 0
    ) {
      chart.update(
        props.chartLoaded,
        props.heatmapData,
        null,
        null,
        props.zonasSeleccionadas,
        props.sortt,

        props.heatmapCompareData1,
        props.heatmapCompareData2,
        props.minAndMax
      );
    } else if (
      chart &&
      ((props.diferencia &&
        props.heatmapCompareData1 &&
        props.heatmapCompareData2) ||
        (!props.diferencia && props.heatmapData))
    ) {
      chart.update(
        props.chartLoaded,
        props.heatmapData,
        null,
        null,
        null,
        props.sortt,
        props.heatmapCompareData1,
        props.heatmapCompareData2,
        props.minAndMax
      );
    }
  }, [
    props.heatmapData,
    chart,
    props.enteredCount,
    props.zonasSeleccionadas,
    props.sortt,
    props.heatmapCompareData1,
    props.heatmapCompareData2,
  ]);

  return (
    <div className='HeatmapWrapper'>
      <div ref={targetRef}></div>
    </div>
  );
};

export default HeatmapWrapper;
