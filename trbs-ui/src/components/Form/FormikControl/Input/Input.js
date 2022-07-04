import React, { Fragment } from "react";
import { Field, ErrorMessage } from "formik";
import TextError from "../TextError/TextError";
import TextField from "@material-ui/core/TextField";

import classes from "./Input.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Input = (props) => {
  const { label, name, styleType, ...rest } = props;

  let inputContent = null;

  switch (styleType) {
    case "StackedLabel":
      inputContent = (
        <div className={[classes.FormControl].join(" ")}>
          <div className={classes.StackedLabel}>
            <label htmlFor={name}>{label}</label>
            <Field id={name} name={name} {...rest} />
          </div>
          <ErrorMessage component={TextError} name={name} />
        </div>
      );
      break;
    case "IconGroup":
      inputContent = (
        <div className={[classes.FormControl].join(" ")}>
          <div className={classes.IconGroup}>
            <FontAwesomeIcon icon={props.icon} />
            <Field id={name} name={name} {...rest} />
          </div>
          <ErrorMessage component={TextError} name={name} />
        </div>
      );
      break;
    case "InlineLabel":
      inputContent = (
        <div className={[classes.FormControl].join(" ")}>
          <div className={classes.InlineLabel}>
            <label htmlFor={name}>{label}</label>
            <Field id={name} name={name} {...rest} />
          </div>
          <ErrorMessage component={TextError} name={name} />
        </div>
      );
      break;
    case "MaterialDesign":
      inputContent = (
        <div className={classes.MaterialUIWrapper}>
          <TextField
            variant="outlined"
            label={label}
            name={name}
            id={name}
            className={classes.MaterialUIInput}
            {...rest}
          />
          <ErrorMessage component={TextError} name={name} />
        </div>
      );
      break;
    default:
      inputContent = (
        <div className={[classes.FormControl, classes.WithoutLabel].join(" ")}>
          <Field id={name} name={name} {...rest} />
          <ErrorMessage component={TextError} name={name} />
        </div>
      );
  }

  return <Fragment>{inputContent}</Fragment>;
};

export default Input;
