import React, { Fragment } from "react";
import { Field, ErrorMessage } from "formik";
import TextError from "../TextError/TextError";

import classes from "./Select.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Select = (props) => {
  const { label, name, styleType, options, ...rest } = props;
  let selectContent = null;
  switch (styleType) {
    case "IconGroup":
      selectContent = (
        <div className={classes.FormControl}>
          <div className={classes.IconGroup}>
            <FontAwesomeIcon icon={props.icon} />
            <Field as="select" key={name} id={name} name={name} {...rest}>
              {options.map((option, i) => {
                return (
                  <option key={i} value={option.value}>
                    {option.key}
                  </option>
                );
              })}
            </Field>
          </div>
          <ErrorMessage component={TextError} name={name} />
        </div>
      );
      break;
    default:
      selectContent = (
        <div className={classes.FormControl}>
          <label htmlFor={name}>{label}</label>
          <Field as="select" key={name} id={name} name={name} {...rest}>
            {options.map((option, i) => {
              return (
                <option key={i} value={option.value}>
                  {option.key}
                </option>
              );
            })}
          </Field>
          <ErrorMessage component={TextError} name={name} />
        </div>
      );
  }

  return <Fragment>{selectContent}</Fragment>;
};

export default Select;
