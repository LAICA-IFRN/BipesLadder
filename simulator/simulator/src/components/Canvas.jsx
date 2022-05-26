import React, { useCallback, useState, useReducer } from "react";
import { simulatorWidth } from "../utils/constants";
import ItemMenu from "./ItemMenu";
import Light from "./Light";
import Menu from "./Menu";
import Title from "./Title";
import InputBoard from "./InputBoard";
import PropTypes from "prop-types";
import PLC from "./PLC";
import OutputBoard from "./OutputBoard";
import logoLaica from "../images/logoLaica.png";
import ControllerBar from "./ControllerBar";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import Divider from "@material-ui/core/Divider";
import { Button, Modal, Box, Typography } from "@material-ui/core";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@material-ui/styles";
import { parseJSON } from "../utils/helpers";
import requirePropFactory from "@mui/utils/requirePropFactory";

const style_modal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "grid",
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "blue",
  },
}));

var inputsArray = [];
function reducer(input, action) {
  switch (action.type) {
    case "CHANGE_STATE":
      return action.data;
    default:
      throw new Error();
  }
}

function convertInputsToStartInputs(inputs) {
  if (inputs.length > 0) {
    let inps = [];
    for (let index = 0; index < inputs.length; index++) {
      const inp = inputs[index];
      inps.push({ address: inp, state: false });
    }

    return inps;
  }
}

const Canvas = (props) => {
  const simulatorHeight = 1200;
  const [inputs, setInputs] = useState([]);
  const [outputs, setOutputs] = useState({});

  const initialState = { data: { address: "I0", state: false } };
  //const initialState = { data: convertInputsToStartInputs(parseJSON(props.code).inputs) };
  const [input, dispatch] = useReducer(reducer, initialState);

  const [openLoadCode, setOpenLoadCode] = React.useState(false);
  const handleOpenLoadCode = () => setOpenLoadCode(true);
  const handleCloseLoadCode = () => setOpenLoadCode(false);

  const [program, setProgram] = React.useState({});

  const classes = useStyles();

  const Input = styled("input")({
    display: "none",
  });

  const handleChange = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      setProgram(e.target.result);
    };
  };

  const handleUploadFile = (e) => {
    props.startBasicSimulator();
    handleCloseLoadCode();
  };

  const getOutputValues = (outputs) => {
    setOutputs(outputs);
  };
  const changeInputs = (inp) => {
    dispatch({ type: "CHANGE_STATE", data: inp });
  };

  const viewBox = [
    window.innerWidth / -2,
    -simulatorHeight - 50,
    window.innerWidth,
    simulatorHeight,
  ];

  const style = {};

  function isEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  React.useEffect(() => {
    
    if (!isEmpty(program))
      dispatch({
        type: "CHANGE_STATE",
        data: { data: convertInputsToStartInputs(parseJSON(program).inputs) },
      });
    //if (program != {})
    //dispatch({ type: "CHANGE_STATE", data: parseJSON(program).inputs });
    //setInputs(input);
  }, [program]);
  let onlyInputs = [];
  let onlyOutputs = [];
  if (!isEmpty(program)) {
    
    parseJSON(program).inputs.map((input, index) => {
      if (input[0] == "I") onlyInputs.push(input);
    });

    parseJSON(program).outputs.map((output, index) => {
      if (output[0] == "Q") onlyOutputs.push(output);
    });
  }

  return (
    <g>
      <svg
        id="simulator-canvas"
        preserveAspectRatio="xMaxYMax none"
        viewBox={viewBox}
        style={style}
      >
        {!props.simulatorState.startedBasicSimulator && (
          <g>
            <Title
              position={{
                x: 50,
                y: -500,
                text: "ISim 4.0 - Simulador",
                size: "80",
              }}
            />
            <image src={require("../images/logo.png")} x="0" y="0" />

            <Title
              position={{
                x: 150,
                y: -400,
                text: "Selecione o modo do simulador",
                size: "40",
              }}
            />
            <g style={style}>
              <ItemMenu
                onClick={handleOpenLoadCode}
                text="Modo Básico"
                index="0"
              />
              <ItemMenu
                onClick={() => console.log("Modo Projeto")}
                text="Modo Projeto"
                index="1"
              />
              <ItemMenu
                onClick={() => console.log("Modo Criação")}
                text="Modo Criação"
                index="2"
              />
            </g>
          </g>
        )}

        {props.simulatorState.startedBasicSimulator && program != "" && (
          <g>
            <Title
              position={{
                x: -750,
                y: -720,
                text: "ISim 4.0 - Simulador",
                size: "60",
              }}
            />
            <Title
              position={{
                x: -750,
                y: -670,
                text: "Modo Básico",
                size: "40",
              }}
            />
            <InputBoard
              code={program}
              simulatorState={props.simulatorState}
              changeInputs={changeInputs}
            />

            {onlyInputs.length > 0 && (
              <svg x="-450" y="-900" width="500">
                <path
                  d="M0 200 L150 200 L150 10 L290 10 L290 150"
                  stroke="green"
                  strokeWidth="10"
                  fill="transparent"
                ></path>
              </svg>
            )}

            {onlyOutputs.length > 0 && (
              <svg x="-170" y="-850" width="1000">
                <path
                  d="M10 450 L10 500 L500 500 L500 10 L820 10 L820 100"
                  stroke="red"
                  strokeWidth="10"
                  fill="transparent"
                ></path>
              </svg>
            )}

            <PLC
              simulatorState={props.simulatorState}
              getInputsValues={input}
              getOutputValues={getOutputValues}
              code={program}
            />
            <OutputBoard
              simulatorState={props.simulatorState}
              outputs={outputs}
              code={program}
            />
            <g onClick={() => props.returnToMenu()}>
              <svg x="900" y="-1050">
                <path
                  d="M2 30 L70 30 M0 30 L35 60 M0 30 L35 0"
                  stroke="#568"
                  strokeWidth="10"
                  fill="transparent"
                />
              </svg>
              <Title
                position={{
                  x: 1380,
                  y: -710,
                  text: "Voltar",
                  size: "40",
                }}
              />
            </g>
          </g>
        )}
        <img src={logoLaica} />
      </svg>
      <Modal
        open={openLoadCode}
        onClose={handleCloseLoadCode}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style_modal}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Faça o upload do seu código antes de iniciar
          </Typography>
          <div className={classes.root}>
            <Divider />
            <Stack direction="row" alignItems="center" spacing={1}>
              <label htmlFor="contained-button-file">
                <Input
                  accept=".json,application/json"
                  id="contained-button-file"
                  multiple="false"
                  type="file"
                  onChange={handleChange}
                />
                <Button variant="primary" component="span">
                  Selecionar programa
                </Button>
              </label>
              <label htmlFor="icon-button-file">
                <Input accept="image/*" id="icon-button-file" type="file" />
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                >
                  <FileCopyIcon />
                </IconButton>
              </label>
            </Stack>
          </div>
          <Divider />
          <Divider />
          <Button onClick={handleUploadFile}>Carregar</Button>
        </Box>
      </Modal>
    </g>
  );
};

export default Canvas;
