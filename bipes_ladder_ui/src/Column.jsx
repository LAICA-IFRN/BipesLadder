import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import { COLUMN } from "./constants";
import DropZone from "./DropZone";
import Component from "./Component";

const style_vertical_div = {
  backgroundColor: "#dee0de",
  width: "3px",
  position: "absolute",
  height: "110px",
  marginTop: "68px",
  marginLeft: "-3px",
};

const checkIfwasSelected = (path, row) => parallelLines[row].includes(path);

const changeLineColor = (color, path) => document
  .getElementById("parallel_line-" + path)
  .style.backgroundColor = color

const showLine = (path, rowPath) => {
  const row = rowPath.split("-")[0];
  const wasSelected = checkIfwasSelected(path, row)

  if (wasSelected) {
    changeLineColor('#dee0de', path)
    parallelLines[row]
      .splice(parallelLines[row]
      .indexOf(path));

      return
  }

  changeLineColor('Black', path)
  parallelLines[row].push(path);
};

const style = {};
const parallelLines = new Array(5)
  .fill("")
  .map(() => new Array(15).fill(""));

let rowPath;

const Column = ({
  data,
  components,
  handleDrop,
  path,
  addressFromComponent,
}) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    item: {
      type: COLUMN,
      id: data.id,
      children: data.children,
      path,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(ref);

  const renderComponent = (component, currentPath) => {
    rowPath = currentPath;
    return (
      <Component
        key={component.id}
        data={component}
        components={components}
        path={currentPath}
        addressFromComponent={addressFromComponent}
      />
    );
  };

  return (
    <div
      ref={ref}
      style={{ ...style, opacity }}
      className="base draggable column"
    >
      {data.children.map((component, index) => {
        const currentPath = `${path}-${index}`;

        return (
          <React.Fragment key={component.id}>
            <DropZone
              data={{
                path: currentPath,
                childrenCount: data.children.length,
                drawLine: false,
              }}
              onDrop={handleDrop}
            />

            {renderComponent(component, currentPath)}
          </React.Fragment>
        );
      })}
      <DropZone
        data={{
          path: `${path}-${data.children.length}`,
          childrenCount: data.children.length,
          drawLine: false,
        }}
        onDrop={handleDrop}
        isLast
      />

      <div
        id={"parallel_line-" + path}
        style={style_vertical_div}
        onClick={() => showLine(path, rowPath)}
      ></div>
    </div>
  );
};

export default Column;
export { parallelLines };
