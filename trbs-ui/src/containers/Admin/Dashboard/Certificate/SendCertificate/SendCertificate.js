import {
    Button,
    FormControl, InputLabel, Select, TextField
} from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import MatBackdrop from "../../../../../components/UI/Backdrop/MatBackdrop/MatBackdrop";
import * as actions from "../../../../../store/actions/index";
import { certificateActions } from "../../../../../utils/certificateActions";
import { initalValues } from "./initialValues";
import * as classes from "./SendCertificate.module.css";

class SendCertificate extends Component {
  state = {
    initialValues: initalValues,
    categoryDropdown: [{ key: "Select an option", value: null }],
    certificateDropdown: [{ key: "Select an option", value: null }],
    isFormValid: true,
  };

  constructor() {
    super();
    this.submitBtnRef = React.createRef();
    this.formRef = React.createRef();
  }

  componentDidMount() {
    this.props.stopLoading();
    let modifiedCertificateTypeDropdown = [...this.state.categoryDropdown];
    for (let key in certificateActions) {
        modifiedCertificateTypeDropdown.push({
            key: key,
            value: certificateActions[key]
        });
    }
    this.props.onFetchCertificates(
        "all_certificates",
        JSON.stringify({
            filters: [],
            filter_op: "",
            sort: [],
        })
    );

    this.setState({
        categoryDropdown: modifiedCertificateTypeDropdown
    });
  }

  onFormSubmit(certificateData) {
    certificateData.preventDefault();
    this.submitBtnRef.current.textContent = "Please wait...";
    let isValid = this.validate();
    if (isValid) {
      // make a request
      let contactPersonData = {};
      if (this.state.initalValues) {
        Object.keys(this.state.initalValues).forEach((key) => {
          contactPersonData[key] = this.state.initialValues[key].value;
        });
        this.submitBtnRef.current.textContent = "Submit";
        console.log(certificateData);

        this.props.onSendCertificate(
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
    this.props.onSendMessage("Certificate(s) Sent Successfully", "info");
    this.formRef.current.reset();
    window.location.href = "/dashboard/certificateSummary";
  }

  fieldChangHandler(key, contactPerson) {
    let updatedValues = this.state.initialValues;
    Object.keys(updatedValues).forEach((fieldKey) => {
      if (fieldKey === key) {
        console.log(fieldKey)
        updatedValues[fieldKey].value = contactPerson.target.value;
        console.log(updatedValues)
      }
    });
    this.setState({ initalValues: updatedValues });
  }

  onEmailInput(data) {
    let value = data.target.value;
    let emails = value ? value.split(",").map(v => v.trim()) : [];
    let updatedValues = this.state.initialValues;
    updatedValues.emails.value = [...emails];
    console.log(emails);
    this.setState({
        initalValues: updatedValues
    });
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
    let certificates = this.props.certificates && this.props.certificates["all_certificates"]
    ? this.props.certificates["all_certificates"].map((certificate, index) => {
    return <option key={index} value={certificate.certificate_id}>{certificate.name}</option>}):[];
    
    return (
      <div className={classes.SendCertificate}>
        <MatBackdrop open={this.props.loading}></MatBackdrop>
        <div className={classes.PageHeader}>
          <h2>Send Certificates</h2>
        </div>
        <form
          ref={this.formRef}
          className={classes.Form}
          onChange={() => this.validate.bind(this)()}
        >
          <div className={classes.Spacer}></div>
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-age-native-simple">Certificate Name</InputLabel>
            <Select
              native
              label="Certificate Name"
              inputProps={{
                name: "certificate_id",
                id: "outlined-age-native-simple",
              }}
              onChange={(event) =>
                this.fieldChangHandler.bind(this, "certificate_id", event)()
              }
              fullWidth
            >
              {[
                <option selected value={null}>Select a Certificate</option>,
                ...(certificates || [])
              ]}
            </Select>
          </FormControl>
          <div className={classes.Spacer}></div>
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-age-native-simple">Category</InputLabel>
            <Select
              native
              label = "Category"
              inputProps={{
                name: "category",
                id: "outlined-age-native-simple",
              }}
              onChange={(event) =>
                this.fieldChangHandler.bind(this, "category", event)()
              }
              fullWidth
            >
              {[
                ...this.state.categoryDropdown.map((category, index) => {
                    return <option key={index} value={category.key}>{category.value}</option>
                })
              ]}
            </Select>
          </FormControl>
          {
            this.state.initialValues.category.value === "SEND_BY_USER_EMAIL" ? 
            <><div className={classes.Spacer}></div>
           <TextField
            error={this.state.initialValues.emails.error}
            id = "emails"
            name = "emails"
            label="Emails"
            type="text"
            onChange={(emails) =>
              this.onEmailInput.bind(this, emails)()
            }
            variant="outlined"
            fullWidth
          /></> : null
          }
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
    certificates: state.certificate.certificates,
    loading: state.auth.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchCertificates: (category, queryCriteria) => dispatch(actions.fetchCertificates(category, queryCriteria)),
    onSendCertificate: (sendCertificateData, cb) =>
      dispatch(actions.sendCertificates(sendCertificateData, cb)),
    onSendMessage: (message, messageType) =>
      dispatch(actions.sendMessage(message, messageType)),
    stopLoading: () => dispatch(actions.stopLoading()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SendCertificate);
