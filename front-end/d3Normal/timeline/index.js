/* global d3 */
const timeline = (data) => {
  var margin = {
      top: 20,
      right: 80,
      bottom: 50,
      left: 50,
    },
    width = window.innerWidth - margin.left - margin.right - 100,
    height = window.innerHeight - margin.top - margin.bottom - 30,
    chartCfgs = {
      x_axis: ["time"],
      y_axis: ["value"],
      groupBy: ["zona"],
    },
    xAxisAttr = chartCfgs.x_axis[0],
    yAxisAttr = chartCfgs.y_axis[0],
    coordsObj = {};

  var svg = d3
    .select("#lineChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var nested = d3
    .nest()
    .key((d) => {
      var grpVal = [],
        val = d[xAxisAttr];
      d[xAxisAttr] = isNaN(val) ? val : +val;
      for (var i = 0; i < chartCfgs.groupBy.length; i++) {
        grpVal.push(d[chartCfgs.groupBy[i]]);
      }
      return grpVal.join("_");
    })
    .sortValues((a, b) => {
      a = a[xAxisAttr];
      b = b[xAxisAttr];
      return a < b ? -1 : b > a ? 1 : 0;
    })
    .entries(data);

  var xValue = (d) => {
    var val = d[xAxisAttr];
    return isNaN(val) ? val : +val;
  };
  var yValue = (d) => {
    var val = d[yAxisAttr];
    return isNaN(val) ? val : +val;
  };
  var xScale = d3
    .scaleLinear()
    .range([0, width])
    .domain(d3.extent(data, xValue))
    .nice();
  var yScale = d3
    .scaleLinear()
    .range([height, 0])
    .domain(d3.extent(data, yValue))
    .nice();

  var colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  var lineGenerator = d3
    .line()
    .x((d) => xScale(xValue(d)))
    .y((d) => yScale(yValue(d)));

  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("fill", "black")
    .attr("font-size", "1.5em")
    .attr("y", 35)
    .attr("x", width / 2)
    .text(xAxisAttr);

  svg
    .append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .attr("fill", "black")
    .attr("font-size", "1.5em")
    .style("text-anchor", "middle")
    .text(yAxisAttr);

  var lineChart = svg
    .selectAll(".linechart")
    .data(nested)
    .enter()
    .append("path")
    .style("stroke", (d) => colorScale(d.key))
    .attr("class", "linechart")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", (d) => lineGenerator(d.values));

  var circles = svg
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .style("cursor", "pointer")
    .style("fill", "firebrick")
    .style("stroke", "steelblue")
    .attr("cx", (d) => xScale(xValue(d)))
    .attr("cy", (d) => yScale(yValue(d)))
    .attr("r", 3);

  var brush = d3
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

    .call(brush.move, [xScale(0), xScale(1)]);

  // removes handle to resize the brush
  d3.selectAll(".brush>.handle").remove();
  // removes crosshair cursor
  d3.selectAll(".brush>.overlay").remove();

  function selectCircles() {
    var me = this,
      coords = d3.event.selection;
    if (!coords) return;
    coordsObj.xDelta = coords[0] - coords[1];
    circles.classed("selected-point", (d) => {
      if (d3.event.type == "end") {
        delete d.originalY;
      }
      return isBrushed(coords, xScale(d[xAxisAttr]));
    });
  }

  function isBrushed(coords, cx) {
    var x0 = coords[0],
      x1 = coords[1];
    // return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
    return x0 <= cx && cx <= x1;
  }
};

d3.json("http://localhost:8000/files/nuevo-timeline").then(timeline);
