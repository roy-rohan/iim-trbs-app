import React from "react";
import classes from "./Highlights.module.css";

// import commingSoonImage from "../../assets/images/comming-soon.jpg";

const Highlights = (props) => {
  return (
    <div className={classes.Highlights}>
      {/* <div className={classes.PageHeaderWrapper}>
        <h1 className={classes.PageHeading}>Highlights</h1>
      </div> */}
      <div className={classes.ContentWrapper}>
        {/* <img src={commingSoonImage} alt="comming soon" /> */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <p className={classes.ComingSoon}>Highlights will be added soon.</p>
        </div>
      </div>
    </div>
  );
};
export default Highlights;
