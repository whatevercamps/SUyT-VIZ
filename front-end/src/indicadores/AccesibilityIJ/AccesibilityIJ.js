import React, { useEffect, useState, useRef, useCallback } from "react";
import DonutsWrapper from "./DonutsWrapper";
import BarsWrapper from "./BarsWrapper";
import Mapbox from "../../components/Mapbox";
import * as d3 from "d3";
import TimelineWrapper from "../../components/wrappers/TimelineWrapper";
import HeatmapsWrapper from "./HeatmapsWrapper";
import {
  Card,
  Modal,
  Tabs,
  Tab,
  Container,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import TimeRanger from "../../components/TimeRanger";
import DiferenciaHeatmapsWrapper from "./DiferenciaHeatmapsWrapper";
import HorizontalBarsWrapper from "./HorizontalBarsWrapper";

function AccesibilityIJ(props) {
  const [heatmapData, setHeatmapData] = useState(null);
  const [heatmapCompareData1, setHeatmapCompareData1] = useState(null);
  const [heatmapCompareData2, setHeatmapCompareData2] = useState(null);
  const [timelineData, seTimelineData] = useState(null);
  const [additionalTimelineData, setAdditionalTimelineData] = useState(null);
  const [partyMode, setPartyMode] = useState(true);
  const heatmapContainerRef = useRef();
  const heatmapRowRef = useRef();
  const [zonasSeleccionadas, setZonasSeleccionadas] = useState([]);
  const [heatmapWidth, setHeatmapWidth] = useState(0);
  const [barrasDifSort, setBarrasDifSort] = useState(false);
  const [heatmapHeight, setHeatmapHeight] = useState(0);
  const [loadedCharts, setLoadedCharts] = useState(0);
  const [tiempos, setTiempos] = useState([]);
  const [extended, setExtended] = useState(true);
  const [ultimaZonaInteresada, setUltimaZonaInteresada] = useState(null);
  const [parDeZonas, setParDeZonas] = useState(null);
  const [lineColorScale, setLineColorScale] = useState(null);
  const [totalPorZona, setTotalPorZona] = useState(null);
  const [zonasParaDona, setzonasParaDona] = useState(null);
  const [tiemposComparar, setTiemposComparar] = useState([0, 41]);

  const [initModalShow, setInitModalShow] = useState(true);

  const [escala, setEscala] = useState([-230.428, 9900940]);

  const lineRef = useRef();

  const hideInitModal = () => {
    if (initModalShow === true) {
      setInitModalShow(false);
    }
  };

  // useEffect(() => {
  //   console.log("cargando heatmaps");

  //   d3.json(
  //     `http://localhost:8000/files/heatmap?mintime=${tiemposComparar[0]}&maxtime=${tiemposComparar[0]}`
  //   ).then(setHeatmapCompareData1);

  //   d3.json(
  //     `http://localhost:8000/files/heatmap?mintime=${tiemposComparar[1]}&maxtime=${tiemposComparar[1]}`
  //   ).then(setHeatmapCompareData2);
  // }, [tiemposComparar]);

  useEffect(() => {}, [totalPorZona]);

  useEffect(() => {}, [zonasParaDona]);

  // useEffect(() => {
  //   if (zonasSeleccionadas && zonasSeleccionadas.length > 0) {
  //     d3.json(
  //       `http://localhost:8000/files/nuevo-timeline?zonas=${zonasSeleccionadas.join(
  //         "$"
  //       )}`
  //     ).then(setAdditionalTimelineData);
  //     if (totalPorZona) {
  //       setzonasParaDona(
  //         totalPorZona.filter((z) => zonasSeleccionadas.includes(`${z.zone}`))
  //       );
  //     }
  //   } else {
  //     setAdditionalTimelineData([]);
  //   }
  //   return () => {};
  // }, [zonasSeleccionadas]);

  const agregarOQuitarZona = (zona) => {
    setZonasSeleccionadas((zs) => {
      let zss = [...zs];
      if (zss.includes(zona)) {
        zss = zss.filter((z) => z !== zona);
      } else {
        if (zss.length > 3) {
          zss.pop();
        }
        zss.push(zona);
      }
      return zss;
    });
  };

  // useEffect(() => {
  //   d3.json("http://localhost:8000/files/nuevo-timeline").then((data) => {
  //     seTimelineData(data);
  //   });

  //   d3.json("http://localhost:8000/files/totalporzonas?modo=deeqr").then(
  //     (data) => {
  //       setTotalPorZona(data);
  //     }
  //   );
  // }, []);

  useEffect(() => {
    const container = heatmapContainerRef.current;

    setHeatmapHeight(heatmapRowRef.current.offsetHeight);
    setHeatmapWidth(container.offsetWidth);
  }, [extended]);

  // useEffect(() => {
  //   const mintime =
  //     d3.min(tiempos) !== undefined && d3.min(tiempos) !== null
  //       ? d3.min(tiempos)
  //       : 0;
  //   const maxtime =
  //     d3.max(tiempos) !== undefined && d3.max(tiempos) !== null
  //       ? d3.max(tiempos)
  //       : 41;
  //   d3.json(
  //     `http://localhost:8000/files/heatmap?mintime=${mintime}&maxtime=${maxtime}`
  //   ).then(setHeatmapData);
  // }, [tiempos]);

  const chartLoaded = () => {
    setLoadedCharts((d) => d + 1);
  };

  const actualizarTiempos = (t) => {
    setTiempos(t);
  };

  return (
    <div className='AccesibilityIJ'>
      {loadedCharts < 2 && (
        <div className='overlay'>
          <div className='loader is-loading'>
            <div className='spin-loader'></div>
          </div>
        </div>
      )}
      <Container fluid>
        <Row>
          <Col lg={12}>
            <div className='row noTemporal' ref={lineRef}>
              <div className='col-lg-4'>
                {/* <Mapbox
                  lineColorScale={lineColorScale}
                  parDeZonas={parDeZonas}
                  escala={escala}
                  tiempos={tiempos}
                  chartLoaded={chartLoaded}
                  zonasSeleccionadas={zonasSeleccionadas}
                  agregarOQuitarZona={agregarOQuitarZona}
                  cambiarUltimaZonaInteresada={(zz) =>
                    setUltimaZonaInteresada(zz)
                  }
                  zonasBarra={zonasParaDona}
                /> */}
              </div>
              <div className='col-lg-8'>
                <div
                  className={"row dataVis" + (extended ? " expand" : "")}
                  ref={heatmapRowRef}
                >
                  <h3>
                    Accesibilidad entre zonas en el tiempo seleccionado (Tiempo{" "}
                    {tiempos[0]})
                  </h3>
                  <div className='col-12' ref={heatmapContainerRef}>
                    {heatmapHeight && heatmapWidth && (
                      <HeatmapsWrapper
                        setLineColorScale={setLineColorScale}
                        chartLoaded={chartLoaded}
                        style={{
                          width: "100%",
                          height: "100%",
                          overflow: "hidden",
                        }}
                        zonasSeleccionadas={zonasSeleccionadas}
                        heatmapData={props.heatmapData}
                        escala={escala}
                        width={heatmapWidth}
                        height={heatmapHeight}
                        ultimaZonaInteresada={ultimaZonaInteresada}
                        expand={() => setExtended((e) => !e)}
                        extended={extended}
                        setParDeZonas={setParDeZonas}
                      />
                    )}
                  </div>
                </div>
                <div
                  className={
                    "row categoricalTemporal" + (extended ? " hide" : "")
                  }
                >
                  <div className='col-12'>
                    {/* <BarsWrapper chartLoaded={chartLoaded} tiempos={tiempos} /> */}
                  </div>
                </div>
              </div>
            </div>
            <div className='row linearTemporal'>
              <div className='col-lg-3'>
                {/* {zonasParaDona && zonasParaDona.length ? (
                  <DonutsWrapper
                    chartLoaded={chartLoaded}
                    tiempos={tiempos}
                    zonasParaDona={zonasParaDona}
                  />
                ) : (
                  <span>
                    Seleccione zonas en el mapa para compararlas entre sí.
                  </span>
                )} */}
              </div>
              <div className='col-lg-9'>
                {/* {props.selectedGraficas &&
                props.selectedGraficas.includes("Line chart") ? (
                  lineRef &&
                  lineRef.current &&
                  timelineData && (
                    <TimelineWrapper
                      data={timelineData}
                      escala={escala}
                      additionalData={additionalTimelineData}
                      chartLoaded={chartLoaded}
                      setTiempos={actualizarTiempos}
                    />
                  )
                ) : (
                  <></>
                )} */}
              </div>
            </div>
          </Col>
        </Row>
        <hr></hr>
        <Row>
          <Col lg={12}>
            Por favor, seleccione un par de tiempos T1 y T2 para así comparar
            las diferencias que hay entre ambos tiempos respecto a la
            Accesibilidad entre las distintas zonas.
          </Col>
        </Row>
        <Row
          className='justify-content-md-center'
          style={{ marginBottom: "50px" }}
        >
          <Col lg={8}>
            {/* <TimeRanger
              tiempos={tiemposComparar}
              setTiempos={setTiemposComparar}
            ></TimeRanger> */}
          </Col>
          {/* <Col lg={2}>
            <Button onClick={() => setPartyMode((pm) => !pm)} variant='info'>
              {partyMode ? "no random" : "random"}
            </Button>
          </Col> */}
        </Row>
        <Row>
          <Col lg={5}>
            {/* <HeatmapsWrapper
              setLineColorScale={setLineColorScale}
              chartLoaded={chartLoaded}
              style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
              }}
              zonasSeleccionadas={zonasSeleccionadas}
              heatmapCompareData1={heatmapCompareData1}
              heatmapCompareData2={heatmapCompareData2}
              width={600}
              height={600}
              setParDeZonas={setParDeZonas}
              diferencia={true}
              ultimaZonaInteresada={ultimaZonaInteresada}
            /> */}
          </Col>
          <Col lg={3}>
            {/* <Button onClick={() => setBarrasDifSort((df) => !df)}>
              {" "}
              {barrasDifSort ? "Ordenar por idZona" : "Ordenar por diferencia"}
            </Button> */}
            {/* <HorizontalBarsWrapper
              sort={barrasDifSort}
              chartLoaded={chartLoaded}
              tiempos={tiemposComparar}
            /> */}
          </Col>
          <Col lg={4}>
            {/* <Mapbox
              diferencia={true}
              tiempos={tiemposComparar}
              height={"80vh"}
              lineColorScale={lineColorScale}
              parDeZonas={parDeZonas}
              escala={escala}
              chartLoaded={chartLoaded}
              zonasSeleccionadas={zonasSeleccionadas}
              agregarOQuitarZona={agregarOQuitarZona}
              cambiarUltimaZonaInteresada={(zz) => setUltimaZonaInteresada(zz)}
              zonasBarra={zonasParaDona}
            /> */}
          </Col>
        </Row>
      </Container>
      {/* <Modal
        show={initModalShow === true && loadedCharts >= 2}
        onHide={hideInitModal}
      >
        <Modal.Body>
          <p>
            A continuación se muestra la gráfica <b>heatmap</b> que permite
            identificar las zonas con mayor o menor <b>accesibilidad</b>{" "}
            respecto a el resto de zonas, y el par de zonas con mayor o menor
            accesibilidad entre ellas.{" "}
          </p>
          <br />
          <p>
            Al navegar dentro de la visualización, podrá notar que en el mapa a
            la derecha, se resalta el par de zonas sobre las que se encuentra el
            puntero.
          </p>
          <br />
          <p>
            Adicionalmente, si navega sobre el mapa, se resaltará en la gráfica
            la columna y fila referente a la zona sobre la que se encuentre.
            También al hacer click sobre ésta, podrá agregar a las demás
            visualizaciones para comparar la accesibilidad entre zonas.
          </p>
        </Modal.Body>
      </Modal> */}
    </div>
  );
}

export default AccesibilityIJ;
