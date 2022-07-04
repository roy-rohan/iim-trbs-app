import { Button, TextField } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import MatBackdrop from "../../../../../components/UI/Backdrop/MatBackdrop/MatBackdrop";
import * as actions from "../../../../../store/actions/index";
import * as classes from "./AddContactRole.module.css";
import { initalValues } from "./InitialData";

class AddContactRole extends Component {
  state = {
    initialValues: initalValues,
    contactRoleTypesDropdown: [{ key: "Select an option", value: null }],
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
  }

  onFormSubmit(contactRole) {
    contactRole.preventDefault();
    this.submitBtnRef.current.textContent = "Please wait...";
    let isValid = this.validate();
    if (isValid) {
      // make a request
      let contactRoleData = {};
      if (this.state.initalValues) {
        Object.keys(this.state.initalValues).forEach((key) => {
          contactRoleData[key] = this.state.initialValues[key].value;
        });
        this.submitBtnRef.current.textContent = "Submit";
        this.props.onAddContactRole(
          contactRoleData,
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
    this.props.onSendMessage("ContactRole Added Successfully", "info");
    this.formRef.current.reset();
    window.location.href = "/dashboard/contactRoleSummary";
  }

  fieldChangHandler(key, contactRole) {
    let updatedValues = this.state.initialValues;
    Object.keys(updatedValues).forEach((fieldKey) => {
      if (fieldKey === key) {
        updatedValues[fieldKey].value = contactRole.target.value;
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
      <div className={classes.AddContactRole}>
        <MatBackdrop open={this.props.loading}></MatBackdrop>
        <div className={classes.PageHeader}>
          <h2>Add Contact Role</h2>
        </div>
        <form
          ref={this.formRef}
          className={classes.Form}
          onChange={() => this.validate.bind(this)()}
        >
          <TextField
            error={this.state.initialValues.designation.error}
            id="designation"
            name="designation"
            label="Role"
            onChange={(contactRole) =>
              this.fieldChangHandler.bind(this, "designation", contactRole)()
            }
            helperText={this.state.initialValues.designation.errorMessage}
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
    error: state.contactPerson.error,
    loading: state.auth.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAddContactRole: (contactRoleData, cb) =>
      dispatch(actions.addContactRole(contactRoleData, cb)),
    onSendMessage: (message, messageType) =>
      dispatch(actions.sendMessage(message, messageType)),
    stopLoading: () => dispatch(actions.stopLoading()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddContactRole);
