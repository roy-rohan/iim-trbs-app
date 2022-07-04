import React from "react";
import { NavLink } from "react-router-dom";
import classes from "./Button.module.css";

const Button = (props) => {
  let buttonClasses = [classes.Button];
  for (let param in props.params) {
    buttonClasses.push(classes[props.params[param]]);
  }
  return (
    <NavLink
      to={props.link}
      exact={props.exact}
      className={buttonClasses.join(" ")}
    >
      {props.children}
    </NavLink>
  );
};
export default Button;
