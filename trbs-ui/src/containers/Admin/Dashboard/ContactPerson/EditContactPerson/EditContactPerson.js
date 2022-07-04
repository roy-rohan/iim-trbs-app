import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  Radio,
  RadioGroup,
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
import * as classes from "./EditContactPerson.module.css";
import { initalValues } from "./InitialData";

class EditContactPerson extends Component {
  state = {
    initialValues: initalValues,
    contactPersonTypesDropdown: [{ key: "Select an option", value: null }],
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
      .post(
        "/contact-role/read.php",
        JSON.stringify({
          filters: [],
          filter_op: "",
          sort: [],
        })
      )
      .then((res) => {
        const fetchedRoles = [];
        for (let key in res.data) {
          fetchedRoles.push({
            value: res.data[key].contact_role_id,
            key: res.data[key].designation,
          });
        }
        this.setState({
          rolesDropdown: [...this.state.rolesDropdown, ...fetchedRoles],
        });
      });
    axios
      .get("/contact-person/read_single.php?id=" + queryParams.contactPersonId)
      .then((response) => {
        let contactPersonData = response.data;
        let updatedValues = { ...this.state.initialValues };
        for (let attr in updatedValues) {
          updatedValues[attr].value = contactPersonData[attr];
        }
        this.setState({ initalValues: updatedValues });
        this.props.stopLoading();
      })
      .catch((error) => {
        this.props.onSendMessage("Something went wrong. ", "error");
        // window.location.href = "/dashboard/contactPersonSummary";
      });
  }

  onFormSubmit(contactPerson) {
    contactPerson.preventDefault();
    let isValid = this.validate();
    if (isValid) {
      // make a request
      let contactPersonData = {};
      if (this.state.initalValues) {
        Object.keys(this.state.initalValues).forEach((key) => {
          contactPersonData[key] = this.state.initialValues[key].value;
        });
        this.submitBtnRef.current.textContent = "Submit";
        this.props.onEditContactPerson(
          contactPersonData,
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
    this.props.onSendMessage("ContactPerson Edited Successfully", "info");
    this.formRef.current.reset();
    window.location.href = "/dashboard/contactPersonSummary";
  }

  fieldChangHandler(key, contactPerson) {
    let updatedValues = this.state.initialValues;
    Object.keys(updatedValues).forEach((fieldKey) => {
      if (fieldKey === key) {
        updatedValues[fieldKey].value = contactPerson.target.value;
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
      this.state.contactPersonImageUploadSuccess &&
      this.state.contactPersonTimelineImageUploadSuccess
    ) {
      this.successHandler();
    }
    return (
      <div className={classes.EditContactPerson}>
        <MatBackdrop open={this.props.loading}></MatBackdrop>
        <div className={classes.PageHeader}>
          <h2>Edit Contact Person</h2>
        </div>
        <form ref={this.formRef} className={classes.Form}>
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.initialValues.poc.error}
            id="poc"
            name="poc"
            label="POC"
            value={this.state.initialValues.poc.value}
            onChange={(contactPerson) =>
              this.fieldChangHandler.bind(this, "poc", contactPerson)()
            }
            helperText={this.state.initialValues.poc.errorMessage}
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.initialValues.email.error}
            id="email"
            name="email"
            label="Email"
            type="email"
            value={this.state.initialValues.email.value}
            onChange={(contactPerson) =>
              this.fieldChangHandler.bind(this, "email", contactPerson)()
            }
            helperText={this.state.initialValues.email.errorMessage}
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-age-native-simple">Role</InputLabel>
            <Select
              native
              label="Role"
              inputProps={{
                name: "contact_role_id",
                id: "outlined-age-native-simple",
              }}
              value={this.state.initialValues.contact_role_id.value}
              onChange={(event) =>
                this.fieldChangHandler.bind(this, "contact_role_id", event)()
              }
              fullWidth
            >
              {[
                this.state.rolesDropdown
                  ? this.state.rolesDropdown.map((role, index) => {
                      return (
                        <option key={index} value={role.value}>
                          {role.key}
                        </option>
                      );
                    })
                  : null,
              ]}
            </Select>
          </FormControl>
          <div className={classes.Spacer}></div>
          <FormControl component="fieldset">
            <FormLabel component="legend">Visible ?</FormLabel>
            <RadioGroup
              aria-label="visible"
              name="visible"
              value={this.state.initialValues.visible.value}
              style={{ display: "flex", flexDirection: "row" }}
              onChange={(contactPerson) =>
                this.fieldChangHandler.bind(this, "visible", contactPerson)()
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
    error: state.contactPerson.error,
    categories: state.contactPerson.categories,
    loading: state.auth.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchContactPersons: () => dispatch(actions.fetchContactPersons()),
    onEditContactPerson: (contactPersonData, cb) =>
      dispatch(actions.editContactPerson(contactPersonData, cb)),
    onSendMessage: (message, messageType) =>
      dispatch(actions.sendMessage(message, messageType)),

    stopLoading: () => dispatch(actions.stopLoading()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EditContactPerson)
);
