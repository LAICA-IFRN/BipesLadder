import React, { useState, useCallback, useEffect } from "react";

import TrashDropZone from "./TrashDropZone";

import SideBarItem from "./SideBarItem";
import Row from "./Row";
import initialData from "./initial-data";
import {
  handleMoveWithinParent,
  handleMoveToDifferentParent,
  handleMoveSidebarComponentIntoParent,
  handleRemoveItemFromLayout,
  createJSON,
  setStorage,
  getStorage,
  getLocalStorage,
  getAllLocalStorage,
} from "./helpers";

import {
  SIDEBAR_ITEMS,
  SIDEBAR_ITEMS_OTHER,
  SIDEBAR_ITEM,
  COMPONENT,
  STANDARD_COMPONENT,
} from "./constants";
import shortid from "shortid";
import { nanoid } from "nanoid";

import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import IconButton from "@material-ui/core/IconButton";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Column from "./Column";
import { parallelLines } from "./ParallelLines"
import OpenInBrowserIcon from "@material-ui/icons/OpenInBrowser";

import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import InboxIcon from "@material-ui/icons/Inbox";
import DraftsIcon from "@material-ui/icons/Drafts";

import { Button, Modal, Box, Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { Code } from "@material-ui/icons";
import { Component } from "react";

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
    backgroundColor: theme.palette.background.paper,
  },
}));

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

function Container() {
  const [openSaveModel, setOpenSaveModel] = React.useState(false);
  const handleOpenSaveModel = () => setOpenSaveModel(true);
  const handleCloseSaveModel = () => setOpenSaveModel(false);

  const [openLoadModel, setOpenLoadModel] = React.useState(false);
  const handleOpenLoadModel = () => setOpenLoadModel(true);
  const handleCloseLoadModel = () => setOpenLoadModel(false);
  const initialLayout = initialData.layout;
  const initialComponents = initialData.components;
  const [layout, setLayout] = useState(initialLayout);
  const [components, setComponents] = useState(initialComponents);
  const [timerParameters, setTimerParameters] = useState({});
  const [counterParameters, setCounterParameters] = useState({});
  const [address, setAddress] = useState([]);
  const [jsonExpression, setJsonExpression] = useState("{}");
  const classes = useStyles();
  let finalExpression = {};
  let layoutForSaveCopy = "";

  let inputs_ = [];
  let outputs_ = [];
  const [inputs, setInputs] = useState([]);
  const [outputs, setOutputs] = useState([]);

  const addressFromRow = (addresses) => {
    //addressArray.push(addresses[0]);
    setAddress(addresses);
  };

  const handleDropToTrashBin = useCallback(
    (dropZone, item) => {
      console.log("BippesLadder - Item", item, address);
      let components_copy = components;
      const splitItemPath = item.path.split("-");
      setLayout(handleRemoveItemFromLayout(layout, splitItemPath));
      const components_ = Object.keys(components_copy);
      let address_ = address;
      for (let index = 0; index < components_.length; index++) {
        if (
          !components_.includes(
            "openedContactComponent",
            "coilComponent",
            "closedContactComponent",
            "timerComponent",
            "counterComponent"
          )
        ) {
          const component = components[components_[index]];

          if (component.id == item.id && component.type != "") {
            for (let index = 0; index < inputs_.length; index++) {
              const input = inputs_[index];

              if (input == component.properties.address) {
                inputs_.splice(index, 1);
                break;
              }
            }
            

            address_.map((address, index) => {
              if (address.args.path == item.path) {
                delete address_[index];
              }
            });

            delete components_copy[component.id];
            console.log("Components_Copy", components_copy);
            break;
          }
        }
      }

      setAddress(address_);
      setComponents(components_copy);
    },
    [layout]
  );

  const handleDrop = useCallback(
    (dropZone, item) => {
      const splitDropZonePath = dropZone.path.split("-");

      const pathToDropZone = splitDropZonePath.slice(0, -1).join("-");

      const newItem = { id: nanoid(), type: item.type };
      if (item.type === COMPONENT) {
        newItem.children = item.children;
      }

      // sidebar into
      if (item.type === SIDEBAR_ITEM) {
        console.log("Bippes Ladder - New Item Component", item);
        // 1. Move sidebar item into page
        let newId = nanoid();
        item.component.id = newId;
        const newComponent = {
          id: newId,
          ...item.component,
        };

        console.log("Bippes Ladder - New Component", newComponent);

        const newItem = {
          id: newComponent.id,
          type: COMPONENT,
          row: splitDropZonePath[2],
          column: splitDropZonePath[1],
        };

        console.log("Bippes Ladder - New Item", newItem);

        setComponents({
          ...components,
          [newComponent.id]: newComponent,
        });

        setLayout(
          handleMoveSidebarComponentIntoParent(
            layout,
            splitDropZonePath,
            newItem
          )
        );
        return;
      }

      // move down here since sidebar items dont have path
      const splitItemPath = item.path.split("-");
      const pathToItem = splitItemPath.slice(0, -1).join("-");

      // 2. Pure move (no create)
      if (splitItemPath.length === splitDropZonePath.length) {
        // 2.a. move within parent
        if (pathToItem === pathToDropZone) {
          setLayout(
            handleMoveWithinParent(layout, splitDropZonePath, splitItemPath)
          );
          return;
        }

        // 2.b. OR move different parent
        // TODO FIX columns. item includes children
        setLayout(
          handleMoveToDifferentParent(
            layout,
            splitDropZonePath,
            splitItemPath,
            item
          )
        );
        return;
      }

      // 3. Move + Create
      setLayout(
        handleMoveToDifferentParent(
          layout,
          splitDropZonePath,
          splitItemPath,
          newItem
        )
      );
    },
    [layout, components]
  );

  const renderRow = (row, currentPath) => {
    return (
      <Row
        key={row.id}
        data={row}
        handleDrop={handleDrop}
        components={components}
        path={currentPath}
        addressFromRow={addressFromRow}
      />
    );
  };

  function checkParallelLines(row) {
    const linePairs = [];
    var initialLine = 0;
    var parallelLinesOrdered = [];

    console.log(parallelLines);

    parallelLines[row].map((path, index) => {
      if (path != "") {
        const splitItemPath = path.split("-");
        const pathToItem = splitItemPath[1];
        parallelLinesOrdered.push(Number(pathToItem));
        parallelLinesOrdered.sort(function (a, b) {
          return a - b;
        });
      }
    });

    parallelLinesOrdered.map((pathOrdererd, index) => {
      if (pathOrdererd > initialLine) {
        linePairs.push([initialLine, pathOrdererd]);
        initialLine = pathOrdererd;
      }
    });
    

    return linePairs;
  }

  function splitPath(path) {
    var splittedPath = path.split("-");
    if (path == "") return -1;
    return {
      line: splittedPath[0],
      column: splittedPath[1],
      row: splittedPath[2],
    };
  }

  function joinPath(row, column, line) {
    return line + "-" + column + "-" + row;
  }

  function operation(op, firstComponent, secondComponent) {
    if (firstComponent.row == -1) return secondComponent;
    if (secondComponent.row == -1) return firstComponent;
    const row = firstComponent.row;
    const address =
      "(" +
      firstComponent.args.address +
      op +
      secondComponent.args.address +
      ")";
    const splittedPathFirstComponent = splitPath(firstComponent.args.path);
    const splittedPathSecondComponent = splitPath(secondComponent.args.path);
    const path = joinPath(
      Math.min(splittedPathFirstComponent.row, splittedPathSecondComponent.row),
      Math.min(
        splittedPathFirstComponent.column,
        splittedPathSecondComponent.column
      ),
      splittedPathFirstComponent.line
    );
    const type = op + "_operation";
    const newComponent = {
      row: row,
      args: {
        address: address,
        path: path,
        type: type,
      },
    };
    return newComponent;
  }

  function sortAddressByPath(address, row) {
    var newAddress = new Array(2)
      .fill(STANDARD_COMPONENT)
      .map(() => new Array(13).fill(STANDARD_COMPONENT));
    console.info(newAddress);
    let line = [];
    address.map((component, index) => {
      if (component.args != "" && component.row == row) {
        const row = splitPath(component.args.path).row;
        const col = splitPath(component.args.path).column;

        if (component.args.type == "closed_contact") {
          if (component.args.address[0] == "n") {
            component.args.address = component.args.address;
          } else {
            component.args.address = "not (" + component.args.address + ")";
          }
        }

        newAddress[row][col] = component;
        if (component.args.type != "coil" && component.args.type != "timer")
          inputs_.push(component.args.address);
      }
    });

    return newAddress;
  }

  var remove = function (array, value) {
    var index = null;

    while ((index = array.indexOf(value)) !== -1) array.splice(index, 1);

    return array;
  };

  function checkInstructionParameters() {
    console.log("BippesLadder - Address", address);
    const components_ = address;
    let instructions = {};
    
    let instructionsCounter_ = [];
    let instructionsTimer_ = [];
    for (let index = 0; index < components_.length; index++) {
      const component = components_[index];
      let instructionsCounter = {};
      let instructionsTimer = {};
      if (component.args.type == "timer") {
        instructionsTimer.address = component.args.address;
        instructionsTimer.timerType = component.args.properties.timerType;
        instructionsTimer.timerDuration = component.args.properties.timerDuration;
        instructionsTimer_.push(instructionsTimer);
      } else {
        if (component.args.type == "counter") {
          instructionsCounter.address = component.args.address;
          instructionsCounter.counterType = component.args.properties.counterType;
          instructionsCounter.preValue = component.args.properties.preValue;
          instructionsCounter_.push(instructionsCounter);
        }
      }
    }
    instructions["counters"] = instructionsCounter_;
    instructions["timers"] = instructionsTimer_;
    return instructions;
  }

  function getExpression(linePairs, row) {
    let addressOrdered = sortAddressByPath(address, row);
    console.log(addressOrdered);

    let expression = STANDARD_COMPONENT;
    let componentsIntoLinePair = [];

    if (linePairs.length > 0) {
      linePairs.map((pair, index) => {
        componentsIntoLinePair = [];
        for (let row = 0; row < 2; row++) {
          expression = STANDARD_COMPONENT;
          for (let col = pair[0]; col < pair[1]; col++) {
            if (
              addressOrdered[row][col].row == -1 ||
              addressOrdered[row][col].args.type == "coil" ||
              addressOrdered[row][col].args.type == "timer"
            )
              break;

            expression = operation(
              " and ",
              addressOrdered[row][col],
              expression
            );

            addressOrdered[row][col] = STANDARD_COMPONENT;
            const newPath = expression.args.path;
            addressOrdered[splitPath(newPath).row][splitPath(newPath).column] =
              expression;
          }
          componentsIntoLinePair.push(expression);
        }

        expression = STANDARD_COMPONENT;
        componentsIntoLinePair.map((component, index) => {
          expression = operation(" or ", component, expression);
        });

        const newPath = expression.args.path;

        if (splitPath(newPath) != -1) {
          const row = splitPath(newPath).row;
          const col = splitPath(newPath).column;

          addressOrdered[row][col] = expression;
        }
      });
    }
    let output = [];
    expression = STANDARD_COMPONENT;
    addressOrdered[0].map((component, index) => {
      if (component.args.type != "coil" && component.args.type != "timer") {
        console.log(component);
        expression = operation(" and ", component, expression);
      }
    });
    for (let index = 0; index < addressOrdered.length; index++) {
      const lineAddressOrderedLength = addressOrdered[0].length;
      let comp = addressOrdered[index][lineAddressOrderedLength - 1];
      if (comp != undefined) {
        output.push(comp);
      }
    }

    //checkInstructionParameters(inputs_);
    for (let index = 0; index < inputs_.length; index++) {
      const input_ = inputs_[index];
      //if (input_[0] == "T") {
      //inputs_ = remove(inputs_, input_);
      //}
    }
    //
    finalExpression.inputs = inputs_;

    setInputs(inputs_);

    return [expression.args.address, output];
  }

  const generateCode = useCallback(() => {
    let layoutForSave = layout;
    layoutForSaveCopy = layoutForSave;
    finalExpression["row"] = [];
    finalExpression["outputs"] = [];

    layout.map((row, rowIndex) => {
      let outs = [];
      var linePairs = checkParallelLines(rowIndex);

      let obj = {};
      obj.row = rowIndex;
      var [expression, outputs] = getExpression(linePairs, rowIndex);
      obj.expression = expression;
      outputs.map((output, index) => {
        outs.push(output.args.address);
        let components = layoutForSave[rowIndex].children;
        components[components.length - 1].id = "coilComponent";
      });
      obj.outputs = outs;
      for (let index = 0; index < outs.length; index++) {
        const out = outs[index];
        if (out[0] == "Q") finalExpression["outputs"].push(out);
      }

      finalExpression["row"].push(obj);
    });

    const instructionParameters = checkInstructionParameters(address);
    finalExpression["instructions_parameters"] = instructionParameters;
    var json = createJSON(finalExpression);
    setJsonExpression(json);
    setLayout(layout);
    alert(json);
    downloadFile(json);
  });

  const clearAllComponents = useCallback(() => {
    const layout = [];
    setLayout(layout);
  });

  const setLoadLayout = useCallback((loadLayout) => {
    setLayout(loadLayout);
    handleCloseLoadModel();
  });

  const saveStoreFile = useCallback(() => {
    const itemName = document.getElementById("projectName").value;
    setStorage(itemName, JSON.stringify(layout));
    handleCloseSaveModel();
  });

  const loadStoredFile = (index) => {
    //const jsonTest = '{"layout": [{"row": 0, "expression":"A", "outputs":["B"]},{"row": 1, "expression":"A", "outputs":["B"]}]}'
    const json = localStorage.key(index);

    clearAllComponents();
    //const jsonFinal = JSON.parse(json);
    const loadLayout = JSON.parse(json);

    setLoadLayout(loadLayout);
  };
  const addnewLine = useCallback(() => {
    var itens = [
      components.lineComponent,
      components.lineComponent,
      components.lineComponent,
      components.lineComponent,
      components.lineComponent,
      components.lineComponent,
      components.lineComponent,
      components.lineComponent,
      components.lineComponent,
      components.lineComponent,
      components.lineComponent,
      components.lineComponent,
      initialData.components.openedContactComponent,
    ];

    let newLayout = handleMoveSidebarComponentIntoParent(
      layout,
      [layout.length],
      initialData.components.coilComponent
    );
    setLayout(newLayout);

    itens.map((item, index) => {
      let nextComponentLayout = handleMoveSidebarComponentIntoParent(
        newLayout,
        [layout.length, 0],
        item
      );
      setLayout(nextComponentLayout);
      newLayout = nextComponentLayout;
    });
  });

  useEffect(() => {
    console.log("BippesLadder - components", components);
  }, [components]);

  useEffect(() => {
    console.log("BippesLadder - address", address);
  }, [address]);

  function downloadFile(code) {
    let element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(code)
    );
    element.setAttribute("download", "code.json");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  return (
    <div className="body">
      <div class="head_top">
        <div style={{ textAlign: "right", float: "right" }}>
          <img src="./images/logo_modified.png" width="150"></img>
        </div>

        <div class="menu">
          <Fab variant="extended" aria-label="add" style={{ margin: "2px" }}>
            <IconButton color="primary" onClick={generateCode}>
              <PlayCircleOutlineIcon /> DOWNLOAD CODE
            </IconButton>
          </Fab>

          <Fab variant="extended" aria-label="add" style={{ margin: "2px" }}>
            <IconButton color="primary" onClick={handleOpenSaveModel}>
              <SaveAltIcon /> SALVAR
            </IconButton>
          </Fab>
          <Fab variant="extended" aria-label="add" style={{ margin: "2px" }}>
            <IconButton color="primary" onClick={handleOpenLoadModel}>
              <OpenInBrowserIcon /> CARREGAR
            </IconButton>
          </Fab>
        </div>
      </div>
      <div class="inner_body">
        <div className="sideBar">
          <h3>CONTATOS</h3>
          {Object.values(SIDEBAR_ITEMS).map((sideBarItem, index) => (
            <SideBarItem key={sideBarItem.id} data={sideBarItem} />
          ))}
          <h3>OUTROS</h3>
          {Object.values(SIDEBAR_ITEMS_OTHER).map((sideBarItem, index) => (
            <SideBarItem key={sideBarItem.id} data={sideBarItem} />
          ))}
          <div style={{ marginTop: "50px", textAlign: "center" }}>
            <img src="./images/if_logo.png" width="70"></img>
            <img src="./images/logoLaica.png" width="70"></img>
          </div>
        </div>
        <div className="pageContainer">
          <div className="page">
            <div class="menu">
              <Fab aria-label="add" style={{ margin: "2px" }}>
                <IconButton color="secondary" onClick={addnewLine}>
                  <AddIcon />
                </IconButton>
              </Fab>
              <Fab aria-label="clear" style={{ margin: "2px" }}>
                <IconButton color="secondary" onClick={clearAllComponents}>
                  <ClearAllIcon />
                </IconButton>
              </Fab>
            </div>

            {layout.map((row, index) => {
              const currentPath = `${index}`;

              return (
                <React.Fragment key={row.id}>
                  <div
                    class="style_modal"
                    style={{
                      border: "2px solid #ABC",

                      marginBottom: "10px",
                      padding: "5px",
                      backgroundColor: "lightgreen",
                    }}
                  >
                    LINHA {index + 1}
                  </div>
                  {renderRow(row, currentPath)}
                </React.Fragment>
              );
            })}
            
          </div>
          <TrashDropZone
              data={{
                layout,
              }}
              onDrop={handleDropToTrashBin}
            />
          <div className="pageTest"></div>
        </div>
      </div>
      <Modal
        open={openSaveModel}
        onClose={handleCloseSaveModel}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style_modal}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
          ></Typography>
          <TextField
            id="projectName"
            label="Nome do Projeto"
            variant="outlined"
          />
          <Button onClick={saveStoreFile}>Salvar</Button>
        </Box>
      </Modal>
      <Modal
        open={openLoadModel}
        onClose={handleCloseLoadModel}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style_modal}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Projetos Salvos
          </Typography>
          <div className={classes.root}>
            <Divider />
            <List component="nav" aria-label="secondary mailbox folders">
              {Object.values(localStorage).map((item, index) => {
                return (
                  <div>
                    <ListItem button onClick={() => loadStoredFile(index)}>
                      <ListItemIcon>
                        <InboxIcon />
                      </ListItemIcon>

                      <ListItemText primary={item}></ListItemText>
                    </ListItem>
                  </div>
                );
              })}
            </List>
          </div>
          <Divider />
        </Box>
      </Modal>
    </div>
  );
}
export default Container;
