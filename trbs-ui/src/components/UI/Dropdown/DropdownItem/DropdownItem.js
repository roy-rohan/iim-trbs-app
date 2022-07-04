import React from "react";
import { NavLink } from "react-router-dom";
import * as classes from "./DropdownItem.module.css";
const DropdownItem = (props) => {
  return (
    <>
      <NavLink
        to={props.link}
        exact={props.exact}
        className={classes.DropdownItem}
        activeClassName={classes.NavActive}
      >
        {props.children}
      </NavLink>
    </>
  );
};
export default DropdownItem;
