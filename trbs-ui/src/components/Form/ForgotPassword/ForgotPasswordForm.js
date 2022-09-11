import {
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { AccountCircle, Send } from "@material-ui/icons";
import clsx from "clsx";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import classes from "./ForgotPasswordForm.module.css";
import axios from "../../../axios-iim";
import * as actions from "../../../store/actions/index";
import { connect } from "react-redux";

const ForgotPasswordForm = (props) => {
  const initialValues = {
    email_id: "",
  };

  const [isRequestSuccess, setIsRequestSuccess] = useState(false);

  const validationSchema = Yup.object({
    email_id: Yup.string().required("Required").email("Not a valid email."),
  });

  const onSubmit = (values, form) => {
    form.setSubmitting(true);
    axios
      .post(
        "/users/forgot_password.php",
        JSON.stringify({
          email_id: values.email_id,
        })
      )
      .then((response) => {
        form.setSubmitting(false);
        setIsRequestSuccess(true);
      })
      .catch((error) => {
        form.setSubmitting(false);
        props.onSendMessage(error.response?.data?.message, "error");
        setIsRequestSuccess(false);
      });
  };

  return isRequestSuccess ? (
    <div className={classes.SuccessPage}>
      <Send className={classes.SuccessIcon}></Send>
      <div className={classes.SuccessMessage}>
        <h3>
          You are almost there ! A Password recovery link has been sent to your
          registered Email. Please check your email
        </h3>
      </div>
    </div>
  ) : (
    <div className={classes.ForgotPasswordForm}>
      <h1>Forgot Password</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formik) => (
          <Form className={classes.Form}>
            <div className={classes.MaterialUIWrapper}>
              <FormControl
                fullWidth
                className={clsx(classes.margin, classes.textField)}
                variant="outlined"
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  Email ID
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  name="email_id"
                  type="email"
                  value={formik.values.email_id}
                  onChange={formik.handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <AccountCircle></AccountCircle>
                    </InputAdornment>
                  }
                  labelWidth={70}
                />
              </FormControl>
            </div>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.button}
              type="submit"
            >
              {formik.isSubmitting ? "..." : "Submit"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSendMessage: (message, messageType) =>
      dispatch(actions.sendMessage(message, messageType)),
  };
};

export default connect(null, mapDispatchToProps)(ForgotPasswordForm);
