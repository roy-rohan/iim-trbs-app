import React from "react";
import classes from "./PageNotFound.module.css";

import PNFImage from "../../assets/images/PNF.jpg";

const PageNotFound = (props) => {
  return (
    <div className={classes.PageWrapper}>
      <img src={PNFImage} alt="pagenotfound" />
    </div>
  );
};
export default PageNotFound;
