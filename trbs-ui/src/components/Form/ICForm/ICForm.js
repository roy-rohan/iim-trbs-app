import React, { useEffect, useRef, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import FormikControl from "../FormikControl/FormikControl";
import classes from "./ICForm.module.css";
import {
  faCity,
  faEnvelope,
  faMobile,
  faSchool,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import axios from "../../../axios-iim";
import { useToasts } from "react-toast-notifications";

const ICForm = (props) => {
  let { addToast } = useToasts();

  const [statesDropdown, setStatesDropdown] = useState([
    { key: "Select an option", value: null },
  ]);

  const [collegesDropdown, setCollegesDropdown] = useState([
    { key: "Select an option", value: null },
    { key: "Other", value: "-99" },
  ]);

  const initialValues = {
    first_name: "",
    last_name: "",
    email_id: "",
    mobile_no: "",
    state_id: null,
    college_id: null,
    event_name: props.eventName,
    college_name: null,
  };

  const validationSchema = Yup.object({
    first_name: Yup.string().required("Required"),
    last_name: Yup.string().required("Required"),
    email_id: Yup.string().required("Required").email("Not a valid email."),
    mobile_no: Yup.string().matches(
      /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/,
      "Not a valid phone number."
    ),
  });

  let submitContent = useRef();

  useEffect(() => {
    axios
      .post(
        "/colleges/read.php",
        JSON.stringify({
          filters: [],
          filter_op: "",
          sort: [],
        })
      )
      .then((res) => {
        const fetchedColleges = [];
        for (let key in res.data) {
          fetchedColleges.push({
            value: res.data[key].college_id,
            key: res.data[key].name,
          });
        }
        setCollegesDropdown((prevState) => [...prevState, ...fetchedColleges]);
      });

    axios
      .post(
        "/states/read.php",
        JSON.stringify({
          filters: [],
          filter_op: "",
          sort: [],
        })
      )
      .then((res) => {
        const fetchedStates = [];
        for (let key in res.data) {
          fetchedStates.push({
            value: res.data[key].state_id,
            key: res.data[key].name,
          });
        }
        setStatesDropdown((prevState) => [...prevState, ...fetchedStates]);
      });
  }, []);

  const onSubmit = (values, form) => {
    form.setSubmitting(true);
    submitContent.current.innerHtml = "submitting...";
    axios
      .post("/interested-users/create.php", JSON.stringify(values))
      .then((res) => {
        form.resetForm();
        props.formSubmitted();
        addToast("Will notify you once live.", {
          appearance: "success",
          autoDismiss: true,
        });
      })
      .catch((err) => {
        addToast(err.message, { appearance: "error", autoDismiss: true });
      })
      .finally(() => {
        submitContent.current.innerHtml = "Submit";
        form.setSubmitting(false);
      });
  };

  return (
    <div className={classes.FormGroup}>
      <h1 className={classes.FormHead}>Interested Candidate Form</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formik) => (
          <Form className={classes.Form}>
            <div className={classes.HFormGroup}>
              <FormikControl
                control="input"
                type="text"
                styleType="IconGroup"
                icon={faUser}
                key="first_name"
                name="first_name"
                placeholder="First Name"
              />
              <FormikControl
                control="input"
                type="text"
                styleType="IconGroup"
                icon={faUser}
                key="last_name"
                name="last_name"
                placeholder="Last Name"
              />
            </div>
            <FormikControl
              control="input"
              type="email"
              icon={faEnvelope}
              styleType="IconGroup"
              key="email_id"
              name="email_id"
              placeholder="Email ID"
            />
            <FormikControl
              control="input"
              type="text"
              icon={faMobile}
              styleType="IconGroup"
              key="mobile_no"
              name="mobile_no"
              placeholder="Mobile Number"
            />
            <FormikControl
              control="select"
              label="College"
              icon={faSchool}
              styleType="IconGroup"
              key="college_id"
              name="college_id"
              options={collegesDropdown}
            />
            {formik.values.college_id === "-99" ? (
              <FormikControl
                control="input"
                type="text"
                styleType="IconGroup"
                icon={faUser}
                key="college_name"
                name="college_name"
                placeholder="Enter your college name..."
              />
            ) : null}

            <FormikControl
              control="select"
              label="State"
              icon={faCity}
              key="state_id"
              styleType="IconGroup"
              name="state_id"
              options={statesDropdown}
            />
            <button
              ref={submitContent}
              type="submit"
              className={classes.SubmitBtn}
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default ICForm;
