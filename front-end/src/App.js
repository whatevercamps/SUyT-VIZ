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

var getParams = function (url) {
  var params = {};
  var parser = document.createElement("a");
  parser.href = url;
  var query = parser.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    params[pair[0]] = decodeURIComponent(pair[1]);
  }
  return params;
};

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
    const params = getParams(window.location.href);
    if (params && params.escenario) {
      const query = `http://localhost:5000/files/heatmap?escenario=${
        params.escenario
      }${params.tiempo ? "&tiempo=" + params.tiempo : ""}${
        params.indicador ? "&indicador=" + params.indicador : ""
      }${params.subscripts ? "&subscripts=" + params.subscripts : ""}`;

      d3.json(query).then((data) => {
        console.log("cargo", data);
        setData(data);
        setDataLoaded(true);
      });
    }
  }, []);

  useEffect(() => {
    let sG = [];
    selectedGraficas.length &&
      selectedGraficas.forEach((s) => {
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
      <Router>
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
              heatmapData={data}
              selectedGraficas={selectedGraficas}
              selectedZonas={selectedZonas}
              tiempos={tiempos}
            />
            {/* <Switch>
              <Route path='/slow-tours'>
                <Home
                  dataLoaded={dataLoaded}
                  data={data}
                  selectedGraficas={selectedGraficas}
                  selectedZonas={selectedZonas}
                  tiempos={tiempos}
                />
              </Route>
              {/* <Route path='/accesibility-ij'>
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
      </Router>
    </div>
  );
}

export default App;
