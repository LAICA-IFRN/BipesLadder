import React, { useRef, useEffect } from "react";
import { useDrag } from "react-dnd";
import { COMPONENT } from "./constants";
import TextField from "@material-ui/core/TextField";
import {
  Button,
  Modal,
  Box,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  Checkbox,
} from "@material-ui/core";
import {
  timerSvg,
  ASCCounterSvg,
  DSCCounterSvg,
  UDCCounterSvg,
  svgToBeSet
} from "./svgs"
import { AddAlarmOutlinedIcon } from "@material-ui/icons";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

const style = {
  //border: "1px dashed black",
  cursor: "move",
  textAlign: "center",
};

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

const style_svg = {
  position: "absolute",
  bottom: "0px",
  zIndex: "-1",
  bottom: "-15px",
  left: "0px",
};

const theme = createTheme({
  palette: {
    primary: {
      main: "#90ed8e",
    },
    secondary: {
      main: "#558b2f",
    },
  },
});

const Component = ({ data, components, path, addressFromComponent }) => {
  const component = components[data.id];
  const ref = useRef(null);
  const [open, setOpen] = React.useState(false);
  const [address, setAddress] = React.useState(component.properties.address);
  
  const componentContent = components[data.id].content
  const timerComponent = componentContent === "timer"
  const counterComponent = componentContent === "counter"
  
  const [{ isDragging }, drag] = useDrag({
    item: { type: COMPONENT, id: data.id, path },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  const opacity = isDragging ? 0 : 1;

  drag(ref);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const changeProperty = () => {
    let value = document.getElementById("changeAddress").value;

    setAddress(value);
    component.properties.address = value;

    console.log("Change Property - ", component);


    if (timerComponent) {
      component.properties.timerType = timerType;
      component.properties.timerDuration = timerDuration;
      component.properties.baseTime = baseTime;
      component.svg.text = svgText;

      return
    }

    if (counterComponent) {
      component.properties.counterType = counterType;
      component.properties.preValue = preValue;
      component.svg.text = svgText;
    }

    setOpen(false);
  };

  const checkButton = () => {
    if (components[data.id].content != "line") {
      return (
        <ThemeProvider theme={theme}>
          <Button
            id="btAddress"
            variant="contained"
            color="primary"
            size="small"
            onClick={handleOpen}
          >
            {address}
          </Button>
        </ThemeProvider>
      );
    }
  };

  useEffect(() => {
    if (component.id !== "lineComponent" && address !== "") {
      if (timerComponent) {
        addressFromComponent({
          id: data.id,
          address: address,
          path: path,
          type: component.content,
          properties: {
            timerType: component.properties.timerType,
            timerDuration: component.properties.timerDuration,
          },
        });

        return
      }

      if (counterComponent) {
        addressFromComponent({
          id: data.id,
          address: address,
          path: path,
          type: component.content,
          properties: {
            counterType: component.properties.counterType,
            setPoint: component.properties.preValue,
          },
        });

        return
      }

      addressFromComponent({
        id: data.id,
        address: address,
        path: path,
        type: component.content,
      });
    }
  }, [address]);

  const [timerType, setTimerType] = React.useState(
    component.properties.timerType
  );
  const [timerDuration, setTimerDuration] = React.useState(
    component.properties.timerDuration
  );
  const [baseTime, setBaseTime] = React.useState(
    component.properties.baseTime
  );
  const [redentiveTimer, setRedentiveTimer] = React.useState(
    component.properties.redentiveTimer
  );
  const [counterType, setCounterType] = React.useState(
    component.properties.counterType
  );
  const [preValue, setpreValue] = React.useState(component.properties.preValue);
  const [svgText, setSvgText] = React.useState(component.svg.text);
  const [svgIcon, setSvgIcon] = React.useState(component.svg.icon);

  const onAddressChange = e => {
    //setAddress(e.target.value);
  };

  //Hooks do Timer
  const onTimerTypeChange = e => {
    setTimerType(e.target.value);

    setSvgText(e.target.value);
  };
  const onTimerDurantionChange = e => {
    setTimerDuration(e.target.value);
  };
  const onBaseTimeChange = e => {
    setBaseTime(e.target.value);
  };
  const onRedentiveTimerChange = e => {
    setRedentiveTimer(e.target.value);
  };

  //Hooks do contador
  const onCounterTypeChange = e => {
    setCounterType(e.target.value);

    setSvgText(e.target.value);
  };
  const onPreValueChange = e => {
    setpreValue(e.target.value);
  };

  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  const timerParameters = () => {
    return (
      <div>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Tipo do Temporizador
        </Typography>
        <Select
          labelId="label"
          id="timerType"
          value="20"
          component="h2"
          class=".MuiTypography-h6"
          onChange={onTimerTypeChange}
          value={timerType}
        >
          <MenuItem value="TON">TON</MenuItem>
          <MenuItem value="TOF">TOF</MenuItem>
        </Select>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Duração
        </Typography>
        <TextField
          id="timerDuration"
          label="Segundos"
          variant="outlined"
          onChange={onTimerDurantionChange}
          value={timerDuration}
        />
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Tempo Base
        </Typography>
        <TextField
          id="baseTime"
          label="Segundos"
          variant="outlined"
          onChange={onBaseTimeChange}
          value={baseTime}
        />
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Temporizador Retentivo
        </Typography>
        <Checkbox
          {...label}
          color="blue"
          labelPlacement="top"
          id="redentiveTimer"
          onChange={onRedentiveTimerChange}
          value={redentiveTimer}
        />
      </div>
    );
  };
  const counterParameters = () => {
    return (
      <div>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Tipo do Contador
        </Typography>
        <Select
          labelId="label"
          id="counterType"
          value="0"
          id="modal-modal-title"
          component="h2"
          class=".MuiTypography-h6"
          onChange={onCounterTypeChange}
          value={counterType}
        >
          <MenuItem value="ASC">Crescente</MenuItem>
          <MenuItem value="DSC">Decrescente</MenuItem>
          <MenuItem value="UDC">UDC</MenuItem>
        </Select>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Valor pre-ajustado do counter
        </Typography>
        <TextField
          id="PreValue"
          label="Segundos"
          variant="outlined"
          onChange={onPreValueChange}
          value={preValue}
        />
      </div>
    );
  };

  const [newParameters, setNewParameters] = React.useState("");
  const checkBox = () => {
    React.useEffect(() => {
      if (components[data.id].content == "timer") {
        setSvgIcon(timerSvg)
        setNewParameters(timerParameters());

        return
      }

      if (components[data.id].content == "counter") {
        setSvgIcon("counter");
        setNewParameters(counterParameters());
        if (counterType == "ASC") {
          setSvgIcon(ASCCounterSvg);
          return
        }

        if (counterType == "DSC") {
          setSvgIcon(DSCCounterSvg);
          return
        }

        if (counterType == "UDC") {
          setSvgIcon(UDCCounterSvg);
          return
        }

        setSvgIcon(svgToBeSet);
      }
    });
  };

  return (
    <div ref={ref} style={{ ...style, opacity }}>
      <div style={{ height: "34px" }}>
        {checkButton()}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style_modal}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Parâmetros
            </Typography>
            <TextField
              id="changeAddress"
              label="Novo Endereço"
              variant="outlined"
              onChange={onAddressChange}
            />
            {checkBox()}
            {newParameters}
            <Button onClick={changeProperty}>Salvar</Button>
          </Box>
        </Modal>
      </div>
      <svg width="120px" height="70px">
        <g fill="none" stroke={component.color}>
          {component.svg.path.map(function (svg_element, index) {
            return <path stroke-width="3" d={svg_element} fill="none" />;
          })}
        </g>
        {svgIcon}
        <text x="44" y="55" fill="black">
          {svgText}
        </text>
      </svg>
    </div>
  );
};

export default Component;
