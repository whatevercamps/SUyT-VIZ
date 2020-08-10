import React, { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { HorizontalBar } from "react-chartjs-2";
import * as d3 from "d3";

export default function DonutsWrapper(props) {
  const [tpc, setTpc] = useState(0);
  const [tm, setTm] = useState(0);
  const [car, setCar] = useState(0);

  const [colores, setColores] = useState(d3[`schemeAccent`]);

  useEffect(() => {
    let ruta2 = "http://localhost:8000/files/tpc-tm-car";

    if (props.tiempos && props.tiempos.length) {
      ruta2 += `?tiempos=${props.tiempos.join("$")}`;
    }

    d3.json(ruta2).then((data) => {
      setTpc(data["tpc"]);
      setTm(data["tm"]);
      setCar(data["car"]);
    });
  }, [props.tiempos]);

  useEffect(() => {
    console.log("colores", {
      colores: colores,
      zonas: props.zonasParaDona,
    });
  }, [props.zonasParaDona]);

  return (
    <HorizontalBar
      data={{
        labels: props.zonasParaDona.map((z) => `UPZ ${z.zone}`),
        datasets: [
          {
            label: "zonas seleccionadas",
            data: props.zonasParaDona.map((z) => z.value),
            backgroundColor: props.zonasParaDona.map(
              (z, index) => colores[index]
            ),
            hoverBackgroundColor: "#ddd",
          },
        ],
      }}
      width={200}
      height={100}
    />
    // <Tabs defaultActiveKey='peak'>
    //   <Tab eventKey='peak' title='Peak' unmountOnExit={true}>
    //     <Doughnut
    //       data={{
    //         labels: ["TPC", "TM", "CAR"],
    //         datasets: [
    //           {
    //             data: [tpc, tm, car],
    //             backgroundColor: [
    //               "rgba(26,232,145, 0.7)",
    //               "rgba(252,221,75, 0.7)",
    //               "rgba(101,101,101, 0.7)",
    //             ],
    //             hoverBackgroundColor: [
    //               "rgba(26,232,145, 1)",
    //               "rgba(252,221,75, 1)",
    //               "rgba(101,101,101, 1)",
    //             ],
    //           },
    //         ],
    //       }}
    //       width={70}
    //       height={70}
    //     />
    //   </Tab>
    //   <Tab eventKey='opeak' title='Opeak' unmountOnExit={true}>
    //     <Doughnut
    //       data={{
    //         labels: ["TPC", "TM", "CAR"],
    //         datasets: [
    //           {
    //             data: [tpc / 3, tm / 2, car],
    //             backgroundColor: [
    //               "rgba(26,232,145, 0.7)",
    //               "rgba(252,221,75, 0.7)",
    //               "rgba(101,101,101, 0.7)",
    //             ],
    //             hoverBackgroundColor: [
    //               "rgba(26,232,145, 1)",
    //               "rgba(252,221,75, 1)",
    //               "rgba(101,101,101, 1)",
    //             ],
    //           },
    //         ],
    //       }}
    //       width={70}
    //       height={70}
    //     />
    //   </Tab>
    // </Tabs>
  );
}
