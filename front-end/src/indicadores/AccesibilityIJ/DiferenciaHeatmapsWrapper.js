import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  Card,
  Button,
  Tab,
  Tabs,
  ButtonGroup,
  Dropdown,
} from "react-bootstrap";
import HeatmapWrapper from "../../components/wrappers/HeatmapWrapper";
import DiferenciaHeatmapWrapper from "../../components/wrappers/DiferenciaHeatmapWrapper";

const DiferenciaHeatmapsWrapper = (props) => {
  const [showBigMomma, setShowBigMomma] = useState(false);
  const [enteredCount, setEnteredCount] = useState(0);
  const [sortt, setSort] = useState(false);
  const bigMommaRef = useRef();

  useEffect(() => {
    console.log(
      "en el wrapper",
      props.heatmapData && props.heatmapData.length && props.heatmapData[0]
    );
  }, [props.heatmapData]);

  return (
    <div className='HeatmapWrapper'>
      <div className='flotante'>
        <Dropdown>
          <Dropdown.Toggle variant='info' id='dropdown-basic'>
            Ordenar
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item as='button' onClick={() => setSort(1)}>
              Por filas
            </Dropdown.Item>
            <Dropdown.Item as='button' onClick={() => setSort(2)}>
              Por columnas
            </Dropdown.Item>
            <Dropdown.Item as='button' onClick={() => setSort(false)}>
              No ordenar
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <Tabs defaultActiveKey='upzSel'>
        <Tab eventKey='todas' title='Todas'>
          <DiferenciaHeatmapWrapper
            {...props}
            mountOnEnter={true}
            unmountOnExit={true}
            minUpz={null}
            maxUpz={null}
            zonasSeleccionadas={null}
            withAxis={false}
            sortt={sortt}
          />
        </Tab>
        {/* <Tab eventKey='todasex' title='Todas amp.'>
          <Card body>
            <p>
              Haga click para abrir un Heatmap con todas las zonas de forma
              externa
            </p>
            <Button variant='info' onClick={() => setShowBigMomma(true)}>
              Abrir todas las zonas
            </Button>{" "}
          </Card>
        </Tab> */}
        <Tab eventKey='upzSel' title='Sel.'>
          {props.zonasSeleccionadas && props.zonasSeleccionadas.length ? (
            <DiferenciaHeatmapWrapper
              {...props}
              minUpz={null}
              maxUpz={null}
              withAxis={true}
              sortt={sortt}
            />
          ) : (
            <h5>
              Por favor seleccione algunas zonas haciendo click sobre éstas en
              el mapa a su derecha
            </h5>
          )}
          {/* */}
        </Tab>
      </Tabs>
    </div>
  );
};

export default DiferenciaHeatmapsWrapper;
