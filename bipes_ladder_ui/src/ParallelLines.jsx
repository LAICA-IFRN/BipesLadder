import React from "react";

const style_vertical_div = {
  
  backgroundColor: "#b8b9b8",
  width: "3px",
  height: "110px",
  marginTop: "-48px",
  marginLeft: "-3px",
};

const parallelLines = new Array(5)
  .fill("")
  .map(() => new Array(1).fill("0-0-0"));

const ParallelLines = ({path, rowPath}) => {
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

  return (
    <div
      id={"parallel_line-" + path}
      style={style_vertical_div}
      onClick={() => showLine(path, rowPath)}
    ></div>
  )
}

export default ParallelLines
export { parallelLines }