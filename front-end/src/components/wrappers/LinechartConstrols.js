import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const LinechartControls = (props) => {
  const [opciones, setOpciones] = useState([]);

  useEffect(() => {
    console.log(
      "data en primer useEffect",
      { dataL: props.dataLoaded },
      props.data
    );
    if (props.dataLoaded) {
      let params = [];
      let ops = [];
      for (let attr in props.data[0]) {
        if (attr !== "time" && attr !== "value") {
          const param = {};
          param["name"] = attr;
          param["value"] = props.data[0][attr];
          params.push(param);
        }
      }

      // params.reverse();

      params.forEach((p) => {
        const op = [...new Set(props.data.map((d) => d[p["name"]]))];
        ops.push(op);
      });

      setOpciones(ops);
      props.changeParams(params);
    }
  }, [props.dataLoaded]);

  const handleChangeAnyParam = (index, paramValue) => {
    let params = [...props.parametros];
    if (index === 0) {
      let param = { ...params[index] };
      param["name"] = paramValue;
      param["value"] = params.find((d) => d["name"] === paramValue)["value"];
      const BackupI0 = params[0];
      params[index] = param;
      params.push(BackupI0);
      let params2 = [...new Set(params.map((p) => p.name))].map((p) => {
        return { name: p, value: params.find((pp) => pp.name === p)["value"] };
      });
      params = params2;

      let ops = [];

      params.forEach((p) => {
        const op = [...new Set(props.data.map((d) => d[p["name"]]))];
        ops.push(op);
      });

      setOpciones(ops);
    } else params[index]["value"] = paramValue;

    props.changeParams(params);
  };

  return (
    props.parametros &&
    props.parametros.length > 3 &&
    !props.noconfig && (
      <div className='Controls'>
        <div className='input-group mb-3'>
          <div className='input-group-prepend'>
            <label
              className='input-group-text'
              htmlFor='inputComparacionLinechart'
            >
              comparar por
            </label>
          </div>
          <select
            className='custom-select'
            id='inputComparacionLinechart'
            value={props.compararPor}
            onChange={(evt) => handleChangeAnyParam(0, evt.target.value)}
          >
            <option value='attr 1'>Zona</option>
            <option value='attr 2'>Tipo</option>
            <option value='attr 3'>Modo</option>
            <option value='escenario'>Escenario</option>
          </select>
        </div>
        {opciones.slice(1, opciones.length).map(
          (opcionGroup, index) =>
            opcionGroup.length && (
              <div className='input-group mb-3'>
                <div className='input-group-prepend'>
                  <label
                    className='input-group-text'
                    htmlFor='inputComparacionLinechart'
                  >
                    filtro {index + 1}
                  </label>
                </div>
                <select
                  className='custom-select'
                  id='inputComparacionLinechart'
                  value={props.parametros[index + 1].value}
                  onChange={(evt) =>
                    handleChangeAnyParam(index + 1, evt.target.value)
                  }
                >
                  {opcionGroup.map((opcion, indexOp) => (
                    <option value={opcion} key={"f1-" + indexOp}>
                      {opcion}
                    </option>
                  ))}
                </select>
              </div>
            )
        )}
      </div>
    )
  );
};

LinechartControls.propTypes = {
  changeParams: PropTypes.func.isRequired,
  parametros: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
};

export default LinechartControls;
