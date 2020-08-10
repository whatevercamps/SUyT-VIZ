const getZonasArr = (nZonas) => Array.from(Array(nZonas).keys());

const data = {
  escenarios: [
    { nombre: "Escenario 1", ruta: "escenario1" },
    { nombre: "Escenario 2", ruta: "escenario2" },
  ],
  indicadores: [
    {
      nombre: "slow mode",
      graficas: ["Stacked barchar", "Scatterplot chart", "Mapa"],
      ruta: "slow",
    },
    {
      nombre: "accesibility i",
      graficas: ["Line chart"],
      ruta: "accessibility i",
    },
  ],

  zonas: getZonasArr(127),
};

export default data;
