import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import axios from "../../../../../axios-iim";
import MatBackdrop from "../../../../../components/UI/Backdrop/MatBackdrop/MatBackdrop";
import * as actions from "../../../../../store/actions/index";
import { extractQueryParams } from "../../../../../utils/queryUtil";
import * as classes from "./EditCollege.module.css";
import { initalValues } from "./InitialData";

class EditCollege extends Component {
  state = {
    initialValues: initalValues,
    collegeTypesDropdown: [{ key: "Select an option", value: null }],
    isFormValid: true,
    rolesDropdown: [{ key: "Select an option", value: null }],
  };

  constructor() {
    super();
    this.submitBtnRef = React.createRef();
    this.formRef = React.createRef();
  }

  componentDidMount() {
    this.props.stopLoading();
    let queryParams = extractQueryParams(
      this.props.location.search.substring(1)
    );
    this.props.stopLoading();
    axios
      .get("/colleges/read_single.php?id=" + queryParams.collegeId)
      .then((response) => {
        let collegeData = response.data;
        let updatedValues = { ...this.state.initialValues };
        for (let attr in updatedValues) {
          updatedValues[attr].value = collegeData[attr];
        }
        this.setState({ initalValues: updatedValues });
        this.props.stopLoading();
      })
      .catch((error) => {
        this.props.onSendMessage("Something went wrong. ", "error");
        // window.location.href = "/dashboard/collegeSummary";
      });
  }

  onFormSubmit(college) {
    college.preventDefault();
    let isValid = this.validate();
    if (isValid) {
      // make a request
      let collegeData = {};
      if (this.state.initalValues) {
        Object.keys(this.state.initalValues).forEach((key) => {
          collegeData[key] = this.state.initialValues[key].value;
        });
        this.submitBtnRef.current.textContent = "Submit";
        this.ediCollege(collegeData, this.successHandler.bind(this));
      } else {
        this.submitBtnRef.current.textContent = "Submit";
      }
    } else {
      window.scrollTo(0, 0);
    }
    this.submitBtnRef.current.textContent = "Submit";
  }

  ediCollege(college, cb) {
    let collegeData = {
      college_id: +college.college_id,
      name: college.name,
      is_active: +college.is_active,
    };
    axios
      .post("/colleges/update.php", JSON.stringify(collegeData))
      .then((response) => {
        console.log(response);
        cb();
      })
      .catch((error) => {
        this.props.onSendMessage("Something went wrong", "error");
      });
  }

  validate() {
    let values = this.state.initialValues;
    let isValid = true;
    Object.keys(values).forEach((key) => {
      if (values[key].required) {
        let fieldValue = values[key].value;
        if (fieldValue === null || fieldValue === "") {
          values[key].error = true;
          values[key].errorMessage = "Required";
          isValid = false;
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
    return isValid;
  }

  successHandler() {
    this.props.onSendMessage("College Edited Successfully", "info");
    this.formRef.current.reset();
    window.location.href = "/dashboard/collegesSummary";
  }

  fieldChangHandler(key, college) {
    let updatedValues = this.state.initialValues;
    Object.keys(updatedValues).forEach((fieldKey) => {
      if (fieldKey === key) {
        updatedValues[fieldKey].value = college.target.value;
      }
    });
    this.setState({ initalValues: updatedValues });
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
      this.state.collegeImageUploadSuccess &&
      this.state.collegeTimelineImageUploadSuccess
    ) {
      this.successHandler();
    }
    return (
      <div className={classes.EditCollege}>
        <MatBackdrop open={this.props.loading}></MatBackdrop>
        <div className={classes.PageHeader}>
          <h2>Edit College</h2>
        </div>
        <form ref={this.formRef} className={classes.Form}>
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.initialValues.name.error}
            id="name"
            name="name"
            label="Name"
            value={this.state.initialValues.name.value}
            onChange={(college) =>
              this.fieldChangHandler.bind(this, "name", college)()
            }
            helperText={this.state.initialValues.name.errorMessage}
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <FormControl component="fieldset">
            <FormLabel component="legend">Visible ?</FormLabel>
            <RadioGroup
              aria-label="is_active"
              name="is_active"
              value={this.state.initialValues.is_active.value}
              style={{ display: "flex", flexDirection: "row" }}
              onChange={(contactPerson) =>
                this.fieldChangHandler.bind(this, "is_active", contactPerson)()
              }
            >
              <FormControlLabel value="1" control={<Radio />} label="Yes" />
              <FormControlLabel value="0" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
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
    loading: state.auth.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    stopLoading: () => dispatch(actions.stopLoading()),
    onSendMessage: (message, messageType) =>
      dispatch(actions.sendMessage(message, messageType)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EditCollege)
);
