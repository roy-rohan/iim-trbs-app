import {
  Button,
  FormControl,
  InputLabel,
  Select,
  TextField,
} from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import MatBackdrop from "../../../../../components/UI/Backdrop/MatBackdrop/MatBackdrop";
import * as actions from "../../../../../store/actions/index";
import * as classes from "./AddStrategizer.module.css";
import { initalValues } from "./InitialData";
import axios from "../../../../../axios-iim";

class AddStrategizer extends Component {
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
  }

  onFormSubmit(strategizer) {
    strategizer.preventDefault();
    this.submitBtnRef.current.textContent = "Please wait...";
    let isValid = this.validate();
    if (isValid) {
      // make a request
      let strategizerData = {};
      if (this.state.initalValues) {
        Object.keys(this.state.initalValues).forEach((key) => {
          strategizerData[key] = this.state.initialValues[key].value;
        });
        this.submitBtnRef.current.textContent = "Submit";
        this.props.onAddStrategizer(
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
    this.props.onSendMessage("Strategizer Added Successfully", "info");
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
    return (
      <div className={classes.AddStrategizer}>
        <MatBackdrop open={this.props.loading}></MatBackdrop>
        <div className={classes.PageHeader}>
          <h2>Add Strategizer</h2>
        </div>
        <form
          ref={this.formRef}
          className={classes.Form}
          onChange={() => this.validate.bind(this)()}
        >
          <TextField
            error={this.state.initialValues.name.error}
            id="name"
            name="name"
            label="Name"
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
    loading: state.auth.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAddStrategizer: (strategizerData, cb) =>
      dispatch(actions.addStrategizer(strategizerData, cb)),
    onSendMessage: (message, messageType) =>
      dispatch(actions.sendMessage(message, messageType)),
    stopLoading: () => dispatch(actions.stopLoading()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddStrategizer);
