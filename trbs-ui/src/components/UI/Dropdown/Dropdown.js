import React, { useState } from "react";
import * as classes from "./Dropdown.module.css";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
const Dropdown = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={classes.Dropdown}>
      <p className={classes.DropdownText} onClick={() => setIsOpen(!isOpen)}>
        {props.headText}
        {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </p>
      <div
        className={classes.DropdownContent}
        style={{ display: isOpen ? "flex" : "none" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {props.children}
      </div>
    </div>
  );
};
export default Dropdown;
