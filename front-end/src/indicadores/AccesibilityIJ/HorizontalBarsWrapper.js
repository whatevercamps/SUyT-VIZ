import React, { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { HorizontalBar } from "react-chartjs-2";
import * as d3 from "d3";

export default function HorizontalBarsWrapper(props) {
  const [zonasFinal, setZonasFinal] = useState([]);

  useEffect(() => {
    if (props.tiempos && props.tiempos.length) {
      let ruta1 = `http://localhost:8000/files/totalzonasportiempo?modo=deeqr&tiempo=${props.tiempos[0]}`;
      let ruta2 = `http://localhost:8000/files/totalzonasportiempo?modo=deeqr&tiempo=${props.tiempos[1]}`;
      d3.json(ruta1).then((zonas1data) => {
        d3.json(ruta2).then((zonas2data) => {
          console.log("resultado barras", { z1: zonas1data, z2: zonas2data });

          const zonas = zonas2data.map((z2, index) => {
            z2["valueDiferencia"] = z2.value - zonas1data[index].value;
            return z2;
          });

          const ext = d3.extent(zonas, (d) => d.valueDiferencia);
          const col = d3
            .scaleDiverging((t) => d3.interpolatePiYG(t))
            .domain([ext[0], 0, ext[1]]);
          console.log("col", col);

          zonas.map((z) => {
            z["color"] = col(z.valueDiferencia);
            return z;
          });

          setZonasFinal(zonas);
          console.log("final barras zonas", zonas);
        });
      });
    }
  }, [props.tiempos]);

  return (
    <HorizontalBar
      data={{
        labels: props.sort
          ? [...zonasFinal]
              .sort((a, b) =>
                d3.ascending(a.valueDiferencia, b.valueDiferencia)
              )
              .map((z) => `UPZ ${z.zone}`)
          : zonasFinal.map((z) => `UPZ ${z.zone}`),
        datasets: [
          {
            label: `Diferencia entre tiempos T${props.tiempos[0]} y T${props.tiempos[1]}`,
            data: props.sort
              ? [...zonasFinal]
                  .sort((a, b) =>
                    d3.ascending(a.valueDiferencia, b.valueDiferencia)
                  )
                  .map((z) => z.valueDiferencia)
              : [...zonasFinal].map((z) => z.valueDiferencia),
            backgroundColor: () => {
              const colors_array = props.sort
                ? [...zonasFinal]
                    .sort((a, b) =>
                      d3.ascending(a.valueDiferencia, b.valueDiferencia)
                    )
                    .map((z) => z.color)
                : [...zonasFinal].map((z) => z.color);
              return colors_array;
            },
            hoverBackgroundColor: "#ccc",
          },
        ],
      }}
      width={100}
      height={200}
    />
  );
}
