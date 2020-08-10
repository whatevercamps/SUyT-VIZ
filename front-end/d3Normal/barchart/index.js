/* global d3 */
const BarChart = (csv) => {
  const BarChart = {};

  var keys = csv.columns.slice(2);

  var year = [...new Set(csv.map((d) => d.Year))];
  var states = [...new Set(csv.map((d) => d.State))];

  d3.select("#year")
    .selectAll("option")
    .data(year)
    .enter()
    .append("option")
    .text((d) => d);

  var svg = d3.select("#chart"),
    margin = { top: 35, left: 35, bottom: 0, right: 0 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

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

  BarChart.update = (input, speed) => {
    var data = csv.filter((f) => f.Year == input);

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
      d3.select("#sort").property("checked")
        ? (a, b) => b.total - a.total
        : (a, b) => states.indexOf(a.State) - states.indexOf(b.State)
    );

    x.domain(data.map((d) => d.State));

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
        (e) => e.data.State
      );

    bars.exit().remove();

    bars
      .enter()
      .append("rect")
      .attr("width", x.bandwidth())
      .merge(bars)
      .transition()
      .duration(speed)
      .attr("x", (d) => x(d.data.State))
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(d[0]) - y(d[1]));

    var text = svg.selectAll(".text").data(data, (d) => d.State);

    text.exit().remove();

    text
      .enter()
      .append("text")
      .attr("class", "text")
      .attr("text-anchor", "middle")
      .merge(text)
      .transition()
      .duration(speed)
      .attr("x", (d) => x(d.State) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.total) - 5)
      .text((d) => d.total);
  };

  var select = d3.select("#year").on("change", function () {
    BarChart.update(this.value, 750);
  });

  d3.select("#sort").on("click", function () {
    BarChart.update(select.property("value"), 750);
  });

  return BarChart;
};

d3.csv("data.csv").then((d) => {
  const bh = BarChart(d);
  bh.update(d3.select("#year").property("value"), 0);
});
