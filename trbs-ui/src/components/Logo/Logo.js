import React from "react";
import { useHistory } from "react-router-dom";
import LogoImage from "../../assets/images/logo.png";

import classes from "./Logo.module.css";

const Logo = (props) => {
  const history = useHistory();

  const logoClicked = () => {
    history.push("/");
  };

  return (
    <div className={classes.LogoImage} onClick={logoClicked}>
      <img src={LogoImage} alt="Logo" />
    </div>
  );
};
export default Logo;
