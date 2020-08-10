/* global d3 */

const linechart = () => {
  const ch = {};

  let catId = "attr 2";
  let filters = [
    { id: "attr 3", value: "peak" },
    { id: "attr 1", value: "a1" },
  ];
  // Define margins
  let margin = { top: 20, right: 80, bottom: 30, left: 100 },
    width =
      parseInt(d3.select("#linechart").style("width")) -
      margin.left -
      margin.right,
    height =
      parseInt(d3.select("#linechart").style("height")) -
      margin.top -
      margin.bottom;

  // Define scales
  let xScale = d3.scaleLinear().range([0, width]);
  let yScale = d3.scaleLinear().range([height, 0]);
  let color = d3.scaleOrdinal().range(d3.schemeCategory10);

  // Define lines
  let line = d3
    .line()
    .curve(d3.curveMonotoneX)
    .x(function (d) {
      return xScale(d["date"]);
    })
    .y(function (d) {
      return yScale(d["concentration"]);
    });

  // Define svg canvas
  let svg = d3
    .select("#linechart")
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

  const retFilter = (d, f) => d[f.id] === f.value;

  /*
   ********** update function **********
   *************************************
   */
  ch.update = (data) => {
    //;
    let productCategories = d3.map(data, (d) => d[catId]).keys();

    color.domain(productCategories);

    let subset = data.filter((d) => {
      let bool = true;

      filters.forEach((f) => {
        bool = bool && retFilter(d, f);
      });

      return bool;
    });
    //
    //

    // Reformat data to make it more copasetic for d3
    // data = An array of objects
    // concentrations = An array of three objects, each of which contains an array of objects
    let concentrations = productCategories.map(function (category) {
      return {
        category: category,
        datapoints: subset
          .filter((d) => d[catId] === category)
          .map(function (d) {
            return { date: d["time"], concentration: +d["value"] };
          }),
      };
    });

    //; // to view the structure

    //// AQUI EMPIEZA EL CAMBIO

    // Set the domain of the axes
    xScale.domain(
      d3.extent(subset, function (d) {
        return d["time"];
      })
    );

    yScale.domain([
      d3.min(subset, (d) => d.value),
      d3.max(subset, (d) => d.value),
    ]);

    // Define axes
    let xAxis = d3.axisBottom().scale(xScale);
    let yAxis = d3.axisLeft().scale(yScale);

    svg.selectAll(".y.axis").transition().duration(500).call(yAxis);

    svg.selectAll(".x.axis").transition().duration(500).call(xAxis);

    let joinData = svg.selectAll(".category").data(concentrations);

    joinData.exit().remove();

    let products = joinData.enter().append("g").attr("class", "category");

    products
      .append("path")
      .attr("class", "line")
      .attr("d", function (d) {
        return line(d.datapoints);
      })
      .style("stroke", function (d) {
        return color(d.category);
      });

    //
    // // to view the structure

    //; // to view the structure

    //;
    //
    //
  };

  /*
   ********** FIN update function **********
   *************************************
   */

  // Define responsive behavior
  function resize() {
    let width =
        parseInt(d3.select("#linechart").style("width")) -
        margin.left -
        margin.right,
      height =
        parseInt(d3.select("#linechart").style("height")) -
        margin.top -
        margin.bottom;

    // Update the range of the scale with new width/height
    xScale.range([0, width]);
    yScale.range([height, 0]);

    // Define axes
    let xAxis = d3.axisBottom().scale(xScale);
    let yAxis = d3.axisLeft().scale(yScale);

    // Update the axis and text with the new scale
    svg
      .select(".x.axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.select(".y.axis").call(yAxis);

    // Force D3 to recalculate and update the line
    svg.selectAll(".line").attr("d", function (d) {
      return line(d.datapoints);
    });

    // Update the tick marks
    xAxis.ticks(Math.max(width / 75, 2));
    yAxis.ticks(Math.max(height / 50, 2));
  }

  // Call the resize function whenever a resize event occurs
  d3.select(window).on("resize", resize);

  // Call the resize function
  resize();

  return ch;
};

const cc = linechart();
d3.json(
  "http://localhost:8000/files/get?nombres=accessibility%20i&modos=tpc,tm&attrs=true"
).then((dd) => cc.update(dd));
