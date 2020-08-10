import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import configData from "./config/data";
import * as d3 from "d3";
import "./App.css";

/* layout components */
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";
/* component  */
import Home from "./components/Home";
import AccesibilityIJ from "./indicadores/AccesibilityIJ/AccesibilityIJ";

function App() {
  const [selectedZonas, setSelectedZonas] = useState(
    configData.zonas && ([configData.zonas[0] + 1, 2, 3] || [1])
  );

  const [selectedIndicador, setSelectedIndicador] = useState(
    configData.indicadores && configData.indicadores[1]
  );

  const [selectedEscenarios, setSelectedEscenarios] = useState(
    configData.escenarios && ([configData.escenarios[0].nombre] || [])
  );

  const [selectedGraficas, setSelectedGraficas] = useState(
    configData.indicadores[1] &&
      configData.indicadores[1].graficas &&
      (configData.indicadores[1].graficas || [])
  );

  const [data, setData] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [tiempos, setTiempos] = useState([0, 41]);

  useEffect(() => {
    setDataLoaded(false);
    const query = `http://localhost:8000/files/get?modos=car$tpc&nombres=${
      selectedIndicador.ruta
    }&attrs=true&zonas=${selectedZonas
      .map((z) => `a${z}`)
      .join("$")}&escenarios=${selectedEscenarios
      .map((es) => configData.escenarios.find((e) => e.nombre === es).ruta)
      .join("$")}`;
    d3.json(query).then((data) => {
      setData(data);
      setDataLoaded(true);
    });
  }, [selectedZonas, selectedIndicador, selectedEscenarios]);

  useEffect(() => {
    //;
    let sG = [];
    selectedGraficas.length &&
      selectedGraficas.forEach((s) => {
        //;

        //;
        if (selectedIndicador.graficas.includes(s)) {
          sG.push(s);
        }
      });

    if (sG.length === 0) {
      sG = sG.concat(selectedIndicador.graficas[0]);
    }
    setSelectedGraficas(sG);
  }, [selectedIndicador]);

  useEffect(() => {
    //;
  }, [selectedGraficas]);

  const removeOrAddToSelectedZonas = (zonaId) => {
    let sZ = selectedZonas;
    if (sZ.length !== null && sZ.length !== undefined) {
      if (!sZ.includes(zonaId + 1)) sZ.push(zonaId + 1);
      else if (sZ.length > 1) sZ = sZ.filter((z) => z !== zonaId + 1);
    }
    sZ = [...new Set(sZ)];
    setSelectedZonas(sZ);
  };

  const removeOrAddToSelectedGraficas = (grafica) => {
    let sG = selectedGraficas;
    if (sG.length !== null && sG.length !== undefined) {
      if (!sG.includes(grafica)) sG.push(grafica);
      else if (sG.length > 1) sG = sG.filter((g) => g !== grafica);
    }
    sG = [...new Set(sG)];
    setSelectedGraficas(sG);
  };

  const removeOrAddToSelectedEscenarios = (escenario) => {
    //;
    let sE = selectedEscenarios;
    if (sE.length !== null && sE.length !== undefined) {
      if (!sE.includes(escenario)) sE.push(escenario);
      else if (sE.length > 1) sE = sE.filter((g) => g !== escenario);
    }
    sE = [...new Set(sE)];
    setSelectedEscenarios(sE);
  };

  const changeSelectedIndicador = (indicador) => {
    setSelectedIndicador(indicador || selectedIndicador);
  };

  return (
    <div className='App'>
      {/* <Router> */}
      <Navbar tiempos={tiempos} setTiempos={setTiempos} />
      <div className='wrapper'>
        {/* <Sidebar
            removeOrAddToSelectedZonas={removeOrAddToSelectedZonas}
            selectedZonas={selectedZonas}
            changeSelectedIndicador={changeSelectedIndicador}
            selectedIndicador={selectedIndicador}
            selectedGraficas={selectedGraficas}
            removeOrAddToSelectedGraficas={removeOrAddToSelectedGraficas}
            selectedEscenarios={selectedEscenarios}
            removeOrAddToSelectedEscenarios={removeOrAddToSelectedEscenarios}
          /> */}
        <div id='content' style={{ padding: "10px" }}>
          <AccesibilityIJ
            dataLoaded={dataLoaded}
            data={data}
            selectedGraficas={selectedGraficas}
            selectedZonas={selectedZonas}
            tiempos={tiempos}
          />
          {/* <Switch>
              <Route path='/accesibility-ij'>
                <AccesibilityIJ
                  dataLoaded={dataLoaded}
                  data={data}
                  selectedGraficas={selectedGraficas}
                  selectedZonas={selectedZonas}
                  tiempos={tiempos}
                />
              </Route>
            </Switch> */}
        </div>
      </div>
      {/* </Router> */}
    </div>
  );
}

export default App;
