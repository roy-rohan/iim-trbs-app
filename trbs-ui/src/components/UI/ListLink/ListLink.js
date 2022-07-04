import { ListItem } from "@material-ui/core";
import React from "react";
import * as classes from "./ListLink.module.css";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
const ListLink = (props) => {
  return (
    <NavLink to={props.to} exact className={clsx(classes.ListLink)}>
      <ListItem className={props.className} button>
        {props.children}
      </ListItem>
    </NavLink>
  );
};
export default ListLink;
