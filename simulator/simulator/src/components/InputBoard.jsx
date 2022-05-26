import React, { useEffect, useReducer, useState } from "react";
import Button from "./Button";
import Light from "./Light";
import { colorsTable } from "../utils/constants";
import PropTypes, { func } from "prop-types";
import { prodDependencies } from "mathjs";
import { parseJSON } from "../utils/helpers";
import isMuiElement from "@mui/utils/isMuiElement";

let inp = [];
let addNewInput = true;

function reducer(state, action) {
  switch (action.type) {
    case "CHANGE_STATE":
      return { data: action.data };
    default:
      throw new Error();
  }
}

function convertInputsToStartInputs(inputs){
  if (inputs.length > 0) {
    let inps = [];
    for (let index = 0; index < inputs.length; index++) {
      const inp = inputs[index];
      inps.push({ address: inp, state: false });
    }
    

    return inps;
  }
}

function ifExist(address, object){
  return object.some(function(el) {
    return el.address = address;
  });
}

const InputBoard = (props) => {
  const [code, setCode] = useState(parseJSON(props.code));
  const initialState = { data: convertInputsToStartInputs(parseJSON(props.code).inputs) };
  const [state, dispatch] = useReducer(reducer, initialState);
  

  

  let onlyInputs = [];
  code.inputs.map((input, index) => {
    if(input[0] == "I") onlyInputs.push(input);
  });


  const inputFromButton = (input) => {
    addNewInput = true;

    if (input.address != undefined) {
      
      if (inp.length < 1) {
      
        inp.push(input);
        return;
      }
      inp.map((i, index) => {
      
        if (i.address == input.address) {
          i.state = input.state;
          addNewInput = false;
          return;
        }
      });

      if (addNewInput) {
      
        inp.push(input);
      }
    }

    dispatch({ type: "CHANGE_STATE", data: inp });
  };

  const addInternalRely = () => {
    for (let index = 0; index < code.inputs.length; index++) {
      const i = code.inputs[index];
      if(i[0] == "R"){
        for (let index = 0; index < inp.length; index++) {
          const element = inp[index];{
            if (element.address == i) return;
          }
          
        }
        inp.push({address:i, state: false});
      }
      
    }
  }

  useEffect(() => {
    
    addInternalRely();
    
    props.changeInputs(state);
  }, [state]);

  const boardBackground = {
    x: -750,
    y: -800,
    width: 300,
    height: 200 * onlyInputs.length + onlyInputs.length * 10,
    style: {
      fill: "#E0D8D3",
      stroke: "#444",
      strokeWidth: "2px",
    },
  };


  return (
    <g>
      <rect {...boardBackground}></rect>

      {onlyInputs.map((input, index) => {
        return (
          <Button
            position={{ x: -650, y: -700 + index * 200, index: index }}
            color={colorsTable.green}
            type="PUSH_BUTTON"
            address={input}
            inputFromButton={inputFromButton}
            simulatorState={props.simulatorState}
          ></Button>
        );
      })}
    </g>
  );
};

export default InputBoard;
