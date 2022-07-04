import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { Send, Visibility, VisibilityOff } from "@material-ui/icons";
import clsx from "clsx";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as Yup from "yup";
import axios from "../../../../axios-iim";
import * as actions from "../../../../store/actions/index";
import classes from "./SetNewPassword.module.css";

const SetNewPassword = (props) => {
  const initialValues = {
    new_password: "",
    confirm_password: "",
  };

  useEffect(() => {
    if (localStorage.getItem("userEmailId") == null) {
      window.location.href = "/";
    }
  }, []);

  const [passwordVisibilty, setPasswordVisibilty] = React.useState({
    showNewPassword: false,
    showConfirmPassword: false,
  });
  const [isRequestSuccess, setIsRequestSuccess] = useState(false);

  const validationSchema = Yup.object({
    new_password: Yup.string().required("Required"),
    confirm_password: Yup.string().required("Required"),
  });

  const onSubmit = (values, form) => {
    if (values.new_password !== values.confirm_password) {
      props.onSendMessage(
        "New Password and Confirm password does not match.",
        "error"
      );
      form.setSubmitting(false);
      return;
    }
    form.setSubmitting(true);
    axios
      .post(
        "/users/set_new_password.php",
        JSON.stringify({
          email_id: localStorage.getItem("userEmailId"),
          password: values.new_password,
        })
      )
      .then((response) => {
        localStorage.removeItem("userEmailId");
        setIsRequestSuccess(true);
      })
      .catch((error) => {
        setIsRequestSuccess(false);
      });
  };

  const handleClickShowPassword = (type) => {
    if (type === "newPassword") {
      setPasswordVisibilty({
        ...passwordVisibilty,
        showNewPassword: !passwordVisibilty.showNewPassword,
      });
    } else {
      setPasswordVisibilty({
        ...passwordVisibilty,
        showConfirmPassword: !passwordVisibilty.showConfirmPassword,
      });
    }
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return isRequestSuccess ? (
    <div className={classes.SuccessPage}>
      <Send className={classes.SuccessIcon}></Send>
      <div className={classes.SuccessMessage}>
        <h3>Your password has been changed successfully.</h3>
        <p>Now you can login with your new password.</p>
      </div>
    </div>
  ) : (
    <div className={classes.SetNewPassword}>
      <h1>Set New Password</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formik) => (
          <Form className={classes.Form}>
            <div className={classes.MaterialUIWrapper}>
              <FormControl
                className={clsx(classes.margin, classes.textField)}
                variant="outlined"
                fullWidth
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  Enter New Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  name="new_password"
                  type={passwordVisibilty.showNewPassword ? "text" : "password"}
                  value={formik.values.new_password}
                  onChange={formik.handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() =>
                          handleClickShowPassword.bind(this, "newPassword")()
                        }
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {passwordVisibilty.showNewPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  labelWidth={70}
                />
              </FormControl>
            </div>
            <div className={classes.MaterialUIWrapper}>
              <FormControl
                className={clsx(classes.margin, classes.textField)}
                variant="outlined"
                fullWidth
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  Confirm Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  name="confirm_password"
                  type={
                    passwordVisibilty.showConfirmPassword ? "text" : "password"
                  }
                  value={formik.values.confirm_password}
                  onChange={formik.handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() =>
                          handleClickShowPassword.bind(
                            this,
                            "confirmPassword"
                          )()
                        }
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {passwordVisibilty.showConfirmPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
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
              {formik.isSubmitting && !props.hasError ? "..." : "Submit"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSendMessage: (message, type) =>
      dispatch(actions.sendMessage(message, type)),
  };
};

export default connect(null, mapDispatchToProps)(SetNewPassword);
