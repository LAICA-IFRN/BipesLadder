import React from "react";
import Display from "./Display";
import PropTypes from "prop-types";
import { e, evaluate } from "mathjs";
import { parseJSON } from "../utils/helpers";

const PLC = (props) => {
  const startPointPanel = { x: -200, y: -800 };

  const [scope, setScope] = React.useState({});
  const [code, setCode] = React.useState(parseJSON(props.code));

  const [instructionsParameters, setInstructionsParameters] = React.useState(
    code.instructions_parameters
  );

  const [timers, setTimers] = React.useState(
    code.instructions_parameters.timers
  );

  //Physical inputs and outputs
  const [inputs, setInputs] = React.useState(code.inputs);

  const [outputs, setOutputs] = React.useState(code.outputs);

  //Image tables inputs and outputs
  const [inputsTable, setInputsTable] = React.useState(
    props.getInputsValues.data
  );

  const convertOutputs = (outputs) => {
    let outs = [];
    if (outputs.length > 0) {
      for (let index = 0; index < outputs.length; index++) {
        const out = outputs[index];
        outs.push({ address: out, state: false });
      }

      return outs;
    }
  };

  const [outputsTable, setOutputsTable] = React.useState(
    convertOutputs(code.outputs)
  );

  const convertFromOutputsTableToOutputs = (outputsTable) => {
    let data_ = outputsTable;

    let outputs = [];
    data_.map((outs, index) => {
      if (outs.address[0] != "R" || outs.address[0] != "T") {
        outputs.push(outs.state);
      }
    });

    return outputs;
  };

  //All rows of the code
  const rows = code.row;

  const plcBackground = {
    x: startPointPanel.x,
    y: startPointPanel.y,
    width: 450,
    height: 400,
    style: {
      fill: "#E0D8D3",
      stroke: "#444",
      strokeWidth: "2px",
    },
  };

  function isEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  function setTimerResult(address, state) {
    let timers_ = timers;
    let timers_copy = [];
    let last_state = false;
    console.log(timers_);

    for (let index = 0; index < timers_.length; index++) {
      const timer = timers_[index];
      if (timer.address == address) {
        if (timer.state != state) {
          if (state) {
            timer.timeoutId = setTimeout(() => {
              timer.state = state;
              console.log(timer, "ON");
              timers_[index] = timer;
              console.log(timers_);
            }, parseInt(timer.timerDuration) * 1000);
          } else {
            clearTimeout(timer.timeoutId);
            timer.state = state;
          }
        }
      }
      timers_[index] = timer;
    }
    
    
  }

  const translateCode = () => {
    const outs = outputsTable;
    let inps = inputsTable;

    if (!isEmpty(scope)) {
      for (let indexLine = 0; indexLine < rows.length; indexLine++) {
        const expression = rows[indexLine].expression;

        let outputsFromExpression = rows[indexLine].outputs;
        for (let index = 0; index < outputsFromExpression.length; index++) {
          const outputAddress = outputsFromExpression[index];

          outs.map((o, index) => {
            if (o.address == outputAddress) {
              o.state = evaluate(expression, scope);
            }
          });

          if (outputAddress[0] == "T") {
            inps.map((e, index) => {
              if (e.address == outputAddress) {
                let newState = evaluate(expression, scope);
                if (newState != e.state) {
                  console.log(newState, e.state);
                  setTimerResult(e.address, newState);
                }
              }
            });
          }
          if (outputAddress[0] == "R") {
            inps.map((e, index) => {
              if (e.address == outputAddress) {
                e.state = evaluate(expression, scope);
              }
            });
            setInputsTable(inps);
          }
        }
        setOutputsTable(outs);
        setOutputs(convertFromOutputsTableToOutputs(outs));
      }
    }
  };

  const updateInputsTableFromInputs = (inputs) => {
    let inputsTable_ = inputsTable;

    if (!(JSON.stringify(inputs) === JSON.stringify(inputsTable_))) {
      inputs.map((inp, indexInputs) => {
        inputsTable_.map((inpTable, indexInpTables) => {
          if (inp.address[0] != "R" || inp.address[0] != "T") {
            if (
              inp.address == inpTable.address &&
              inp.state != inpTable.state
            ) {
              inpTable.state = inp.state;
            }
          }
        });
      });
      setInputsTable(inputsTable_);
    }
  };

  function convertScope(data) {
    let data_ = data;

    var scope_ = {};

    for (let index = 0; index < data_.length; index++) {
      const d = data_[index];
      scope_[d.address] = d.state;
    }
    setScope(scope_);
  }

  React.useEffect(() => {
    console.log("Inputs Values changed!");
    let inputsValues = props.getInputsValues;
    updateInputsTableFromInputs(inputsValues.data);
    convertScope(inputsTable);
  }, [props.getInputsValues]);

  React.useEffect(() => {
    console.log("Inputs Table changed!", inputsTable);
    convertScope(inputsTable);
  }, [inputsTable]);

  React.useEffect(() => {
    translateCode();
  }, [scope]);

  React.useEffect(() => {
    setOutputs(convertFromOutputsTableToOutputs(outputsTable));
  }, [outputsTable]);

  React.useEffect(() => {
    props.getOutputValues(outputs);
  }, [outputs]);

  React.useEffect(() => {
    console.log("Timers Changed", timers);
    let inputsTable_copy = inputsTable;

    inputsTable_copy.map((input, index) => {
      for (let index = 0; index < timers.length; index++) {
        const timer = timers[index];
        if (timer.address == input.address) {
          input.state = timer.state;
        }
      }
      //inputsTable_.push(input);
    });
    console.log(inputsTable_copy);
    setInputsTable(inputsTable_copy);
  }, [timers]);

  return (
    <g>
      <rect {...plcBackground}></rect>
      <svg x="-200" y="-800">
        <path
          d="M0 75 L450 75 M0 325 L450 325"
          stroke="black"
          strokeWidth="2"
        ></path>
      </svg>
      <g>
        <circle
          cx={String(startPointPanel.x + 40)}
          cy={String(startPointPanel.y + 40)}
          r="10"
        ></circle>
        <circle
          cx={String(startPointPanel.x + 80)}
          cy={String(startPointPanel.y + 40)}
          r="10"
        ></circle>
        <circle
          cx={String(startPointPanel.x + 120)}
          cy={String(startPointPanel.y + 40)}
          r="10"
        ></circle>
        <circle
          cx={String(startPointPanel.x + 160)}
          cy={String(startPointPanel.y + 40)}
          r="10"
        ></circle>
        <circle
          cx={String(startPointPanel.x + 200)}
          cy={String(startPointPanel.y + 40)}
          r="10"
        ></circle>
        <circle
          cx={String(startPointPanel.x + 240)}
          cy={String(startPointPanel.y + 40)}
          r="10"
        ></circle>
        <circle
          cx={String(startPointPanel.x + 280)}
          cy={String(startPointPanel.y + 40)}
          r="10"
        ></circle>
        <circle
          cx={String(startPointPanel.x + 320)}
          cy={String(startPointPanel.y + 40)}
          r="10"
        ></circle>
        <circle
          cx={String(startPointPanel.x + 360)}
          cy={String(startPointPanel.y + 40)}
          r="10"
        ></circle>
        <circle
          cx={String(startPointPanel.x + 400)}
          cy={String(startPointPanel.y + 40)}
          r="10"
        ></circle>
      </g>
      <g>
        <circle
          cx={String(startPointPanel.x + 40)}
          cy={String(startPointPanel.y + 360)}
          r="10"
        ></circle>
        <circle
          cx={String(startPointPanel.x + 80)}
          cy={String(startPointPanel.y + 360)}
          r="10"
        ></circle>
        <circle
          cx={String(startPointPanel.x + 120)}
          cy={String(startPointPanel.y + 360)}
          r="10"
        ></circle>
        <circle
          cx={String(startPointPanel.x + 160)}
          cy={String(startPointPanel.y + 360)}
          r="10"
        ></circle>
        <circle
          cx={String(startPointPanel.x + 200)}
          cy={String(startPointPanel.y + 360)}
          r="10"
        ></circle>
        <circle
          cx={String(startPointPanel.x + 240)}
          cy={String(startPointPanel.y + 360)}
          r="10"
        ></circle>
        <circle
          cx={String(startPointPanel.x + 280)}
          cy={String(startPointPanel.y + 360)}
          r="10"
        ></circle>
        <circle
          cx={String(startPointPanel.x + 320)}
          cy={String(startPointPanel.y + 360)}
          r="10"
        ></circle>
        <circle
          cx={String(startPointPanel.x + 360)}
          cy={String(startPointPanel.y + 360)}
          r="10"
        ></circle>
        <circle
          cx={String(startPointPanel.x + 400)}
          cy={String(startPointPanel.y + 360)}
          r="10"
        ></circle>
      </g>
      <Display
        simulatorState={props.simulatorState}
        getInputsValues={props.getInputsValues}
        getOutputValues={outputs}
      ></Display>
      <g transform="rotate(270,220,-525)">
        <text x="220" y="-525" fontSize="30">
          ISim - CLP
        </text>
      </g>
    </g>
  );
};

PLC.propType = {
  inputs: PropTypes.object.isRequired,
  simulatorState: PropTypes.shape({
    startedBasicSimulator: PropTypes.bool.isRequired,
    startedProjectSimulator: PropTypes.bool.isRequired,
    running: PropTypes.bool.isRequired,
    inputs: PropTypes.object.isRequired,
  }).isRequired,
};

export default PLC;
