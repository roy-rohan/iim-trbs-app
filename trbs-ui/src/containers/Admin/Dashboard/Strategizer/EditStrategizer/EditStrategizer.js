import {
  Button,
  FormControl,
  InputLabel,
  Select,
  TextField,
} from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import axios from "../../../../../axios-iim";
import MatBackdrop from "../../../../../components/UI/Backdrop/MatBackdrop/MatBackdrop";
import * as actions from "../../../../../store/actions/index";
import { extractQueryParams } from "../../../../../utils/queryUtil";
import * as classes from "./EditStrategizer.module.css";
import { initalValues } from "./InitialData";

class EditStrategizer extends Component {
  state = {
    initialValues: initalValues,
    strategizerTypesDropdown: [{ key: "Select an option", value: null }],
    isFormValid: true,
    collegeDropdown: [{ key: "Select an option", value: null }],
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
      .get("/strategizer/read_single.php?id=" + queryParams.strategizerId)
      .then((response) => {
        let strategizerData = response.data;
        let updatedValues = { ...this.state.initialValues };
        for (let attr in updatedValues) {
          updatedValues[attr].value = strategizerData[attr];
        }
        this.setState({ initalValues: updatedValues });
        this.props.stopLoading();
      })
      .catch((error) => {
        this.props.onSendMessage("Something went wrong. ", "error");
        // window.location.href = "/dashboard/strategizerSummary";
      });
  }

  onFormSubmit(strategizer) {
    strategizer.preventDefault();
    let isValid = this.validate();
    if (isValid) {
      // make a request
      let strategizerData = {};
      if (this.state.initalValues) {
        Object.keys(this.state.initalValues).forEach((key) => {
          strategizerData[key] = this.state.initialValues[key].value;
        });
        this.submitBtnRef.current.textContent = "Submit";
        this.props.onEditStrategizer(
          strategizerData,
          this.successHandler.bind(this)
        );
      } else {
        this.submitBtnRef.current.textContent = "Submit";
      }
    } else {
      window.scrollTo(0, 0);
    }
    this.submitBtnRef.current.textContent = "Submit";
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
    this.props.onSendMessage("Strategizer Edited Successfully", "info");
    this.formRef.current.reset();
    window.location.href = "/dashboard/strategizerSummary";
  }

  fieldChangHandler(key, strategizer) {
    let updatedValues = this.state.initialValues;
    Object.keys(updatedValues).forEach((fieldKey) => {
      if (fieldKey === key) {
        updatedValues[fieldKey].value = strategizer.target.value;
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
      this.state.strategizerImageUploadSuccess &&
      this.state.strategizerTimelineImageUploadSuccess
    ) {
      this.successHandler();
    }
    return (
      <div className={classes.EditStrategizer}>
        <MatBackdrop open={this.props.loading}></MatBackdrop>
        <div className={classes.PageHeader}>
          <h2>Edit Strategizer</h2>
        </div>
        <form ref={this.formRef} className={classes.Form}>
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.initialValues.name.error}
            id="name"
            name="name"
            label="Name"
            value={this.state.initialValues.name.value}
            onChange={(strategizer) =>
              this.fieldChangHandler.bind(this, "name", strategizer)()
            }
            helperText={this.state.initialValues.name.errorMessage}
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-age-native-simple">
              Strategizer Type
            </InputLabel>
            <Select
              native
              label="Strategizer Type"
              inputProps={{
                name: "type",
                id: "outlined-age-native-simple",
              }}
              value={this.state.initialValues.type.value}
              onChange={(event) =>
                this.fieldChangHandler.bind(this, "type", event)()
              }
              fullWidth
            >
              {[
                <option value={null}>Select an option</option>,
                <option value="overall">Overall</option>,
                <option value="weekly">Weekly</option>,
              ]}
            </Select>
          </FormControl>
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.initialValues.score.error}
            id="score"
            name="score"
            label="Score"
            type="number"
            value={this.state.initialValues.score.value}
            onChange={(strategizer) =>
              this.fieldChangHandler.bind(this, "score", strategizer)()
            }
            helperText={this.state.initialValues.score.errorMessage}
            variant="outlined"
            fullWidth
          />
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
    error: state.strategizer.error,
    categories: state.strategizer.categories,
    loading: state.auth.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchStrategizers: () => dispatch(actions.fetchStrategizers()),
    onEditStrategizer: (strategizerData, cb) =>
      dispatch(actions.editStrategizer(strategizerData, cb)),
    onSendMessage: (message, messageType) =>
      dispatch(actions.sendMessage(message, messageType)),

    stopLoading: () => dispatch(actions.stopLoading()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EditStrategizer)
);
