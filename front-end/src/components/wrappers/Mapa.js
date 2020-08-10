import * as d3 from "d3";
import * as chroma from "chroma-js";

const Mapa = (target, mapData) => {
  const mp = {};

  const margin = { left: 10, top: 10, bottom: 10, right: 10 };

  const width = target.offsetWidth;
  const height = width * 2;

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
    .scale()
    .domain([0, 128])
    .correctLightness();

  const canvas = d3
    .select(target)
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

  mp.update = (data, ind) => {
    //update

    const datMin = d3.min(data, (d) => d[ind]),
      datMax = d3.max(data, (d) => d[ind]);

    const scaleNorm = d3.scaleLinear().domain([datMin, datMax]).range([0, 128]);

    mapData.features.forEach((municipio) => {
      const zona = data.find(
        (d) => `UPZ${d.id.split("a")[0]}` === municipio.properties.UPlCodigo
      );
      pathCanvas(municipio);
      if (zona) {
        const valueNorm = scaleNorm(zona[ind]);
        const color = colors(valueNorm);
        ctx.fillStyle = color;
        ctx.fill();
      }

      ctx.beginPath();

      ctx.strokeStyle = "#000";
      ctx.stroke();
    });
    ctx.beginPath();
  };

  return mp;
};

export default Mapa;
