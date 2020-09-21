import * as d3 from "d3";
const Heatmap = (
  target,
  pw,
  ph,
  setParDeZonas,
  setLineColorScale,
  withAxis,
  escala,
  diferencia
) => {
  const hp = {};
  let init = false;
  var margin = {};

  margin["top"] = 30;
  margin["right"] = 25;
  margin["bottom"] = 80;
  margin["left"] = 60;

  var width = pw - margin.left - margin.right,
    height = ph - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select(target)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // create a tooltip
  var tooltip = d3.select(target).append("div");

  tooltip
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px");

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function (d) {
    tooltip.attr("class", "tooltip showTooltip");
    d3.select(this).style("stroke", "black").style("opacity", 1);
  };

  // var mousemove = function (d) {
  //   if (diferencia)
  //     tooltip.html(
  //       `El valor de accesibilidad <br>de la zona ${d.zj} a la zona ${
  //         d.zi
  //       } es <b>${(d.value || 0).toFixed(0)}</b>`
  //     );
  //   else {
  //     tooltip.html(
  //       `El valor de de la diferencia entre el tiempo Ti y Tj <br>de la zona ${
  //         d.zj
  //       } a la zona ${d.zi} es <b>${(d.value || 0).toFixed(0)}</b>`
  //     );
  //   }
  //   setParDeZonas([
  //     d.zi.replace("a", "UPZ"),
  //     d.zj.replace("a", "UPZ"),
  //     myColor2(d.value),
  //   ]);
  //   tooltip
  //     .style("left", d3.mouse(this)[0] + 70 + "px")
  //     .style("top", d3.mouse(this)[1] + 70 + "px");
  // };
  var mouseleave = function (d) {
    tooltip.attr("class", "tooltip");
    d3.select(this).style("stroke", "none").style("opacity", 0.8);
  };

  // Build color scale
  // var myColor = d3
  //   .scaleDiverging((t) => d3.interpolateRdBu(1 - t))
  //   .domain([escala[0], 212872.533192, escala[1]]);
  var myColor2 = d3

    .scalePow()
    .exponent(0.8)
    .range(["#f7f7f7", "red"])
    .domain(escala);

  var myColor = d3
    .scalePow()
    .exponent(0.8)
    .range(["#f7f7f7", "#08519c"])
    .domain(escala);

  if (diferencia) {
    myColor = d3.scaleDiverging((t) => d3.interpolatePiYG(t));
  }
  // var myColor2 = d3.scalePow().exponent(0.5).range(["#f7f7f7", "red"]);

  // Build X scales and axis:
  var x = d3.scaleBand().range([0, width]);

  var y = d3.scaleBand().range([height, 0]);

  if (withAxis) {
    svg
      .append("g")
      .attr("class", "x-axis")
      .style("font-size", 10)
      .attr("transform", "translate(0," + height + ")");
    svg.append("g").attr("class", "y-axis").style("font-size", 10);
  }

  hp.bordearZona = (zona) => {
    svg
      .selectAll("rect")
      .style("stroke", (d) => {
        return d.zj === zona || d.zi === zona ? "#f9ec4e" : "none";
      })
      .style("stroke-width", (d) => {
        return d.zj === zona || d.zi === zona ? 1 : 0;
      });
  };

  hp.resize = (pww, phh) => {
    width = pww - margin.left - margin.right;
    height = phh - margin.top - margin.bottom;

    d3.select(target)
      .select("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    svg.selectAll(".x-axis").attr("transform", "translate(0," + height + ")");

    x.range([0, width]);
    y.range([height, 0]);
  };

  /* ******** UPDATE ******** */
  /* ******** UPDATE ******** */
  /* ******** UPDATE ******** */
  /* ******** UPDATE ******** */

  //Read the data
  hp.update = (
    loadedChart,
    data,
    minUpz,
    maxUpz,
    zonasSeleccionadas,
    sort,
    compareData1,
    compareData2
  ) => {
    let dataFiltered = [];
    if (diferencia === true && compareData1 && compareData2) {
      dataFiltered = zonasSeleccionadas
        ? compareData2
            .filter(
              (d) =>
                zonasSeleccionadas.includes(d["zi"].split("a")[1]) &&
                zonasSeleccionadas.includes(d["zj"].split("a")[1])
            )
            .map((d, index) => {
              d["value"] = d["value"] - compareData1[index]["value"];
              return d;
            })
        : compareData2.map((d, index) => {
            d["value"] = d["value"] - compareData1[index]["value"];
            return d;
          });
    } else {
      dataFiltered = zonasSeleccionadas
        ? data.filter(
            (d) =>
              zonasSeleccionadas.includes(d["zi"].split("a")[1]) &&
              zonasSeleccionadas.includes(d["zj"].split("a")[1])
          )
        : data;
    }

    var zones = d3
      .map(dataFiltered, function (d) {
        return d.zi;
      })
      .keys();
    if (sort === 1) {
      zones.sort((a, b) => {
        const valA = d3.sum(
          dataFiltered.filter((z) => z["zi"] === a),
          (d) => d["value"]
        );

        const valB = d3.sum(
          dataFiltered.filter((z) => z["zi"] === b),
          (d) => d["value"]
        );

        return d3.descending(valA, valB);
      });
    } else if (sort === 2) {
      zones.sort((a, b) => {
        const valA = d3.sum(
          dataFiltered.filter((z) => z["zj"] === a),
          (d) => d["value"]
        );

        const valB = d3.sum(
          dataFiltered.filter((z) => z["zj"] === b),
          (d) => d["value"]
        );

        return d3.descending(valA, valB);
      });
    }

    x.domain(zones).padding(0.05);
    y.domain(zones).padding(0.05);

    const xAxis = d3.axisBottom(x).ticks(4);
    const yAxis = d3.axisLeft(y).ticks(4);

    svg
      .selectAll(".y-axis")
      .transition()
      .duration(500)
      .call(yAxis)
      .select(".domain")
      .remove();

    svg
      .selectAll(".x-axis")
      .transition()
      .duration(500)
      .call(xAxis)
      .select(".domain")
      .remove();

    if (diferencia === true) {
      const ext = d3.extent(dataFiltered, (d) => d.value);
      myColor.domain([ext[0], 1, ext[1]]);
      console.log("mycolor", myColor);
    }

    setLineColorScale(myColor2);

    svg
      .selectAll("rect")
      .data(dataFiltered, function (d) {
        return d.zi + ":" + d.zj;
      })
      .join(
        (enter) =>
          enter
            .append("rect")
            .attr("x", function (d) {
              return x(d.zi);
            })
            .attr("y", -500)
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", function (d) {
              return myColor(d.value);
            })
            .style("stroke-width", 4)
            .style("stroke", "none")
            .style("opacity", 0.8)
            .call((enter) => enter.transition(1000).attr("y", (d) => y(d.zj))),
        // .on("mouseover", mouseover)
        // .on("mousemove", mousemove)
        // .on("mouseleave", mouseleave),
        (update) =>
          update.call((update) =>
            update
              .transition(1000)
              .attr("x", function (d) {
                return x(d.zi);
              })
              .attr("y", function (d) {
                return y(d.zj);
              })
              .attr("width", x.bandwidth())
              .attr("height", y.bandwidth())
              .style("fill", function (d) {
                return myColor(d.value);
              })
          ),
        (exit) =>
          exit
            .attr("fill", "brown")
            .call((exit) =>
              exit.transition(1000).attr("y", 500).attr("x", -500).remove()
            )
      );

    svg
      .append("text")
      .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.top + 30) + ")"
      )
      .style("text-anchor", "middle")
      .text("Destino");

    // text label for the y axis
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Origen");

    loadedChart();
  };
  return hp;
};
export default Heatmap;

/*

  const htDiferencia = h1data.map((h, index) => {
    if (partyMode === true) {
      const randomTruth = Math.max(
        (h["zi"] % 2) - Math.floor(Math.random() * Math.floor(2)),
        0
      );
      h["value"] = !randomTruth
        ? h["value"] - h2data[index]["value"]
        : h2data[index]["value"] - h["value"];
    } else {
      h["value"] = h["value"] - h2data[index]["value"];
    }
    return h;
});

*/
