import React from "react";
import { Form, Formik } from "formik";
import clsx from "clsx";
import classes from "./LoginForm.module.css";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";

import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@material-ui/core";
import { AccountCircle, Visibility, VisibilityOff } from "@material-ui/icons";
import * as actions from "../../../store/actions/auth";
import { connect } from "react-redux";
import { NavLink, Redirect } from "react-router-dom";
import GoogleSignin from "../GoogleSignin/GoogleSignin";

const LoginForm = (props) => {
  const [values, setValues] = React.useState({
    showPassword: false,
  });

  const initialValues = {
    login_id: "",
    password: "",
  };

  const validationSchema = Yup.object({
    login_id: Yup.string().required("Required").email("Not a valid email."),
    password: Yup.string().required("Required"),
  });

  const onSubmit = (values, form) => {
    form.setSubmitting(true);
    props.onLogin(values.login_id, values.password, props.onLoginHandler);
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return props.isAuthenticated ? (
    <Redirect to={props.authRedirectPath} />
  ) : (
    <div className={classes.LoginForm}>
      <h1>Sign In</h1>
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
                  Username
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  name="login_id"
                  type="email"
                  value={formik.values.login_id}
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
            <div className={classes.MaterialUIWrapper}>
              <FormControl
                className={clsx(classes.margin, classes.textField)}
                variant="outlined"
                fullWidth
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  name="password"
                  type={values.showPassword ? "text" : "password"}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {values.showPassword ? (
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
            <div className={classes.ForgotPassword}>
              <NavLink to="/forgotPassword">Forgot Password ?</NavLink>
            </div>
          </Form>
        )}
      </Formik>
      <div>
        <GoogleSignin formName={"Login"} />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    hasError: state.auth.error !== null,
    loading: state.auth.loading,
    authRedirectPath: state.auth.authRedirectPath,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (loginId, password, cb) =>
      dispatch(actions.login(loginId, password, cb)),
    onLoginHandler: (token) => dispatch(actions.loginHandler(token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
