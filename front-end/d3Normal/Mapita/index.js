/* global d3, chroma */

const Mapa = (mapData) => {
  const mp = {};

  const margin = { left: 10, top: 10, bottom: 10, right: 10 };

  const width = 600;
  const height = 900;

  const filteredColors = [
    "#f8be53",
    "#d44f4a",
    "#97cb70",
    "#da8ff3",
    "#4aa8a4",
    "#5190f2",
    "#ee883b",
  ];

  const pathCanvas = d3.geoPath().projection(
    d3
      .geoTransverseMercator()
      .rotate([74 + 30 / 60, -38 - 50 / 60])
      .fitExtent(
        [
          [margin.left, margin.top],
          [width - margin.right, height - margin.bottom],
        ],
        mapData
      )
  );

  const colors = chroma
    .bezier(["white", "#009100", "#ff007b", "black"])
    .scale();

  const canvas = d3
    .select("#mapContainer")
    .append("canvas")
    .attr("width", width)
    .attr("height", height);
  const ctx = canvas.node().getContext("2d");
  pathCanvas.context(ctx);

  mapData.features.forEach((municipio, index) => {
    ctx.beginPath();
    pathCanvas(municipio);
    ctx.strokeStyle = "#000";
    ctx.stroke();
  });
  ctx.beginPath();

  mp.update = () => {
    colors
      .domain([
        0,
        128,
        // d3.min(data, (d) => d["value"]),
        // d3.max(data, (d) => d["value"]),
      ])
      .correctLightness();

    mapData.features.forEach((municipio, index) => {
      ctx.fillStyle = colors(index);
      ctx.beginPath();
      pathCanvas(municipio);
      ctx.fill();
      ctx.strokeStyle = "#000";
      ctx.stroke();
    });
    ctx.beginPath();
  };

  return mp;
};

d3.json(
  "https://gist.githubusercontent.com/whatevercamps/5fd930f47b3a6f7d30da3fb605f8eb5b/raw/17b637b6f163aa8a0be439c22460cc38c1fe45ba/zonas.json"
).then((dat) => {
  const mmp = Mapa(dat);
  setTimeout(() => mmp.update(), 2000);
});
