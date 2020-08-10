/* global d3 */

const ScatterPlot = (target, indx, indy) => {
  const sp = {};

  //width and height
  var w = 600;
  var h = 400;
  var padding = 40;

  //var dataset = data.slice(0, numBars + 1);
  //max vs min
  var dataset = [];

  //scale function
  var xScale = d3.scaleLinear().range([padding, w - padding * 2]);

  var yScale = d3.scaleLinear().range([h - padding, padding]);

  var svg = d3.select("body").append("svg").attr("width", w).attr("height", h);

  //x axis
  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + (h - padding) + ")");

  //y axis
  svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", "translate(" + padding + ", 0)");

  sp.update = (data, indx, indy) => {
    dataset = data || dataset;

    xScale.domain([
      0,
      d3.max(dataset, function (d) {
        return d[indx];
      }),
    ]);

    yScale.domain([
      0,
      d3.max(dataset, function (d) {
        return d[indy];
      }),
    ]);

    const xAxis = d3
      .axisBottom()
      .scale(xScale)
      .ticks(dataset.length + 5);

    const yAxis = d3
      .axisLeft()
      .scale(yScale)
      .ticks(dataset.length + 5);

    svg.selectAll(".y-axis").transition().duration(500).call(yAxis);

    svg.selectAll(".x-axis").transition().duration(500).call(xAxis);

    let group = svg.selectAll("circle").data(dataset);

    group.exit().remove();

    group
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return xScale(d[indx]);
      })
      .attr("cy", function (d) {
        return h - yScale(d[indy]);
      })
      .attr("r", 5)
      .attr("fill", "green");
  };

  return sp;
};

let dt = [];
dt.push([46, 32]);
dt.push([47, 31]);
dt.push([51, 41]);
dt.push([52, 38]);
dt.push([38, 29]);

const bb = ScatterPlot();

bb.update(dt, 1, 0);
