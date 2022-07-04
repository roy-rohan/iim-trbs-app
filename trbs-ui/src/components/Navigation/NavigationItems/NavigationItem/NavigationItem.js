import React from "react";
import { NavLink } from "react-router-dom";

import classes from "./NavigationItem.module.css";

const NavigationItem = (props) => {
  let navItemClasses = [classes.NavigationItem];
  if (props.authBtn) {
    navItemClasses.push(classes.AuthBtn);
  }

  let dropdownItems = props.dropdowns
    ? this.props.dropdowns.map((dropdown) => {
        return (
          <div className={classes.Dropdown}>
            <NavLink
              to={dropdown.link}
              exact={props.exact}
              className={navItemClasses.join(" ")}
              activeClassName={classes.NavActive}
            >
              {dropdown.title}
            </NavLink>
          </div>
        );
      })
    : null;

  return (
    <div className={classes.NavigationItemWrapper}>
      <NavLink
        onClick={props.onClick}
        to={props.link}
        exact={props.exact}
        className={navItemClasses.join(" ")}
        activeClassName={classes.NavActive}
      >
        {props.children}
      </NavLink>
      {dropdownItems}
    </div>
  );
};

export default NavigationItem;
