/* global d3 */

const heatmap = () => {
  const hp = {};

  var margin = { top: 80, right: 25, bottom: 30, left: 40 },
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // create a tooltip
  var tooltip = d3
    .select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px");

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function (d) {
    tooltip.style("opacity", 1);
    d3.select(this).style("stroke", "black").style("opacity", 1);
  };
  var mousemove = function (d) {
    tooltip
      .html("The exact value of<br>this cell is: " + d.value)
      .style("left", d3.mouse(this)[0] + 70 + "px")
      .style("top", d3.mouse(this)[1] + "px");
  };
  var mouseleave = function (d) {
    tooltip.style("opacity", 0);
    d3.select(this).style("stroke", "none").style("opacity", 0.8);
  };

  // Build color scale
  var myColor = d3.scaleLinear().range(["#ddd", "red"]);

  // Build X scales and axis:
  var x = d3.scaleBand().range([0, width]);

  var y = d3.scaleBand().range([height, 0]);

  svg
    .append("g")
    .attr("class", "x-axis")
    .style("font-size", 15)
    .attr("transform", "translate(0," + height + ")");
  svg.append("g").attr("class", "y-axis").style("font-size", 15);

  //Read the data
  hp.update = (data) => {
    // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
    var zones = d3
      .map(data, function (d) {
        return d.zona_i_id;
      })
      .keys();

    x.domain(zones).padding(0.05);
    y.domain(zones).padding(0.05);

    const xAxis = d3.axisBottom(x).tickSize(0);
    const yAxis = d3.axisLeft(y).tickSize(0);

    svg.selectAll(".y-axis").transition().duration(500).call(yAxis);

    svg.selectAll(".x-axis").transition().duration(500).call(xAxis);

    myColor.domain([
      d3.min(data, (d) => d.value),
      d3.max(data, (d) => d.value),
    ]);

    // add the squares
    svg
      .selectAll("rect")
      .data(data, function (d) {
        return d.zona_i_id + ":" + d.zona_j_id;
      })
      .join(
        (enter) =>
          enter
            .append("rect")
            .attr("x", function (d) {
              return x(d.zona_i_id);
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
            .call((enter) =>
              enter.transition(1000).attr("y", (d) => y(d.zona_j_id))
            )
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave),
        (update) =>
          update.call((update) =>
            update
              .transition(1000)
              .attr("x", function (d) {
                return x(d.zona_i_id);
              })
              .attr("y", function (d) {
                return y(d.zona_j_id);
              })
              .attr("width", x.bandwidth())
              .attr("height", y.bandwidth())
          ),
        (exit) =>
          exit
            .attr("fill", "brown")
            .call((exit) =>
              exit.transition(1000).attr("y", 500).attr("x", -500).remove()
            )
      );
  };
  return hp;
};

d3.json(
  "http://localhost:8000/files/get?nombres=accessibility%20ij&attrs=true&zonas-rangos=1-3"
).then((data) => {
  const ht = heatmap();
  ht.update(data);

  setTimeout(() => {
    d3.json(
      "http://localhost:8000/files/get?nombres=accessibility%20ij&attrs=true&zonas-rangos=1-5"
    ).then((data) => {
      ht.update(data);
    });
  }, 3000);
});
