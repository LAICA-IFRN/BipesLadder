import React from "react";
import PropTypes from "prop-types";

const Display = (props) => {
  const [colorDisplay, setColorDisplay] = React.useState("#708090");

  let initialInputs = Array(10).fill("transparent");
  let initialOutputs = Array(10).fill("transparent");

  const startPointPanel = { x: -175, y: -700 };
  const [inputs, setInputs] = React.useState(initialInputs);
  const [outputs, setOutputs] = React.useState(initialOutputs);

  function convertInputs(inputs) {
    let inputs_ = inputs;
    if (typeof inputs == "object") {
      inputs_ = inputs.data;
    }

    for (let index = 0; index < inputs_.length; index++) {
      const input = inputs_[index];
      if (input.state) {
        initialInputs[index] = "#000";
      } else {
        initialInputs[index] = "transparent";
      }
    }

    setInputs(initialInputs);
  }

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
    convertInputs(props.getInputsValues);

    convertOutputs(props.getOutputValues);
  }, [props]);

  const displayBackground = {
    x: startPointPanel.x,
    y: startPointPanel.y,
    width: 315,
    height: 200,
    style: {
      fill: colorDisplay, //#56D856
      stroke: "#000",
      strokeWidth: "2px",
    },
  };

  const textStyle = {
    style: {
      fontFamily: '"Press Start 2P", cursive',
      fontSize: 20,
    },
  };

  return (
    <g>
      {props.simulatorState.running && (
        <g>
          <rect {...displayBackground} style={{ fill: "#56D856" }}></rect>
          <text
            {...textStyle}
            x={startPointPanel.x + 5}
            y={startPointPanel.y + 25}
          >
            Entradas
          </text>
          {inputs.map((input, index) => {
            return (
              <rect
                x={startPointPanel.x + 10 + 30 * index}
                y={startPointPanel.y + 30}
                width="25"
                height="40"
                strokeWidth="1"
                fill={input}
                stroke="#000"
              ></rect>
            );
          })}

          <text
            {...textStyle}
            x={startPointPanel.x + 5}
            y={startPointPanel.y + 190}
          >
            Saídas
          </text>
          {outputs.map((output, index) => {
            return (
              <rect
                x={startPointPanel.x + 10 + 30 * index}
                y={startPointPanel.y + 120}
                width="25"
                height="40"
                strokeWidth="1"
                fill={output}
                stroke="#000"
              ></rect>
            );
          })}
        </g>
      )}
      {!props.simulatorState.running && (
        <g>
          <rect {...displayBackground}></rect>
        </g>
      )}
    </g>
  );
};

Display.propTypes = {
  simulatorState: PropTypes.shape({
    startedBasicSimulator: PropTypes.bool.isRequired,
    startedProjectSimulator: PropTypes.bool.isRequired,
    running: PropTypes.bool.isRequired,
    inputs: PropTypes.object.isRequired,
  }).isRequired,
};

export default Display;
