import React from "react";
import classes from "./HamburgerMenu.module.css";

const HamburgerMenu = (props) => {
  let menuClasses = [classes.Hamburger];
  if (props.isNavOpen) menuClasses.push(classes.Open);
  return (
    <div className={menuClasses.join(" ")} onClick={props.toggleMenu}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};
export default HamburgerMenu;
