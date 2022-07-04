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
import DefaultImage from "../../../../../assets/images/common/default.png";
import MatBackdrop from "../../../../../components/UI/Backdrop/MatBackdrop/MatBackdrop";
import CustomImage from "../../../../../components/UI/CustomImage/CustomImage";
import * as actions from "../../../../../store/actions/index";
import { uploadNewImage } from "../../../../../utils/imageUploadUtil";
import * as classes from "./AddSponser.module.css";
import { initalValues } from "./InitialData";

class AddSponser extends Component {
  state = {
    initialValues: initalValues,
    sponserTypesDropdown: [{ key: "Select an option", value: null }],
    sponserImage: null,
    sponserTimelineImage: null,
    sponserImageFormData: new FormData(),
    sponserTimelineImageFormData: new FormData(),
    isFormValid: true,
    sponserImageUploadSuccess: false,
    sponserTimelineImageUploadSuccess: false,
  };

  constructor() {
    super();
    this.submitBtnRef = React.createRef();
    this.imageInputRef = React.createRef();
    this.timelineImageInputRef = React.createRef();
    this.formRef = React.createRef();
  }

  componentDidMount() {
    this.props.stopLoading();
  }

  onFormSubmit(sponser) {
    sponser.preventDefault();
    this.submitBtnRef.current.textContent = "Please wait...";
    let isValid = this.validate();
    if (isValid) {
      // make a request
      let sponserData = {};
      if (this.state.initalValues) {
        Object.keys(this.state.initalValues).forEach((key) => {
          sponserData[key] = this.state.initialValues[key].value;
        });
        this.submitBtnRef.current.textContent = "Submit";
        this.props.onAddSponser(sponserData, this.uploadImages.bind(this));
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

  uploadImages(sponserId) {
    if (this.state.sponserImage !== null) {
      let sponserImageformData = this.state.sponserImageFormData;
      sponserImageformData.append("entity_id", sponserId);
      uploadNewImage(sponserImageformData, () =>
        this.setState({ ...this.state, sponserImageUploadSuccess: true })
      );
    } else {
      this.setState({ ...this.state, sponserImageUploadSuccess: true });
    }
    if (this.state.sponserTimelineImage !== null) {
      let timelineSponserImageformData =
        this.state.sponserTimelineImageFormData;
      timelineSponserImageformData.append("entity_id", sponserId);
      uploadNewImage(timelineSponserImageformData, () =>
        this.setState({
          ...this.state,
          sponserTimelineImageUploadSuccess: true,
        })
      );
    } else {
      this.setState({
        ...this.state,
        sponserTimelineImageUploadSuccess: true,
      });
    }
  }

  successHandler() {
    this.props.onSendMessage("Sponser Added Successfully", "info");
    this.formRef.current.reset();
    window.location.href = "/dashboard/sponserSummary";
  }

  fieldChangHandler(key, sponser) {
    let updatedValues = this.state.initialValues;
    Object.keys(updatedValues).forEach((fieldKey) => {
      if (fieldKey === key) {
        updatedValues[fieldKey].value = sponser.target.value;
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

  onSponserImageChange(sponser, uploadType) {
    let selectedFile = sponser.target.files[0];
    const formData = new FormData();
    formData.append("image_upload", selectedFile);
    formData.append("upload_type", uploadType);
    formData.append("entity_type", "sponser");
    let updatedValues = this.state.initialValues;
    Object.keys(updatedValues).forEach((fieldKey) => {
      if (fieldKey === "image_upload") {
        updatedValues[fieldKey].value = selectedFile;
      }
    });
    var reader = new FileReader();
    reader.onloadend = this.loadImage.bind(this, reader, uploadType);
    reader.readAsDataURL(selectedFile);
    if (uploadType === "sponser-timeline") {
      this.setState({
        initalValues: updatedValues,
        sponserTimelineImageFormData: formData,
      });
    } else {
      this.setState({
        initalValues: updatedValues,
        sponserImageFormData: formData,
      });
    }
  }
  changePictureHandler(type) {
    if (type === "sponser-timeline") {
      this.timelineImageInputRef.current.click();
    } else {
      this.imageInputRef.current.click();
    }
  }

  loadImage(reader, uploadType) {
    let src = reader.result;
    if (uploadType === "sponser-timeline") {
      this.setState({ sponserTimelineImage: src });
    } else {
      this.setState({ sponserImage: src });
    }
  }

  render() {
    if (this.state.sponserImageUploadSuccess) {
      this.successHandler();
    }
    return (
      <div className={classes.AddSponser}>
        <MatBackdrop open={this.props.loading}></MatBackdrop>
        <div className={classes.PageHeader}>
          <h2>Add Sponser</h2>
        </div>
        <form
          ref={this.formRef}
          className={classes.Form}
          onChange={() => this.validate.bind(this)()}
        >
          <div className={classes.SponserImageSection}>
            <div className={classes.SponserImage}>
              <CustomImage
                src={
                  this.state.sponserImage
                    ? this.state.sponserImage
                    : DefaultImage
                }
                useCustomSrc={true}
                alt="Sponser"
              />
            </div>
            <input
              type="file"
              onChange={(sponser) =>
                this.onSponserImageChange.bind(this, sponser, "sponser")()
              }
              hidden
              ref={this.imageInputRef}
            />
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={this.changePictureHandler.bind(this, "sponser")}
            >
              Change Picture
            </Button>
          </div>
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.initialValues.title.error}
            id="title"
            name="title"
            label="Name"
            onChange={(sponser) =>
              this.fieldChangHandler.bind(this, "title", sponser)()
            }
            helperText={this.state.initialValues.title.errorMessage}
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.initialValues.link.error}
            id="link"
            name="link"
            label="Sponser Link"
            onChange={(sponser) =>
              this.fieldChangHandler.bind(this, "link", sponser)()
            }
            helperText={this.state.initialValues.link.errorMessage}
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-age-native-simple">
              Sponser Type
            </InputLabel>
            <Select
              native
              label="Sponser Type"
              inputProps={{
                name: "type",
                id: "outlined-age-native-simple",
              }}
              onChange={(event) =>
                this.fieldChangHandler.bind(this, "type", event)()
              }
              fullWidth
            >
              {this.props.categories ? (
                [
                  <option value={null}>Select an option</option>,
                  ...this.props.categories.map((option, i) => {
                    return (
                      <option key={i} value={option}>
                        {option}
                      </option>
                    );
                  }),
                  <option value="NEW">Add New Type</option>,
                ]
              ) : (
                <option value="NEW">Add New Type</option>
              )}
            </Select>
          </FormControl>
          <div className={classes.Spacer}></div>
          {this.state.initialValues.type.value === "NEW" ? (
            <TextField
              error={this.state.initialValues.new_type.error}
              id="new_type"
              name="new_type"
              label="New Sponser Type"
              onChange={(event) =>
                this.fieldChangHandler.bind(this, "new_type", event)()
              }
              helperText=""
              variant="outlined"
              fullWidth
            />
          ) : null}
          <div className={classes.Spacer}></div>
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-age-native-simple">
              Logo Size
            </InputLabel>
            <Select
              native
              label="Logo Size"
              inputProps={{
                name: "size",
                id: "outlined-age-native-simple",
              }}
              onChange={(event) =>
                this.fieldChangHandler.bind(this, "size", event)()
              }
              fullWidth
            >
              {[
                <option value={null}>Select an option</option>,
                <option selected value="small">
                  Small
                </option>,
                <option value="medium">Medium</option>,
                <option value="large">Large</option>,
              ]}
            </Select>
          </FormControl>
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.initialValues.view_order.error}
            id="view_order"
            name="view_order"
            label="View Order"
            type="number"
            onChange={(sponser) =>
              this.fieldChangHandler.bind(this, "view_order", sponser)()
            }
            helperText=""
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <FormControl component="fieldset">
            <FormLabel component="legend">Visible ?</FormLabel>
            <RadioGroup
              aria-label="visible"
              name="visible"
              style={{ display: "flex", flexDirection: "row" }}
              onChange={(sponser) =>
                this.fieldChangHandler.bind(this, "visible", sponser)()
              }
            >
              <FormControlLabel value="1" control={<Radio />} label="Yes" />
              <FormControlLabel value="0" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
          <div className={classes.Spacer}></div>
          <FormControl component="fieldset">
            <FormLabel component="legend">Show in Home Page ?</FormLabel>
            <RadioGroup
              aria-label="show_in_home_page"
              name="show_in_home_page"
              style={{ display: "flex", flexDirection: "row" }}
              onChange={(sponser) =>
                this.fieldChangHandler.bind(
                  this,
                  "show_in_home_page",
                  sponser
                )()
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
    error: state.sponser.error,
    categories: state.sponser.categories,
    loading: state.auth.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchCategories: () => dispatch(actions.fetchSponserCategories()),
    onAddSponser: (sponserData, cb) =>
      dispatch(actions.addSponser(sponserData, cb)),
    onSendMessage: (message, messageType) =>
      dispatch(actions.sendMessage(message, messageType)),
    stopLoading: () => dispatch(actions.stopLoading()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddSponser);
