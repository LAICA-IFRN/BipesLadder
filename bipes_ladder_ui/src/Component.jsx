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
  svgToBeSet,
} from "./svgs";
import { AddAlarmOutlinedIcon } from "@material-ui/icons";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import ParallelLines from "./ParallelLines";

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

  const componentContent = components[data.id].content;
  console.log("Path >>>>>>>", path.split('-'));

  const [line, row, col] = path.split('-');
  let drawParallelLine = <ParallelLines path={path} rowPath={path} />;
  if(col == 0){
    drawParallelLine = <div></div>;
  }

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
    setOpen(false);
  };

  useEffect(() => {
    if (component.id !== "lineComponent" && address !== "") {
      addressFromComponent({
        id: data.id,
        address: address,
        path: path,
        type: component.content,
      });
    }
  }, [address]);

  const [svgText, setSvgText] = React.useState(component.svg.text);
  const [svgIcon, setSvgIcon] = React.useState(component.svg.icon);

  const onAddressChange = (e) => {
    //setAddress(e.target.value);
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

  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  const [newParameters, setNewParameters] = React.useState("");

  return (
    <div style={{ display:"flex", flexDirection: "row" }}>
      <div ref={ref} style={{ ...style, opacity}}>
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

              <Button onClick={changeProperty}>Salvar</Button>
            </Box>
          </Modal>
        </div>

        <div>
          <svg width="120px" height="70px">
            <g fill="none" stroke={component.color}>
              {component.svg.path.map(function (svg_element, index) {
                return <path stroke-width="3" d={svg_element} fill="none" />;
              })}
            </g>
          </svg>
        </div>
      </div>
      <div style={{flex: 1, backgroundColor: "blue"}}>
        {drawParallelLine}
      </div>
    </div>
  );
};

export default Component;
