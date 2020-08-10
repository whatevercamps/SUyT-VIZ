import * as d3 from "d3";

const Linechart = (target, pw, ph) => {
  const ch = {};

  let prevcomparar = null;
  ////;
  let container = d3.select(target);

  ////;

  // Define margins
  const margin = { top: 20, right: 80, bottom: 30, left: 100 };
  let width = pw || target.offsetWidth;
  let height = 150;
  // Define scales
  let xScale = d3.scaleLinear().range([0, width]);
  let yScale = d3.scaleLinear().range([height, 0]);
  let color = d3.scaleOrdinal().range(d3.schemeCategory10);

  // Define lines

  // Define svg canvas
  let svg = container
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Place the axes on the linechart
  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")");

  svg
    .append("g")
    .attr("class", "y axis")
    .append("text")
    .attr("class", "label")
    .attr("y", 6)
    .attr("dy", ".71em")
    .attr("dx", ".71em")
    .style("text-anchor", "beginning")
    .text("Product Concentration");

  /*
   ********** update function **********
   *************************************
   */

  const isInTime = (d, inf, sup) => {
    if (!d["time"]) return true;
    return d["time"] >= inf && d["time"] <= sup;
  };

  ch.update = (datap, parametros, tiempos) => {
    const data = [...datap];
    let productCategories = d3
      .map(data, (d) => {
        d["time"] = d["time"] < 100 ? d["time"] + 2020 : d["time"];
        return d[parametros[0].name];
      })
      .keys();

    color.domain(productCategories);

    const subset = data.filter((d) => {
      let bool = true;

      parametros.slice(1, parametros.length).forEach((f) => {
        bool =
          bool &&
          d[f.name] === f.value &&
          isInTime(d, tiempos[0] + 2020, tiempos[1] + 2020);
      });

      return bool;
    });

    // Reformat data to make it more copasetic for d3
    // data = An array of objects
    // concentrations = An array of three objects, each of which contains an array of objects
    let concentrations = productCategories.map(function (category) {
      return {
        category: category,
        datapoints: subset
          .filter((d) => d[parametros[0].name] === category)
          .map(function (d) {
            return { date: d["time"], concentration: +d["value"] };
          }),
      };
    }); // to view the structure

    //// AQUI EMPIEZA EL CAMBIO

    // Set the domain of the axes
    xScale.domain([tiempos[0] + 2020, tiempos[1] + 2020]);

    yScale.domain([0, d3.max(subset, (d) => d.value)]);

    // Define axes
    let xAxis = d3
      .axisBottom()

      .ticks(Math.min(10, tiempos[1] - tiempos[0]))
      .tickFormat(d3.format("d"))
      .scale(xScale);
    let yAxis = d3.axisLeft().scale(yScale);

    svg.selectAll(".y.axis").transition().duration(500).call(yAxis);

    svg.selectAll(".x.axis").transition().duration(500).call(xAxis);

    if (prevcomparar !== parametros[0].name) {
      prevcomparar = parametros[0].name;
    }
    svg.selectAll(".category").remove();
    let joinData = svg.selectAll(".category").data(concentrations);

    joinData.exit().remove();

    const line = d3
      .line()
      .curve(d3.curveMonotoneX)
      .x(function (d) {
        return xScale(d["date"]);
      })
      .y(function (d) {
        return yScale(d["concentration"]);
      });

    joinData
      .enter()
      .append("g")
      .attr("class", "category")
      .append("path")
      .attr("class", "line")
      .attr("d", function (d) {
        return line(d.datapoints);
      })
      .style("stroke", function (d) {
        return color(d.category);
      });

    //
    //// // to view the structure

    ////; // to view the structure

    ////;
    //
    ////
  };

  /*
   ********** FIN update function **********
   *************************************
   */

  return ch;
};

export default Linechart;
