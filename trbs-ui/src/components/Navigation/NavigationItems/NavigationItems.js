import { faUser, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@material-ui/core";
import ExpandMore from "@material-ui/icons/ExpandMore";
import React from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import Dropdown from "../../UI/Dropdown/Dropdown";
import DropdownItem from "../../UI/Dropdown/DropdownItem/DropdownItem";
import NavigationItem from "./NavigationItem/NavigationItem";
import classes from "./NavigationItems.module.css";

const NavigationItems = (props) => {
  let navItemsClasses = [classes.NavigationItems];
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  if (props.isNavOpen) navItemsClasses.push(classes.Open);
  else navItemsClasses.push(classes.Close);
  return (
    <div className={navItemsClasses.join(" ")}>
      <NavigationItem link="/about" onClick={props.closeNav}>
        About US
      </NavigationItem>
      <NavigationItem link="/events" onClick={props.closeNav}>
        Events
      </NavigationItem>
      <NavigationItem link="/informal-events" onClick={props.closeNav}>
        Informal Events
      </NavigationItem>
      <NavigationItem link="/workshops" onClick={props.closeNav}>
        Workshops
      </NavigationItem>
      <NavigationItem link="/speakers" onClick={props.closeNav}>
        Speakers
      </NavigationItem>
      <NavigationItem link="/highlights" onClick={props.closeNav}>
        Highlights
      </NavigationItem>
      <NavigationItem link="/connexions" onClick={props.closeNav}>
        Connexions
      </NavigationItem>
      <NavigationItem link="/sponsers" onClick={props.closeNav}>
        Sponsors
      </NavigationItem>
      <NavigationItem link="/strategizer" onClick={props.closeNav}>
        Strategizer
      </NavigationItem>
      <NavigationItem link="/contact-us" onClick={props.closeNav}>
        Contact Us
      </NavigationItem>
      {props.isAutenticated ? (
        <>
          <div className={classes.ProfileBtnGrp}>
            <Dropdown headText={props.user.first_name}>
              <DropdownItem link="/profile">Profile</DropdownItem>
              {props.user?.role === "admin" ? (
                <DropdownItem link="/dashboard">Dashboard</DropdownItem>
              ) : null}
              <DropdownItem link="/logout">Logout</DropdownItem>
            </Dropdown>
            <NavLink to="/cart" exact className={classes.CartIcon}>
              <div className={classes.Cart}>
                <ShoppingCartIcon />
                <span className={classes.CartItemCount}>
                  {props.cart?.cart_items.length}
                </span>
              </div>
            </NavLink>
          </div>
          <Accordion
            className={classes.MobilePofileBtnGrp}
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              {props.user.first_name}
            </AccordionSummary>
            <AccordionDetails className={classes.MobileProfileDetails}>
              <NavLink
                to="/profile"
                className={classes.NavigationItem}
                onClick={props.closeNav}
                activeClassName={classes.NavActive}
              >
                Profile
              </NavLink>
              {props.user?.role === "admin" ? (
                <NavLink
                  to="/dashboard"
                  className={classes.NavigationItem}
                  onClick={props.closeNav}
                  activeClassName={classes.NavActive}
                >
                  Dashboard
                </NavLink>
              ) : null}

              <NavLink
                to="/cart"
                className={classes.NavigationItem}
                onClick={props.closeNav}
                activeClassName={classes.NavActive}
              >
                Cart
              </NavLink>
              <NavLink
                to="/logout"
                className={classes.NavigationItem}
                onClick={props.closeNav}
                activeClassName={classes.NavActive}
              >
                Logout
              </NavLink>
            </AccordionDetails>
          </Accordion>
        </>
      ) : (
        <div className={classes.AuthNavigationItems}>
          <NavigationItem link="/login" authBtn>
            <FontAwesomeIcon icon={faUser} />
            <p>Login</p>
          </NavigationItem>
          <NavigationItem link="/register" authBtn>
            <FontAwesomeIcon icon={faUserPlus} />
            <p>Register</p>
          </NavigationItem>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isAutenticated: state.auth.token !== null,
    user: state.auth.user,
    cart: state.auth.cart,
  };
};

export default connect(mapStateToProps)(NavigationItems);
