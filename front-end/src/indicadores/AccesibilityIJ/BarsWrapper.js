import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import * as d3 from "d3";

export default function BarsWrapper(props) {
  const [peaks, setPeaks] = useState([]);
  const [opeaks, setOpeaks] = useState([]);
  const [tiempos, setTiempos] = useState([]);

  const [tpc, setTpc] = useState([]);
  const [tm, setTm] = useState([]);
  const [car, setCar] = useState([]);
  const [tiempos2, setTiempos2] = useState([]);

  useEffect(() => {
    let ruta = "http://localhost:8000/files/peak-opeak?modo=desagregado";
    let ruta2 = "http://localhost:8000/files/tpc-tm-car?modo=desagregado";
    let tiempos = [];
    for (let i = 0; i < 42; i++) {
      tiempos.push(i);
    }

    if (tiempos) {
      ruta += `&tiempos=${tiempos.join("$")}`;
      ruta2 += `&tiempos=${tiempos.join("$")}`;
    }
    d3.json(ruta).then((data) => {
      let p = [];
      let op = [];
      let t = [];
      data.forEach((d) => {
        p.push(d["peak"]);
        op.push(d["opeak"]);
        t.push(d["time"]);
      });

      setPeaks(p);
      setOpeaks(op);
      setTiempos(t);
    });

    d3.json(ruta2).then((data) => {
      let tpcp = [];
      let tmp = [];
      let carp = [];
      let tp = [];
      data.forEach((d) => {
        tpcp.push(d["tpc"]);
        tmp.push(d["tm"]);
        carp.push(d["car"]);
        tp.push(d["time"]);
      });

      setTpc(tpcp);
      setTm(tmp);
      setCar(carp);
      setTiempos2(tp);
    });
  }, []);

  return (
    <div className='BarsWrapper'>
      <div className='row'>
        <div className='col-12'>
          {peaks.length && opeaks.length && tiempos.length && (
            <Bar
              data={{
                labels: tiempos,
                datasets: [
                  {
                    label: "Peak",
                    backgroundColor: "rgba(255,99,132,0.4)",
                    borderColor: "rgba(255,99,132,1)",
                    borderWidth: 1,
                    hoverBackgroundColor: "rgba(255,99,132,0.4)",
                    hoverBorderColor: "rgba(255,99,132,1)",
                    data: peaks,
                  },
                  {
                    label: "Opeak",
                    backgroundColor: "rgba(12,33,132,0.4)",
                    borderColor: "rgba(12,33,132,1)",
                    borderWidth: 1,
                    hoverBackgroundColor: "rgba(255,99,132,0.4)",
                    hoverBorderColor: "rgba(255,99,132,1)",
                    data: opeaks,
                  },
                ],
              }}
              width={100}
              height={100}
              options={{
                maintainAspectRatio: false,
              }}
            />
          )}
        </div>
      </div>
      <div className='row'>
        <div className='col-12'>
          <Bar
            data={{
              labels: tiempos2,
              datasets: [
                {
                  label: "TPC",
                  backgroundColor: "rgba(26,232,145, 0.4)",
                  borderColor: "rgba(26,232,145, 1)",
                  borderWidth: 1,
                  hoverBackgroundColor: "#FFCE56",
                  hoverBorderColor: "#FFCE56",
                  data: tpc,
                },
                {
                  label: "TM",
                  backgroundColor: "rgba(252,221,75, 0.4)",
                  borderColor: "rgba(252,221,75, 1)",
                  borderWidth: 1,
                  hoverBackgroundColor: "rgba(255,99,132,0.4)",
                  hoverBorderColor: "rgba(255,99,132,1)",
                  data: tm,
                },

                {
                  label: "CAR",
                  backgroundColor: "rgba(101,101,101, 0.4)",
                  borderColor: "rgba(101,101,101, 1)",
                  borderWidth: 1,
                  hoverBackgroundColor: "rgba(101,101,101, 0.2)",
                  hoverBorderColor: "rgba(101,101,101, 0.2)",
                  data: car,
                },
              ],
            }}
            width={100}
            height={100}
            options={{
              maintainAspectRatio: false,
            }}
          />
        </div>
      </div>
    </div>
  );
}
