/* global d3 */
import * as d3 from "d3";

export default function StackedBarChart(dataJson, target, categories) {
  const StackedBarChart = {};

  var keys = categories || [];

  //;
  var zonas = [...new Set(dataJson.map((d) => d.id * 1))];
  var svg = d3.select(target).append("svg");
  svg.attr("width", 650).attr("height", 400);
  var margin = { top: 35, left: 35, bottom: 0, right: 0 };
  var width = +svg.attr("width") - margin.left - margin.right;
  var height = +svg.attr("height") - margin.top - margin.bottom;

  var x = d3
    .scaleBand()
    .range([margin.left, width - margin.right])
    .padding(0.1);

  var y = d3.scaleLinear().rangeRound([height - margin.bottom, margin.top]);

  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .attr("class", "x-axis");

  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .attr("class", "y-axis");

  var z = d3
    .scaleOrdinal()
    .range(["steelblue", "darkorange", "lightblue"])
    .domain(keys);

  StackedBarChart.update = (data, speed, sort) => {
    var data = data || dataJson;

    data.forEach(function (d) {
      d.total = d3.sum(keys, (k) => +d[k]);
      return d;
    });

    y.domain([0, d3.max(data, (d) => d3.sum(keys, (k) => +d[k]))]).nice();

    svg
      .selectAll(".y-axis")
      .transition()
      .duration(speed)
      .call(d3.axisLeft(y).ticks(null, "s"));

    data.sort(
      sort
        ? (a, b) => b.total - a.total
        : (a, b) => zonas.indexOf(a.State) - zonas.indexOf(b.State)
    );

    x.domain(data.map((d) => d.id * 1));

    svg
      .selectAll(".x-axis")
      .transition()
      .duration(speed)
      .call(d3.axisBottom(x).tickSizeOuter(0));

    var group = svg
      .selectAll("g.layer")
      .data(d3.stack().keys(keys)(data), (d) => d.key);

    group.exit().remove();

    group
      .enter()
      .append("g")
      .classed("layer", true)
      .attr("fill", (d) => z(d.key));

    var bars = svg
      .selectAll("g.layer")
      .selectAll("rect")
      .data(
        (d) => d,
        (e) => e.data.id
      );

    bars.exit().remove();

    bars
      .enter()
      .append("rect")
      .attr("width", x.bandwidth())
      .merge(bars)
      .transition()
      .duration(speed)
      .attr("x", (d) => x(d.data.id))
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(d[0]) - y(d[1]));

    var text = svg.selectAll(".text").data(data, (d) => d.id * 1);

    svg.selectAll("g.layer").selectAll("rect").attr("width", x.bandwidth());

    text.exit().remove();
  };

  return StackedBarChart;
}
