import React, { useState, useRef, useEffect } from "react";
import DiferenciaHeatmap from "./DiferenciaHeatmap.js";
import { Tab, Tabs, Button, ButtonGroup } from "react-bootstrap";
const DiferenciaHeatmapWrapper = (props) => {
  const targetRef = useRef(null);
  const [chart, setChart] = useState(null);

  useEffect(() => {
    const chartt = DiferenciaHeatmap(
      targetRef.current,
      props.width,
      props.height,
      props.setParDeZonas,
      props.setLineColorScale,
      props.withAxis
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
    if (chart && props.heatmapData && props.minUpz && props.maxUpz) {
      chart.update(
        props.chartLoaded,
        props.heatmapData,
        props.minUpz,
        props.maxUpz,
        null,
        props.sortt
      );
    } else if (
      chart &&
      props.heatmapData &&
      props.zonasSeleccionadas &&
      props.zonasSeleccionadas.length > 0
    ) {
      chart.update(
        props.chartLoaded,
        props.heatmapData,
        null,
        null,
        props.zonasSeleccionadas,
        props.sortt
      );
    } else if (chart && props.heatmapData) {
      chart.update(
        props.chartLoaded,
        props.heatmapData,
        null,
        null,
        null,
        props.sortt
      );
    }
  }, [props.width, props.height]);

  useEffect(() => {
    if (props.minUpz === 1 && props.maxUpz === 32)
      console.log(
        "max and min upz",
        props.minUpz,
        props.maxUpz,
        props.heatmapData && props.heatmapData.length && props.heatmapData[0]
      );
    if (chart && props.heatmapData && props.minUpz && props.maxUpz) {
      chart.update(
        props.chartLoaded,
        props.heatmapData,
        props.minUpz,
        props.maxUpz,
        null,
        props.sortt
      );
    } else if (
      chart &&
      props.heatmapData &&
      props.zonasSeleccionadas &&
      props.zonasSeleccionadas.length > 0
    ) {
      chart.update(
        props.chartLoaded,
        props.heatmapData,
        null,
        null,
        props.zonasSeleccionadas,
        props.sortt
      );
    } else if (chart && props.heatmapData) {
      chart.update(
        props.chartLoaded,
        props.heatmapData,
        null,
        null,
        null,
        props.sortt
      );
    }
  }, [
    props.heatmapData,
    chart,
    props.enteredCount,
    props.zonasSeleccionadas,
    props.sortt,
  ]);

  return (
    <div className='DiferenciaHeatmapWrapper'>
      <div ref={targetRef}></div>
    </div>
  );
};

export default DiferenciaHeatmapWrapper;
