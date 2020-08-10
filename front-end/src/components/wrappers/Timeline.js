import * as d3 from "d3";
const Timeline = (target, cambiarTiempos) => {
  const tm = {};

  let margin = {
      top: 5,
      right: 10,
      bottom: 50,
      left: 100,
    },
    width =
      (target.offsetWidth || window.innerWidth) -
      margin.left -
      margin.right -
      30,
    height =
      (target.offsetHeight || window.innerHeight) -
      margin.top -
      margin.bottom -
      30,
    coordsObj = {};

  let svg = d3
    .select(target)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  let xValue = (d) => {
    let val = d["time"];
    return isNaN(val) ? val : +val;
  };
  let yValue = (d) => {
    let val = d["value"];
    return isNaN(val) ? val : +val;
  };

  let xScale = d3.scaleLinear().range([0, width]);

  let yScale = d3.scaleLinear().range([height, 0]);

  const colores = d3[`schemeAccent`];

  let lineGenerator = d3
    .line()
    .x((d) => xScale(xValue(d)))
    .y((d) => yScale(yValue(d)));

  function isBrushed(coords, cx) {
    let x0 = coords[0],
      x1 = coords[1];
    // return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
    return x0 <= cx && cx <= x1;
  }

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .attr("font-size", "1.5em");

  svg.append("g").attr("class", "y-axis").attr("font-size", "1.5em");

  svg
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 30) + ")"
    )
    .style("text-anchor", "middle")
    .text("Año");

  // text label for the y axis
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Accesibilidad");

  /* ******** UPDATE ******** */
  /* ******** UPDATE ******** */
  /* ******** UPDATE ******** */
  /* ******** UPDATE ******** */

  tm.update = (data) => {
    let nested = d3
      .nest()
      .key((d) => {
        let grpVal = [],
          val = d["time"];
        d["time"] = isNaN(val) ? val : +val;
        grpVal.push(d["zona"]);

        return grpVal.join("_");
      })
      .sortValues((a, b) => {
        a = a["time"];
        b = b["time"];
        return a < b ? -1 : b > a ? 1 : 0;
      })
      .entries(data);

    xScale.domain(d3.extent(data, xValue)).nice();

    yScale.domain(d3.extent(data, yValue)).nice();

    let xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale);
    svg
      .selectAll(".x-axis")
      .transition()
      .duration(500)

      .call(xAxis);

    svg.selectAll(".y-axis").transition().duration(500).call(yAxis);

    svg
      .selectAll(".linechart")
      .data(nested)
      .join(
        (enter) => {
          return enter
            .append("path")
            .style("stroke", (d) => {
              if (d.key === "todas") return "#222";
              const ind = d.key.replace("a", "") / 1;
              const index = nested.findIndex((n) => n.key === d.key);

              return colores[index - 1];
            })
            .attr("class", "linechart")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", (d) => lineGenerator(d.values));
        },
        (update) => {
          return update.call((up) =>
            up.transition(1000).attr("d", (d) => lineGenerator(d.values))
          );
        },
        (exit) => {
          return exit.call((ex) => {
            return ex.transition(1000).attr("y", 500).remove();
          });
        }
      );

    let circles = svg
      .selectAll("circle")
      .data(data, (d) => {
        const id = `${d.time}:${d.zona}`;
        return id;
      })
      .join(
        (enter) => {
          return enter
            .append("circle")
            .style("cursor", "pointer")
            .style("fill", (d) => {
              if (d.zona === "todas") {
                return "#222";
              }
              const ind = d.zona.replace("a", "") / 1;
              const index = nested.findIndex((n) => n.key === d.zona);
              return colores[index - 1];
            })
            .style("stroke", (d) => {
              // ;
              const index = nested.findIndex((n) => n.key === d.zona);
              return colores[index - 1];
            })
            .attr("cx", (d) => xScale(xValue(d)))
            .attr("cy", (d) => yScale(yValue(d)))
            .attr("r", 4);
        },
        (update) => {
          return update.call((update) =>
            update
              .transition(1000)
              .attr("cx", (d) => xScale(xValue(d)))
              .attr("cy", (d) => yScale(yValue(d)))
          );
        },
        (exit) => {
          return exit.call((ex) => {
            return ex.transition(1000).attr("cy", 500).remove();
          });
        }
      );

    function selectCircles() {
      let coords = d3.event.selection;
      if (!coords) return;

      let times = [];

      coordsObj.xDelta = coords[0] - coords[1];
      circles.classed("selected-point", (d) => {
        const isB = isBrushed(coords, xScale(d["time"]));
        if (d3.event.type === "end") {
          delete d.originalY;
          if (isB) {
            times.push(d["time"]);
          }
        }
        return isB;
      });
      if (d3.event.type === "end") {
        cambiarTiempos(times);
      }
    }

    const brus = svg.select(".brush");

    if (!brus.node()) {
      let brush = d3
        .brushX()
        .extent([
          [0, 0],
          [width, height],
        ])
        .on("start end", selectCircles);

      svg
        .append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush)

        .call(brush.move, [xScale(0.5), xScale(1.5)]);

      // removes handle to resize the brush
      d3.selectAll(".brush>.handle").remove();
      // removes crosshair cursor
      d3.selectAll(".brush>.overlay").remove();
    }
  };

  return tm;
};
export default Timeline;
