import {
  Button,
  FormControl,
  InputLabel,
  Select,
  TextField
} from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import axios from "../../../../axios-iim";
import MatBackdrop from "../../../../components/UI/Backdrop/MatBackdrop/MatBackdrop";
import * as actions from "../../../../store/actions/index";
import * as classes from "./EditProfile.module.css";
import { initalValues } from "./InitialData";
import * as Yup from "yup";

class EditProfile extends Component {
  state = {
    initialValues: initalValues,
    profileTypesDropdown: [{ key: "Select an option", value: null }],
    isFormValid: true,
    collegeDropdown: [{ key: "Select an option", value: null }],
    stateDropdown: [{ key: "Select an option", value: null }],
    validationSchema: Yup.object({}),
    errorMap: {
      first_name: {
        hasError: false,
        message: ""
      },
      last_name: {
        hasError: false,
        message: ""
      }, 
      address: {
        hasError: false,
        message: ""
      },
      mobile_no: {
        hasError: false,
        message: ""
      },
      year: {
        hasError: false,
        message: ""
      }
    }
  };

  constructor() {
    super();
    this.submitBtnRef = React.createRef();
    this.formRef = React.createRef();
  }

  componentDidMount() {
    this.props.stopLoading();

    let updatedValidationSchema = Yup.object({
      first_name: Yup.string().required("Required")
        .matches(/^([a-zA-Z.]{2,30})$/, "Invalid value"),
      last_name: Yup.string().required("Required")
        .matches(/^([a-zA-Z.]{2,30})$/, "Invalid value"),
      address: Yup.string().required("Required"),
      mobile_no: Yup.string()
        .required("Required")
        .matches(/^[6-9][0-9]{9}$/, "Not a valid phone number."),
      year: Yup.number()
        .typeError('Year must be a number')
        .min(2018, "Minimum allowed Year is 2018")
        .max(2030, "Maximum allowed Year is 2030"),
    });

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
        this.setState({
          collegeDropdown: [...this.state.collegeDropdown, ...fetchedColleges],
        });
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
        this.setState({
          stateDropdown: [...this.state.stateDropdown, ...fetchedStates],
        });
      });

      let updatedValues = { ...this.state.initialValues };
      for (let attr in updatedValues) {
        updatedValues[attr].value = this.props.user[attr];
      }

      this.setState({ initalValues: updatedValues,
        validationSchema: updatedValidationSchema });
  }

  onFormSubmit(profile) {
    profile.preventDefault();
    this.validate().then(isValid => {
      if (isValid) {
        // make a request
        let profileData = {};
        if (this.state.initalValues) {
          Object.keys(this.state.initalValues).forEach((key) => {
            profileData[key] = this.state.initialValues[key].value;
          });
          this.props.onUpdateProfile(
            this.props.token,
            profileData,
            this.successHandler.bind(this)
          );
        } else {
        }
      } else {
        window.scrollTo(0, 0);
      }
      
    })
  }
  
  async validate() {
    let values = this.state.initialValues;
    let hasError = false;

    let validatableValues = {};
    Object.keys(this.state.initalValues).forEach((key) => {
      validatableValues[key] = this.state.initialValues[key].value;
    });

    try{
      await this.state.validationSchema.validate(validatableValues, { abortEarly: false });
      let updatedErrorMap = { ...this.state.errorMap };
      Object.keys(this.state.errorMap).forEach((key) => {
        updatedErrorMap[key] = {
          hasError: false,
          message: ""
        };
      });

      this.setState({
        errorMap: updatedErrorMap
      });

    }catch(err) {
      // Collect all errors in { fieldName: boolean } format:
      const errors = err.inner.reduce((acc, error) => {
        return {
          ...acc,
          [error.path]: {
            hasError: true,
            message: error.message
          }
        }
      }, {})

      let updatedErrorMap = { ...this.state.errorMap };
      Object.keys(this.state.errorMap).forEach((key) => {
        hasError = hasError || key in errors;
        updatedErrorMap[key] = {
          hasError : key in errors,
          message: key in errors ? errors[key].message : ""
        };
      });

      this.setState({
        errorMap: updatedErrorMap 
      });
    };

    Object.keys(values).forEach((key) => {
      if (values[key].required) {
        let fieldValue = values[key].value;
        if (fieldValue === null || fieldValue === "") {
          values[key].error = true;
          values[key].errorMessage = "Required";
          hasError = hasError || true;
        } else {
          values[key].error = false;
          values[key].errorMessage = "";
        }
      } else {
        values[key].error = false;
        values[key].errorMessage = "";
      }
    });
    this.setState({ initalValues: values });

    return !hasError;
  }

  successHandler() {
    this.formRef.current.reset();
    window.location.href = "/profile";
  }

  fieldChangHandler(key, profile) {
    let updatedValues = this.state.initialValues;
    Object.keys(updatedValues).forEach((fieldKey) => {
      if (fieldKey === key) {
        updatedValues[fieldKey].value = profile.target.value;
      }
    });
    this.setState({ initalValues: updatedValues });
    this.validate();
  }

  ckEditorFieldChangHandler(key, data) {
    let updatedValues = this.state.initialValues;
    Object.keys(updatedValues).forEach((fieldKey) => {
      if (fieldKey === key) {
        updatedValues[fieldKey].value = data;
      }
    });
    this.setState({ initalValues: updatedValues });
  }

  dateFieldChangeHandler(key, dateObj, value) {
    let updatedValues = this.state.initialValues;
    Object.keys(updatedValues).forEach((fieldKey) => {
      if (fieldKey === key) {
        updatedValues[fieldKey].value = dateObj;
      }
    });
    this.setState({ initalValues: updatedValues });
  }

  render() {
    if (
      this.state.profileImageUploadSuccess &&
      this.state.profileTimelineImageUploadSuccess
    ) {
      this.successHandler();
    }
    return (
      <div className={classes.EditProfile}>
        <div className={classes.PageHeader}>
          <h2>Edit Profile</h2>
        </div>
        <form ref={this.formRef} className={classes.Form}>
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.errorMap.first_name.hasError}
            id="first_name"
            name="first_name"
            label="First Name"
            value={this.state.initialValues.first_name.value}
            onChange={(profile) =>
              this.fieldChangHandler.bind(this, "first_name", profile)()
            }
            helperText={this.state.errorMap.first_name.message}
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.errorMap.last_name.hasError}
            id="last_name"
            name="last_name"
            label="Last Name"
            value={this.state.initialValues.last_name.value}
            onChange={(profile) =>
              this.fieldChangHandler.bind(this, "last_name", profile)()
            }
            helperText={this.state.errorMap.last_name.message}
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.errorMap.address.hasError}
            id="address"
            name="address"
            label="Address"
            value={this.state.initialValues.address.value}
            onChange={(profile) =>
              this.fieldChangHandler.bind(this, "address", profile)()
            }
            helperText={this.state.errorMap.address.message}
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.errorMap.mobile_no.hasError}
            id="mobile_no"
            name="mobile_no"
            label="Mobile"
            value={this.state.initialValues.mobile_no.value}
            onChange={(profile) =>
              this.fieldChangHandler.bind(this, "mobile_no", profile)()
            }
            helperText={this.state.errorMap.mobile_no.message}
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-age-native-simple">
              State
            </InputLabel>
            <Select
              native
              label="State"
              inputProps={{
                name: "state_id",
                id: "outlined-age-native-simple",
              }}
              value={this.state.initialValues.state_id.value}
              onChange={(event) =>
                this.fieldChangHandler.bind(this, "state_id", event)()
              }
              fullWidth
            >
              {[
                this.state.stateDropdown
                  ? this.state.stateDropdown.map((state, index) => {
                    return (
                      <option key={index} value={state.value}>
                        {state.key}
                      </option>
                    );
                  })
                  : null,
              ]}
            </Select>
          </FormControl>
          <div className={classes.Spacer}></div>
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-age-native-simple">
              College
            </InputLabel>
            <Select
              native
              label="College"
              inputProps={{
                name: "college_id",
                id: "outlined-age-native-simple",
              }}
              value={this.state.initialValues.college_id.value}
              onChange={(event) =>
                this.fieldChangHandler.bind(this, "college_id", event)()
              }
              fullWidth
            >
              {[
                this.state.collegeDropdown
                  ? this.state.collegeDropdown.map((college, index) => {
                      return (
                        <option key={index} value={college.value}>
                          {college.key}
                        </option>
                      );
                    })
                  : null,
              ]}
            </Select>
          </FormControl>
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.errorMap.year.hasError}
            id="year"
            name="year"
            label="Year"
            value={this.state.initialValues.year.value}
            onChange={(profile) =>
              this.fieldChangHandler.bind(this, "year", profile)()
            }
            helperText={this.state.errorMap.year.message}
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            onClick={this.onFormSubmit.bind(this)}
            ref={this.submitBtnRef}
          >
            Submit
          </Button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    user: state.auth.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateProfile: (token, userData, cb) => 
      dispatch(actions.updateUser(token, userData, cb)),
    onSendMessage: (message, messageType) =>
      dispatch(actions.sendMessage(message, messageType)),
    stopLoading: () => dispatch(actions.stopLoading()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EditProfile)
);
