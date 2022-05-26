import React from "react";
import Button from "./Button";
import Light from "./Light";
import { colorsTable } from "../utils/constants";
import PropTypes from "prop-types";
import {parseJSON} from "../utils/helpers"

const OutputBoard = (props) => {
  const componentPosition = { x: 500, y: -800 };
  const style = {};
  let initialOutputs = Array(10).fill("transparent");
  const [outputs, setOutputs] = React.useState(initialOutputs);
  const [code, setCode] = React.useState(parseJSON(props.code));
  

  let onlyOutputs = [];
  code.outputs.map((output, index) => {
    if(output[0] == "Q") onlyOutputs.push(output);
  });

  const boardBackground = {
    x: componentPosition.x,
    y: componentPosition.y,
    width: 300,
    height: 200*onlyOutputs.length + onlyOutputs.length * 10,
    style: {
      fill: "#E0D8D3",
      stroke: "#444",
      strokeWidth: "2px",
    },
  };

  function convertOutputs(outputs) {
    let outputs_ = outputs;
    let outs = Object.keys(outputs);
    for (let index = 0; index < outs.length; index++) {
      const out = outs[index];
      if (outputs_[out]) {
        initialOutputs[index] = "#000";
      } else {
        initialOutputs[index] = "transparent";
      }
    }
    setOutputs(initialOutputs);
  }

  React.useEffect(() => {
    
    convertOutputs(props.outputs)
  }, [props.outputs]);



  return (
    <g>
      <rect {...boardBackground}></rect>
      {onlyOutputs.map((output, index) => {
        return (
          <g>
            <text x={componentPosition.x + 115} y={-620 + index*200} fontSize="30">
              {output}
            </text>
            <Light
              position={{ x: componentPosition.x + 150, y: -700 + index*200 }}
              color={colorsTable.yellowLight}
              type="PUSH_BUTTON"
              state={props.outputs[index]}
            ></Light>
          </g>
        );
      })}
    </g>
  );
};

OutputBoard.propTypes = {
  simulatorState: PropTypes.shape({
    startedBasicSimulator: PropTypes.bool.isRequired,
    startedProjectSimulator: PropTypes.bool.isRequired,
    running: PropTypes.bool.isRequired,
  }).isRequired,
};

export default OutputBoard;
