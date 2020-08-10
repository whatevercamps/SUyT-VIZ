import React, { useEffect, useRef, useState, useCallback } from "react";
import { Card, Modal, Tabs, Tab } from "react-bootstrap";
import mapboxgl from "mapbox-gl";
import * as d3 from "d3";
import Home from "./Home";
import configData from "../config/data";

mapboxgl.accessToken =
  "pk.eyJ1Ijoid2hhdGV2ZXJjYW1wcyIsImEiOiJja2E0aHJoOHUwMnJ2M25xeWg0N3B3aHlkIn0.sHJuwFovFXEt74t3nAW73g";

const getRandomColor = () => {
  const colors = [
    "#f8be53",
    "#d44f4a",
    "#97cb70",
    "#da8ff3",
    "#4aa8a4",
    "#5190f2",
    "#ee883b",
  ];

  return colors[Math.random() * 6];
};

export default function Mapbox(props) {
  const mapContainer = useRef();
  const [map, setMap] = useState(null);
  const [geodat, setgeodat] = useState(null);
  const incluyezona = useCallback(
    (zona) => {
      return props.zonasSeleccionadas.includes(zona);
    },
    [props.zonasSeleccionadas]
  );

  useEffect(() => {
    const mapp = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: [-74.1, 4.65],
      zoom: 10,
    });
    setMap(mapp);
  }, []);

  useEffect(() => {
    console.log("tiempos", props.tiempos);

    if (map && props.tiempos && props.tiempos.length) {
      if (props.diferencia === true) {
        d3.json(
          "https://gist.githubusercontent.com/whatevercamps/5fd930f47b3a6f7d30da3fb605f8eb5b/raw/17b637b6f163aa8a0be439c22460cc38c1fe45ba/zonas.json"
        ).then((geojson) => {
          d3.json(
            `http://localhost:8000/files/totalzonasportiempo?modo=deeqr&tiempo=${props.tiempos[1]}`
          ).then((data) => {
            d3.json(
              `http://localhost:8000/files/totalzonasportiempo?modo=deeqr&tiempo=${props.tiempos[0]}`
            ).then((dataDif) => {
              console.log(
                d3.min(data, (d) => d.value),
                d3.max(data, (d) => d.value)
              );

              geojson.features.map((f) => {
                const datIndex = data.findIndex(
                  (d) => d.zone == f.properties.UPlCodigo.replace("UPZ", "")
                );
                if (datIndex && data[datIndex] && dataDif[datIndex]) {
                  f.properties["value"] =
                    data[datIndex].value - dataDif[datIndex].value;
                } else {
                  f.properties["value"] = 0;
                }

                return f;
              });

              const ext = d3.extent(
                geojson.features,
                (d) => d.properties["value"]
              );
              const col = d3
                .scaleDiverging((t) => d3.interpolatePiYG(t))
                .domain([ext[0], 0, ext[1]]);

              console.log("colakmsdjkadkad", col);

              geojson.features.map((f) => {
                f.properties["color"] = col(f.properties["value"]);
                return f;
              });

              console.log(
                "el geojson difrencia terminado",
                geojson.features.map((f) => f.properties)
              );

              setgeodat(geojson);
              if (map.loaded() === false)
                map.on("load", function () {
                  const fulfillmentSource = map.getSource("fulfillment");
                  if (fulfillmentSource) {
                    fulfillmentSource.setData(geojson);
                  } else {
                    map.addSource("fulfillment", {
                      type: "geojson",
                      data: geojson,
                    });
                  }

                  const fulfillmentLayer = map.getLayer("fulfillment-polygon");

                  if (!fulfillmentLayer) {
                    map.addLayer({
                      id: "fulfillment-polygon",
                      type: "fill",
                      source: "fulfillment",
                      paint: {
                        "fill-color": ["get", "color"],
                        "fill-opacity": 0.5,
                      },
                      filter: ["==", "$type", "Polygon"],
                    });
                  }

                  const routeLayer = map.getLayer("route");
                  if (!routeLayer)
                    map.addLayer({
                      id: "route",
                      type: "line",
                      source: "fulfillment",
                      layout: {
                        "line-join": "round",
                        "line-cap": "round",
                      },
                      paint: {
                        "line-color": "#888",
                        "line-width": 1,
                      },
                    });

                  const poiLayer = map.getLayer("poi-labels");
                  if (!poiLayer)
                    map.addLayer({
                      id: "poi-labels",
                      type: "symbol",
                      source: "fulfillment",
                      layout: {
                        "text-field": ["get", "UPlCodigo"],
                        "text-variable-anchor": [
                          "top",
                          "bottom",
                          "left",
                          "right",
                        ],
                        "text-radial-offset": 0.5,
                        "text-justify": "auto",
                        "text-size": 8,
                        "icon-image": ["concat", ["get", "icon"], "-15"],
                      },
                    });

                  map.on("click", "fulfillment-polygon", function (e) {
                    const description = `<span>la zona ${
                      e.features[0].properties.UPlNombre
                    } ha sido ${
                      incluyezona(e.features[0].properties.UPlCodigo)
                        ? "<span style='color: red'>quitada </span>"
                        : "<span style='color: green'>agregada</span>"
                    } del timeline</span>`;

                    props.agregarOQuitarZona(
                      `${e.features[0].properties.UPlCodigo}`.replace("UPZ", "")
                    );

                    new mapboxgl.Popup()
                      .setLngLat([e.lngLat.lng, e.lngLat.lat])
                      .setHTML(description)
                      .addTo(map);
                  });

                  map.on("mousemove", function (e) {
                    var states = map.queryRenderedFeatures(e.point, {
                      layers: ["fulfillment-polygon"],
                    });

                    if (states.length > 0) {
                      props.cambiarUltimaZonaInteresada(
                        states[0].properties.UPlCodigo
                      );
                    }
                  });

                  map.on("mouseenter", "fulfillment-polygon", function (e) {
                    console.log(
                      "Algo arriba mio",
                      e.features[0].properties.UPlCodigo
                    );

                    map.getCanvas().style.cursor = "pointer";
                  });

                  map.on("mouseleave", "fulfillment-polygon", function () {
                    map.getCanvas().style.cursor = "";
                  });
                });
              else {
                const fulfillmentSource = map.getSource("fulfillment");
                if (fulfillmentSource) {
                  fulfillmentSource.setData(geojson);
                } else {
                  map.addSource("fulfillment", {
                    type: "geojson",
                    data: geojson,
                  });
                }

                const fulfillmentLayer = map.getLayer("fulfillment-polygon");

                if (!fulfillmentLayer) {
                  map.addLayer({
                    id: "fulfillment-polygon",
                    type: "fill",
                    source: "fulfillment",
                    paint: {
                      "fill-color": ["get", "color"],
                      "fill-opacity": 0.5,
                    },
                    filter: ["==", "$type", "Polygon"],
                  });
                }

                const routeLayer = map.getLayer("route");
                if (!routeLayer)
                  map.addLayer({
                    id: "route",
                    type: "line",
                    source: "fulfillment",
                    layout: {
                      "line-join": "round",
                      "line-cap": "round",
                    },
                    paint: {
                      "line-color": "#888",
                      "line-width": 1,
                    },
                  });

                const poiLayer = map.getLayer("poi-labels");
                if (!poiLayer)
                  map.addLayer({
                    id: "poi-labels",
                    type: "symbol",
                    source: "fulfillment",
                    layout: {
                      "text-field": ["get", "UPlCodigo"],
                      "text-variable-anchor": [
                        "top",
                        "bottom",
                        "left",
                        "right",
                      ],
                      "text-radial-offset": 0.5,
                      "text-justify": "auto",
                      "text-size": 8,
                      "icon-image": ["concat", ["get", "icon"], "-15"],
                    },
                  });

                map.on("click", "fulfillment-polygon", function (e) {
                  const description = `<span>la zona ${
                    e.features[0].properties.UPlNombre
                  } ha sido ${
                    incluyezona(e.features[0].properties.UPlCodigo)
                      ? "<span style='color: red'>quitada </span>"
                      : "<span style='color: green'>agregada</span>"
                  } del timeline</span>`;

                  props.agregarOQuitarZona(
                    `${e.features[0].properties.UPlCodigo}`.replace("UPZ", "")
                  );

                  new mapboxgl.Popup()
                    .setLngLat([e.lngLat.lng, e.lngLat.lat])
                    .setHTML(description)
                    .addTo(map);
                });

                map.on("mousemove", function (e) {
                  var states = map.queryRenderedFeatures(e.point, {
                    layers: ["fulfillment-polygon"],
                  });

                  if (states.length > 0) {
                    props.cambiarUltimaZonaInteresada(
                      states[0].properties.UPlCodigo
                    );
                  }
                });

                map.on("mouseenter", "fulfillment-polygon", function (e) {
                  map.getCanvas().style.cursor = "pointer";
                });

                map.on("mouseleave", "fulfillment-polygon", function () {
                  map.getCanvas().style.cursor = "";
                });
              }
            });
          });
        });
      } else {
        d3.json(
          "https://gist.githubusercontent.com/whatevercamps/5fd930f47b3a6f7d30da3fb605f8eb5b/raw/17b637b6f163aa8a0be439c22460cc38c1fe45ba/zonas.json"
        ).then((geojson) => {
          d3.json(
            `http://localhost:8000/files/totalzonasportiempo?modo=deeqr&tiempo=${props.tiempos[0]}`
          ).then((data) => {
            console.log(
              d3.min(data, (d) => d.value),
              d3.max(data, (d) => d.value)
            );

            geojson.features.map((f) => {
              const dat = data.find(
                (d) => d.zone == f.properties.UPlCodigo.replace("UPZ", "")
              );
              f.properties["value"] = dat ? dat.value : 0;
              return f;
            });

            var myColor = d3
              .scalePow()
              .exponent(0.8)
              .range(["#f7f7f7", "#08519c"])
              .domain([65, 11190]);

            geojson.features.map((f) => {
              f.properties["color"] = myColor(f.properties["value"]);
              return f;
            });

            console.log(
              "el geojson normal terminado",
              geojson.features.map((f) => f.properties)
            );

            setgeodat(geojson);
            if (map.loaded() === false)
              map.on("load", function () {
                const fulfillmentSource = map.getSource("fulfillment");
                if (fulfillmentSource) {
                  fulfillmentSource.setData(geojson);
                } else {
                  map.addSource("fulfillment", {
                    type: "geojson",
                    data: geojson,
                  });
                }

                const fulfillmentLayer = map.getLayer("fulfillment-polygon");

                if (!fulfillmentLayer) {
                  map.addLayer({
                    id: "fulfillment-polygon",
                    type: "fill",
                    source: "fulfillment",
                    paint: {
                      "fill-color": ["get", "color"],
                      "fill-opacity": 0.5,
                    },
                    filter: ["==", "$type", "Polygon"],
                  });
                }

                const routeLayer = map.getLayer("route");
                if (!routeLayer)
                  map.addLayer({
                    id: "route",
                    type: "line",
                    source: "fulfillment",
                    layout: {
                      "line-join": "round",
                      "line-cap": "round",
                    },
                    paint: {
                      "line-color": "#888",
                      "line-width": 1,
                    },
                  });

                const poiLayer = map.getLayer("poi-labels");
                if (!poiLayer)
                  map.addLayer({
                    id: "poi-labels",
                    type: "symbol",
                    source: "fulfillment",
                    layout: {
                      "text-field": ["get", "UPlCodigo"],
                      "text-variable-anchor": [
                        "top",
                        "bottom",
                        "left",
                        "right",
                      ],
                      "text-radial-offset": 0.5,
                      "text-justify": "auto",
                      "text-size": 8,
                      "icon-image": ["concat", ["get", "icon"], "-15"],
                    },
                  });

                map.on("click", "fulfillment-polygon", function (e) {
                  const description = `<span>la zona ${
                    e.features[0].properties.UPlNombre
                  } ha sido ${
                    incluyezona(e.features[0].properties.UPlCodigo)
                      ? "<span style='color: red'>quitada </span>"
                      : "<span style='color: green'>agregada</span>"
                  } del timeline</span>`;

                  props.agregarOQuitarZona(
                    `${e.features[0].properties.UPlCodigo}`.replace("UPZ", "")
                  );

                  new mapboxgl.Popup()
                    .setLngLat([e.lngLat.lng, e.lngLat.lat])
                    .setHTML(description)
                    .addTo(map);
                });

                map.on("mousemove", function (e) {
                  var states = map.queryRenderedFeatures(e.point, {
                    layers: ["fulfillment-polygon"],
                  });

                  if (states.length > 0) {
                    props.cambiarUltimaZonaInteresada(
                      states[0].properties.UPlCodigo
                    );
                  }
                });

                map.on("mouseenter", "fulfillment-polygon", function (e) {
                  console.log(
                    "Algo arriba mio",
                    e.features[0].properties.UPlCodigo
                  );

                  map.getCanvas().style.cursor = "pointer";
                });

                map.on("mouseleave", "fulfillment-polygon", function () {
                  map.getCanvas().style.cursor = "";
                });
              });
            else {
              const fulfillmentSource = map.getSource("fulfillment");
              if (fulfillmentSource) {
                fulfillmentSource.setData(geojson);
              } else {
                map.addSource("fulfillment", {
                  type: "geojson",
                  data: geojson,
                });
              }

              const fulfillmentLayer = map.getLayer("fulfillment-polygon");

              if (!fulfillmentLayer) {
                map.addLayer({
                  id: "fulfillment-polygon",
                  type: "fill",
                  source: "fulfillment",
                  paint: {
                    "fill-color": ["get", "color"],
                    "fill-opacity": 0.5,
                  },
                  filter: ["==", "$type", "Polygon"],
                });
              }

              const routeLayer = map.getLayer("route");
              if (!routeLayer)
                map.addLayer({
                  id: "route",
                  type: "line",
                  source: "fulfillment",
                  layout: {
                    "line-join": "round",
                    "line-cap": "round",
                  },
                  paint: {
                    "line-color": "#888",
                    "line-width": 1,
                  },
                });

              const poiLayer = map.getLayer("poi-labels");
              if (!poiLayer)
                map.addLayer({
                  id: "poi-labels",
                  type: "symbol",
                  source: "fulfillment",
                  layout: {
                    "text-field": ["get", "UPlCodigo"],
                    "text-variable-anchor": ["top", "bottom", "left", "right"],
                    "text-radial-offset": 0.5,
                    "text-justify": "auto",
                    "text-size": 8,
                    "icon-image": ["concat", ["get", "icon"], "-15"],
                  },
                });

              map.on("click", "fulfillment-polygon", function (e) {
                const description = `<span>la zona ${
                  e.features[0].properties.UPlNombre
                } ha sido ${
                  incluyezona(e.features[0].properties.UPlCodigo)
                    ? "<span style='color: red'>quitada </span>"
                    : "<span style='color: green'>agregada</span>"
                } del timeline</span>`;

                props.agregarOQuitarZona(
                  `${e.features[0].properties.UPlCodigo}`.replace("UPZ", "")
                );

                new mapboxgl.Popup()
                  .setLngLat([e.lngLat.lng, e.lngLat.lat])
                  .setHTML(description)
                  .addTo(map);
              });

              map.on("mousemove", function (e) {
                var states = map.queryRenderedFeatures(e.point, {
                  layers: ["fulfillment-polygon"],
                });

                if (states.length > 0) {
                  props.cambiarUltimaZonaInteresada(
                    states[0].properties.UPlCodigo
                  );
                }
              });

              map.on("mouseenter", "fulfillment-polygon", function (e) {
                map.getCanvas().style.cursor = "pointer";
              });

              map.on("mouseleave", "fulfillment-polygon", function () {
                map.getCanvas().style.cursor = "";
              });
            }
          });
        });
      }
    }
  }, [map, props.tiempos]);

  useEffect(() => {
    if (props.parDeZonas && map && geodat) {
      const z1 = geodat.features.find(
        (f) => props.parDeZonas[0] === f.properties.UPlCodigo
      );

      const z2 = geodat.features.find(
        (f) => props.parDeZonas[1] === f.properties.UPlCodigo
      );

      const source = map.getSource("route2");
      const borSour = map.getSource("borsour");

      // const lineLayer = map.getLayer("route2");
      const borLayer = map.getLayer("bourderSelectedZones");

      // console.log("llego el par de zonas", {
      //   info: {
      //     z1: z1,
      //     z2: z2,
      //     par: props.parDeZonas,
      //     source: map.getSource("route2"),
      //   },
      //   colorScale: props.lineColorScale,
      // });

      if (z1 && z2) {
        var route = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [
                  z1.geometry.coordinates[0][0],
                  z2.geometry.coordinates[0][0],
                ],
              },
            },
          ],
        };

        var borders = {
          type: "FeatureCollection",
          features: [z1, z2],
        };

        if (source) {
          source.setData(route);
        } else {
          map.addSource("route2", {
            type: "geojson",
            data: route,
          });
        }

        if (borSour) {
          borSour.setData(borders);
        } else {
          map.addSource("borsour", {
            type: "geojson",
            data: borders,
          });
        }

        // if (!lineLayer)
        //   map.addLayer({
        //     id: "route2",
        //     source: "route2",
        //     type: "fill",
        //     paint: {
        //       "fill-color": "rgba(50,30,30,0.3)",
        //     },
        //   });

        if (!borLayer)
          map.addLayer({
            id: "bourderSelectedZones",
            type: "fill",
            source: "borsour",
            paint: {
              "fill-color": "rgba(249,236,78,0.3)",
            },
          });
      }
    }
  }, [props.parDeZonas]);

  useEffect(() => {
    const colores = d3[`schemeAccent`];
    if (props.zonasBarra && map && geodat) {
      console.log("pintando zonas seleccionadas en mapa", {
        features: geodat.features[0],
        primeraZona: props.zonasBarra[0],
      });

      props.zonasBarra.forEach((zona, indexZona) => {
        const z = geodat.features.find(
          (f) => `UPZ${zona.zone}` === f.properties.UPlCodigo
        );

        if (z) {
          console.log("encontrada la zona", z);
          var zonaFeatureCollection = {
            type: "FeatureCollection",
            features: [z],
          };

          const sourceZonaI = map.getSource(`sourceZona${indexZona}`);

          if (sourceZonaI) {
            sourceZonaI.setData(zonaFeatureCollection);
          } else {
            map.addSource(`sourceZona${indexZona}`, {
              type: "geojson",
              data: zonaFeatureCollection,
            });
          }

          const layerZonaI = map.getLayer(`layerZona${indexZona}`);

          if (!layerZonaI)
            map.addLayer({
              id: `layerZona${indexZona}`,
              type: "line",
              source: `sourceZona${indexZona}`,
              paint: {
                "line-color": colores[indexZona],
                "line-width": 3,
              },
            });
        }
      });
    }
  }, [props.zonasBarra]);

  return (
    <Card body style={{ height: props.height || "100%" }}>
      <div ref={mapContainer} className='mapboxmapContainer'></div>

      {/* <Modal.Body>
        <Tabs defaultActiveKey='slow' id='uncontrolled-tab-example'>
          <Tab eventKey='slow' title='Slow Tours'>
            <Home
              dataLoaded={props.dataLoaded}
              data={props.data2}
              selectedGraficas={
                configData.indicadores[1] &&
                configData.indicadores[1].graficas &&
                (configData.indicadores[1].graficas || [])
              }
              selectedZonas={props.selectedZonasInner}
              tiempos={[0, 41]}
            />
          </Tab>
          <Tab eventKey='acci' title='Accesibility I'>
            <Home
              dataLoaded={props.dataLoaded}
              data={props.data2}
              selectedGraficas={props.selectedGraficas}
              selectedZonas={props.selectedZonasInner}
              tiempos={[0, 41]}
            />
          </Tab>
        </Tabs>
      </Modal.Body> */}
    </Card>
  );
}
