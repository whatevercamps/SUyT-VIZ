import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import StackedBarchartWrapper from "./wrappers/StackedBarchartWrapper";
import ScatterPlotWrapper from "./wrappers/ScatterPlotWrapper";
import LinechartWrapper from "./wrappers/LinechartWrapper";
import MapWrapper from "./wrappers/MapWrapper";
const Home = (props) => {
  return props.data ? (
    <div className='Home'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-7'>
            <div className='row'>
              <div className='col-12'>
                {props.selectedGraficas &&
                props.selectedGraficas.includes("Line chart") ? (
                  <LinechartWrapper {...props} />
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className='row'>
              <div className='col-12'>
                {props.selectedGraficas &&
                props.selectedGraficas.includes("Stacked barchar") ? (
                  <StackedBarchartWrapper {...props} />
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className='row'>
              <div className='col-12'>
                {props.selectedGraficas &&
                props.selectedGraficas.includes("Scatterplot chart") ? (
                  <ScatterPlotWrapper {...props} />
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          <div className='col-md-5'>
            {props.selectedGraficas &&
            props.selectedGraficas.includes("Mapa") ? (
              <MapWrapper {...props} />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>Loading data</div>
  );
};

Home.propTypes = {
  selectedGraficas: PropTypes.array.isRequired,
};

export default Home;
