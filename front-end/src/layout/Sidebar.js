import React, { useState } from "react";
import PropTypes from "prop-types";
import data from "../config/data";

const Sidebar = (props) => {
  const [showZonas, setShowZonas] = useState(true);
  const [showIndicadores, setShowIndicadores] = useState(true);
  const [showGraficas, setShowGraficas] = useState(true);
  const [showEscenarios, setShowEscenarios] = useState(true);

  const [zonas, setZonas] = useState(data.zonas || []);
  const [indicadores, setIndicadores] = useState(data.indicadores || []);
  const [graficas, setGraficas] = useState(data.graficas || []);
  const [escenarios, setEscenarios] = useState(
    data.escenarios.map((d) => d.nombre) || []
  );

  const isSelected = (item, itemList) =>
    itemList.includes(item) ? "selected" : "notSelected";

  return (
    <nav id='sidebar'>
      {false && (
        <ul className='list-unstyled components'>
          <li onClick={() => setShowEscenarios(!showEscenarios)}>
            <span className='link'>Escenarios</span>
          </li>
          <li>
            <ul className={showEscenarios ? "sublista" : "sublistaOculta"}>
              {escenarios &&
                showEscenarios &&
                escenarios.map((es, key) => (
                  <li
                    key={key}
                    className={isSelected(es, props.selectedEscenarios)}
                    onClick={() => props.removeOrAddToSelectedEscenarios(es)}
                  >
                    {es}
                  </li>
                ))}
            </ul>
          </li>
          <li>
            <hr />
          </li>
          <li onClick={() => setShowIndicadores(!showIndicadores)}>
            <span className='link'>Indicadores</span>
          </li>
          <li>
            <ul className={showEscenarios ? "sublista" : "sublistaOculta"}>
              {indicadores &&
                showIndicadores &&
                indicadores.map((ind, key) => (
                  <li
                    key={key}
                    className={isSelected(ind.nombre, [
                      props.selectedIndicador.nombre,
                    ])}
                    onClick={() => props.changeSelectedIndicador(ind)}
                  >
                    {ind.nombre}
                  </li>
                ))}
            </ul>
          </li>
          <li>
            <hr />
          </li>
          <li onClick={() => setShowGraficas(!showGraficas)}>
            <span className='link'>Graficas</span>
          </li>
          <li>
            <ul className={showGraficas ? "sublista" : "sublistaOculta"}>
              {graficas &&
                showGraficas &&
                props.selectedIndicador.graficas.map((gr, key) => (
                  <li
                    key={key}
                    onClick={() => props.removeOrAddToSelectedGraficas(gr)}
                    className={isSelected(gr, props.selectedGraficas)}
                  >
                    {gr}
                  </li>
                ))}
            </ul>
          </li>
          <li>
            <hr />
          </li>
          <li onClick={() => setShowZonas(!showZonas)}>
            <span className='link'>Zonas</span>
          </li>
          <li>
            <ul className={showEscenarios ? "sublista" : "sublistaOculta"}>
              {zonas &&
                showZonas &&
                zonas.map((zo, key) => (
                  <li
                    key={key}
                    onClick={() => props.removeOrAddToSelectedZonas(zo)}
                    className={isSelected(zo + 1, props.selectedZonas)}
                  >
                    zona {zo + 1}
                  </li>
                ))}
            </ul>
          </li>
        </ul>
      )}
    </nav>
  );
};

Sidebar.propTypes = {
  removeOrAddToSelectedZonas: PropTypes.func.isRequired,
  selectedZonas: PropTypes.array.isRequired,
  changeSelectedIndicador: PropTypes.func.isRequired,
  selectedIndicador: PropTypes.object.isRequired,
  removeOrAddToSelectedGraficas: PropTypes.func.isRequired,
  selectedGraficas: PropTypes.array.isRequired,
  selectedEscenarios: PropTypes.array.isRequired,
  removeOrAddToSelectedEscenarios: PropTypes.func.isRequired,
};

export default Sidebar;
