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
const HeatmapsWrapper = (props) => {
  const [showBigMomma, setShowBigMomma] = useState(false);
  const [enteredCount, setEnteredCount] = useState(0);
  const [sortt, setSort] = useState(false);
  const bigMommaRef = useRef();

  useEffect(() => {
    console.log("en el wrapperS");
  }, [props.heatmapData]);

  useEffect(() => {
    console.log("en el wrapperS");
  }, [props.heatmapCompareData1]);

  useEffect(() => {
    console.log("en el wrapperS");
  }, [props.heatmapCompareData2]);

  return (
    <div className='HeatmapWrapper'>
      <div className='flotante'>
        <ButtonGroup size='sm' variant='info'>
          <Dropdown>
            <Dropdown.Toggle variant='info' id='dropdown-basic'>
              Ordenar
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item as='button' onClick={() => setSort(2)}>
                Ordenar por origen
              </Dropdown.Item>
              <Dropdown.Item as='button' onClick={() => setSort(1)}>
                Ordenar por destino
              </Dropdown.Item>
              <Dropdown.Item as='button' onClick={() => setSort(false)}>
                No ordenar
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {!props.diferencia && (
            <Button onClick={() => props.expand()} variant='info'>
              {props.extended ? "Collapsar" : "Expandir"}
            </Button>
          )}
        </ButtonGroup>
      </div>
      <Tabs defaultActiveKey='upzSel'>
        <Tab eventKey='todas' title='Todas'>
          <HeatmapWrapper
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
        <Tab eventKey='upzSel' title='Zonas seleccionadas'>
          {props.zonasSeleccionadas && props.zonasSeleccionadas.length ? (
            <HeatmapWrapper
              {...props}
              minUpz={null}
              maxUpz={null}
              withAxis={true}
              sortt={sortt}
            />
          ) : (
            <div className='h-100'>
              <h5>
                Por favor seleccione algunas zonas haciendo click sobre éstas en
                el mapa a su derecha
              </h5>
            </div>
          )}
          {/* */}
        </Tab>
      </Tabs>
      {/* 
      <Modal
        show={showBigMomma}
        onHide={() => setShowBigMomma(false)}
        dialogClassName='modal-90w'
        aria-labelledby='example-custom-modal-styling-title'
        onEntered={() => setEnteredCount((d) => d + 1)}
      >
        <Modal.Header closeButton>
          <Modal.Title id='example-custom-modal-styling-title'>
            Comparando Todas las zonas
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ width: "100%", height: "100%" }} ref={bigMommaRef}>
            {bigMommaRef && bigMommaRef.current && (
              <HeatmapWrapper
                {...props}
                width={Math.min(
                  bigMommaRef.current.offsetHeight,
                  bigMommaRef.current.offsetWidth
                )}
                height={Math.min(
                  bigMommaRef.current.offsetHeight,
                  bigMommaRef.current.offsetWidth
                )}
                enteredCount={enteredCount}
                zonasSeleccionadas={null}
                withAxis={false}
                sortt={sortt}
              />
            )}
          </div>
        </Modal.Body>
      </Modal> */}
    </div>
  );
};

export default HeatmapsWrapper;
