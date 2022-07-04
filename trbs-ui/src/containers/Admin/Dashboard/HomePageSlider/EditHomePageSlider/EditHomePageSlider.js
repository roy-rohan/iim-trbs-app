import { Button, TextField } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import DefaultImage from "../../../../../assets/images/common/default.png";
import MatBackdrop from "../../../../../components/UI/Backdrop/MatBackdrop/MatBackdrop";
import CustomImage from "../../../../../components/UI/CustomImage/CustomImage";
import * as actions from "../../../../../store/actions/index";
import {
  updateImage,
  uploadNewImage,
} from "../../../../../utils/imageUploadUtil";
import { extractQueryParams } from "../../../../../utils/queryUtil";
import * as classes from "./EditHomePageSlider.module.css";
import { initalValues } from "./InitialData";
import axios from "../../../../../axios-iim";

class EditHomePageSlider extends Component {
  state = {
    initialValues: initalValues,
    sliderTypesDropdown: [{ key: "Select an option", value: null }],
    sliderImage: null,
    sliderTimelineImage: null,
    sliderImageFormData: new FormData(),
    sliderTimelineImageFormData: new FormData(),
    isFormValid: true,
    sliderImageUploadSuccess: false,
    sliderTimelineImageUploadSuccess: false,
    // new ones
    images: [],
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
    let queryParams = extractQueryParams(
      this.props.location.search.substring(1)
    );
    axios
      .post(
        "/images/read.php",
        JSON.stringify({
          filters: [
            {
              field_name: "image_id",
              value: queryParams.imageId,
              op: "=",
            },
          ],
          filter_op: "AND",
          sort: [],
        })
      )
      .then((response) => {
        let eventData = response.data[0];
        let updatedValues = { ...this.state.initialValues };
        updatedValues["image_url"].value = eventData["path"];
        updatedValues["order"].value = eventData["entity_id"];
        this.setState({ initalValues: updatedValues });
        this.props.stopLoading();
      })
      .catch((error) => {
        this.props.onSendMessage("Something went wrong. ", "error");
        // window.location.href = "/dashboard/sliderImageSummary";
      });
  }

  onFormSubmit(event) {
    event.preventDefault();
    let isValid = this.validate();
    if (isValid) {
      // make a request
      let sliderData = {};
      if (this.state.initialValues) {
        Object.keys(this.state.initialValues).forEach((key) => {
          sliderData[key] = this.state.initialValues[key].value;
        });
        this.submitBtnRef.current.textContent = "Submit";
        this.uploadImages.bind(this)();
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

  uploadImages() {
    if (this.state.sliderImage !== null) {
      let sliderImageformData = this.state.sliderImageFormData;
      sliderImageformData.append(
        "entity_id",
        this.state.initialValues.order.value
      );
      if (sliderImageformData.get("path") === "null") {
        uploadNewImage(sliderImageformData, () => {
          this.setState({
            ...this.state,
            sliderImageUploadSuccess: true,
          });
        });
      } else {
        updateImage(sliderImageformData, () =>
          this.setState({ ...this.state, sliderImageUploadSuccess: true })
        );
      }
    } else {
      this.setState({ ...this.state, sliderImageUploadSuccess: true });
    }
  }

  successHandler() {
    this.props.onSendMessage("HomePageSlider Edited Successfully", "info");
    this.formRef.current.reset();
    window.location.href = "/dashboard/sliderImageSummary";
  }

  fieldChangHandler(key, slider) {
    let updatedValues = this.state.initialValues;
    Object.keys(updatedValues).forEach((fieldKey) => {
      if (fieldKey === key) {
        updatedValues[fieldKey].value = slider.target.value;
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

  onHomePageSliderImageChange(slider, uploadType) {
    let selectedFile = slider.target.files[0];
    const formData = new FormData();
    formData.append("image_upload", selectedFile);
    let path =
      uploadType === "slider"
        ? this.state.initialValues.image_url.value
        : uploadType === "slider-timeline"
        ? this.state.initialValues.timeline_image_url.value
        : null;
    formData.append("path", path);
    formData.append("upload_type", uploadType);
    formData.append("entity_type", "slider");
    let updatedValues = this.state.initialValues;
    Object.keys(updatedValues).forEach((fieldKey) => {
      if (fieldKey === "image_upload") {
        updatedValues[fieldKey].value = selectedFile;
      }
    });
    var reader = new FileReader();
    reader.onloadend = this.loadImage.bind(this, reader, uploadType);
    reader.readAsDataURL(selectedFile);
    if (uploadType === "slider-timeline") {
      this.setState({
        initalValues: updatedValues,
        sliderTimelineImageFormData: formData,
      });
    } else {
      this.setState({
        initalValues: updatedValues,
        sliderImageFormData: formData,
      });
    }
  }
  changePictureHandler(type) {
    if (type === "slider-timeline") {
      this.timelineImageInputRef.current.click();
    } else {
      this.imageInputRef.current.click();
    }
  }

  loadImage(reader, uploadType) {
    let src = reader.result;
    if (uploadType === "slider-timeline") {
      this.setState({ sliderTimelineImage: src });
    } else {
      this.setState({ sliderImage: src });
    }
  }

  render() {
    if (this.state.sliderImageUploadSuccess) {
      this.successHandler();
    }
    return (
      <div className={classes.EditHomePageSlider}>
        <MatBackdrop open={this.props.loading}></MatBackdrop>
        <div className={classes.PageHeader}>
          <h2>Add Home Page Slider Image</h2>
        </div>
        <form
          ref={this.formRef}
          className={classes.Form}
          // onChange={() => this.validate.bind(this)()}
        >
          <div className={classes.HomePageSliderImageSection}>
            <div className={classes.HomePageSliderImage}>
              <CustomImage
                src={
                  this.state.sliderImage
                    ? this.state.sliderImage
                    : this.state.initialValues.image_url.value
                    ? this.state.initialValues.image_url.value
                    : DefaultImage
                }
                useCustomSrc={
                  this.state.sliderImage
                    ? true
                    : this.state.initialValues.image_url.value
                    ? false
                    : true
                }
                alt="HomePageSlider"
              />
            </div>
            <input
              type="file"
              onChange={(slider) =>
                this.onHomePageSliderImageChange.bind(this, slider, "slider")()
              }
              hidden
              ref={this.imageInputRef}
            />
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={this.changePictureHandler.bind(this, "slider")}
            >
              Change Picture
            </Button>
          </div>
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.initialValues.order.error}
            id="order"
            name="order"
            label="View Order"
            value={this.state.initialValues.order.value}
            type="number"
            onChange={(event) =>
              this.fieldChangHandler.bind(this, "order", event)()
            }
            helperText=""
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
    error: state.event.error,
    categories: state.event.categories,
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
  connect(mapStateToProps, mapDispatchToProps)(EditHomePageSlider)
);
