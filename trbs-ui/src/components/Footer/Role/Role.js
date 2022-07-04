import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import classes from "./Role.module.css";

const Role = (props) => {
  let peopleInvolved = props.inCharge.map((person, i) => {
    return (
      <div className={classes.PersonInvolved} key={i}>
        <p className={classes.InCharge}>{person.name}</p>
        <a href={"mailto:" + person.email} className={classes.EmailID}>
          {person.email}
        </a>
      </div>
    );
  });
  let wrapperClassName =
    props.styleType === "Footer" ? classes.FooterRole : classes.ContactUsRole;
  return (
    <div className={wrapperClassName}>
      <div className={classes.IconDiv}>
        <FontAwesomeIcon
          icon={faUser}
          className={classes.Icon}
        ></FontAwesomeIcon>
      </div>
      <div className={classes.TextGroup}>
        <h1 className={classes.RoleDesc}>{props.roleDesc}</h1>
        {peopleInvolved}
      </div>
    </div>
  );
};
export default Role;
