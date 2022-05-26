import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { addHexColor } from "../utils/functions";


const Light = (props) => {
  const [state, setState] = useState(props.color);
  const [on, setOn] = useState(false);
  useEffect(() => {
    onChange();
  }, [props]);

  const onChange = () => {
    let pressColor;

    if (props.state) {
      pressColor = props.color;
      setOn(false);
    } else {
      pressColor = "#F5F5F5"
      setOn(true);
    }
    

    setState(pressColor);
    //props.inputFromButton(pressed);
  };

  return (
    <circle
      style={{ fill: state , stroke: "gray", strokeWidth: "12px" }}
      cx={props.position.x}
      cy={props.position.y}
      r={50}
    />
  );
};

Light.propTypes = {
  state: PropTypes.bool.isRequired,
  color: PropTypes.string.isRequired,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
};

export default Light;
