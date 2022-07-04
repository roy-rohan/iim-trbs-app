import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Button, FormControl, TextField } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import axios from "../../../../axios-iim";
import MatBackdrop from "../../../../components/UI/Backdrop/MatBackdrop/MatBackdrop";
import * as actions from "../../../../store/actions/index";
import * as classes from "./EditHomePage.module.css";
import { initalValues } from "./InitialData";

class EditHomePage extends Component {
  state = {
    initialValues: initalValues,
    homePageTypesDropdown: [{ key: "Select an option", value: null }],
    homePageImage: null,
    homePageTimelineImage: null,
    homePageImageFormData: new FormData(),
    homePageTimelineImageFormData: new FormData(),
    isFormValid: true,
    homePageImageUploadSuccess: false,
    homePageTimelineImageUploadSuccess: false,
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
    axios
      .post("/content/home-page/read-single.php")
      .then((response) => {
        let homePageData = response.data;
        let updatedValues = { ...this.state.initialValues };
        for (let attr in updatedValues) {
          updatedValues[attr].value = homePageData[attr];
        }
        this.setState({ initalValues: updatedValues });
        this.props.stopLoading();
      })
      .catch((error) => {
        this.props.onSendMessage("Something went wrong. ", "error");
        // window.location.href = "/dashboard/homePageSummary";
      });
  }

  onFormSubmit(event) {
    event.preventDefault();
    // this.submitBtnRef.current.textContent = "Please wait...";
    let isValid = this.validate();
    if (isValid) {
      // make a request
      let homePageData = {};
      if (this.state.initialValues) {
        Object.keys(this.state.initialValues).forEach((key) => {
          homePageData[key] = this.state.initialValues[key].value;
        });
        this.submitBtnRef.current.textContent = "Submit";
        this.props.onEditHomePage(homePageData, this.successHandler.bind(this));
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
    // if (this.state.homePageImage !== null) {
    //   let homePageImageformData = this.state.homePageImageFormData;
    //   homePageImageformData.append(
    //     "entity_id",
    //     this.state.initialValues.home_page_id.value
    //   );
    //   if (homePageImageformData.get("path") === "null") {
    //     uploadNewImage(homePageImageformData, () => {
    //       this.setState({
    //         ...this.state,
    //         homePageImageUploadSuccess: true,
    //       });
    //     });
    //   } else {
    //     updateImage(homePageImageformData, () =>
    //       this.setState({ ...this.state, homePageImageUploadSuccess: true })
    //     );
    //   }
    // } else {
    //   this.setState({ ...this.state, homePageImageUploadSuccess: true });
    // }
    // if (this.state.homePageTimelineImage !== null) {
    //   let timelineEventImageformData = this.state.homePageTimelineImageFormData;
    //   timelineEventImageformData.append(
    //     "entity_id",
    //     this.state.initialValues.homePage_id.value
    //   );
    //   if (timelineEventImageformData.get("path") === "null") {
    //     // image was not presenthomePage when added, now being added first time
    //     uploadNewImage(timelineEventImageformData, () => {
    //       this.setState({
    //         ...this.state,
    //         homePageTimelineImageUploadSuccess: true,
    //       });
    //     });
    //   } else {
    //     updateImage(timelineEventImageformData, () =>
    //       this.setState({
    //         ...this.state,
    //         homePageTimelineImageUploadSuccess: true,
    //       })
    //     );
    //   }
    // } else {
    // this.setState({
    //   ...this.state,
    //   homePageTimelineImageUploadSuccess: true,
    // });
    // }
  }

  successHandler() {
    this.props.onSendMessage("Home Page Content Edited Successfully", "info");
    this.formRef.current.reset();
    window.location.href = "/";
  }

  fieldChangHandler(key, homePage) {
    let updatedValues = this.state.initialValues;
    Object.keys(updatedValues).forEach((fieldKey) => {
      if (fieldKey === key) {
        updatedValues[fieldKey].value = homePage.target.value;
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

  onEventImageChange(homePage, uploadType) {
    let selectedFile = homePage.target.files[0];
    const formData = new FormData();
    formData.append("image_upload", selectedFile);
    let path =
      uploadType === "homePage"
        ? this.state.initialValues.image_url.value
        : uploadType === "homePage-timeline"
        ? this.state.initialValues.timeline_image_url.value
        : null;
    formData.append("path", path);
    formData.append("upload_type", uploadType);
    formData.append("entity_type", "homePage");
    let updatedValues = this.state.initialValues;
    Object.keys(updatedValues).forEach((fieldKey) => {
      if (fieldKey === "image_upload") {
        updatedValues[fieldKey].value = selectedFile;
      }
    });
    var reader = new FileReader();
    reader.onloadend = this.loadImage.bind(this, reader, uploadType);
    reader.readAsDataURL(selectedFile);
    if (uploadType === "homePage-timeline") {
      this.setState({
        initalValues: updatedValues,
        homePageTimelineImageFormData: formData,
      });
    } else {
      this.setState({
        initalValues: updatedValues,
        homePageImageFormData: formData,
      });
    }
  }
  changePictureHandler(type) {
    if (type === "homePage-timeline") {
      this.timelineImageInputRef.current.click();
    } else {
      this.imageInputRef.current.click();
    }
  }

  loadImage(reader, uploadType) {
    let src = reader.result;
    if (uploadType === "homePage-timeline") {
      this.setState({ homePageTimelineImage: src });
    } else {
      this.setState({ homePageImage: src });
    }
  }

  render() {
    return (
      <div className={classes.EditHomePage}>
        <MatBackdrop open={this.props.loading}></MatBackdrop>
        <div className={classes.PageHeader}>
          <h2>Edit Home Page</h2>
        </div>
        <form
          ref={this.formRef}
          className={classes.Form}
          // onChange={() => this.validate.bind(this)()}
        >
          <TextField
            error={this.state.initialValues.video_link.error}
            id="video_link"
            name="video_link"
            label="Video Link"
            value={this.state.initialValues.video_link.value}
            onChange={(homePage) =>
              this.fieldChangHandler.bind(this, "video_link", homePage)()
            }
            helperText={this.state.initialValues.video_link.errorMessage}
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.initialValues.event_count.error}
            id="event_count"
            name="event_count"
            label="Event Count"
            type="number"
            value={this.state.initialValues.event_count.value}
            onChange={(homePage) =>
              this.fieldChangHandler.bind(this, "event_count", homePage)()
            }
            helperText={this.state.initialValues.event_count.errorMessage}
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.initialValues.workshop_count.error}
            id="workshop_count"
            name="workshop_count"
            label="Workshop Count"
            type="number"
            value={this.state.initialValues.workshop_count.value}
            onChange={(homePage) =>
              this.fieldChangHandler.bind(this, "workshop_count", homePage)()
            }
            helperText={this.state.initialValues.workshop_count.errorMessage}
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.initialValues.speaker_count.error}
            id="speaker_count"
            name="speaker_count"
            label="Speaker Count"
            type="number"
            value={this.state.initialValues.speaker_count.value}
            onChange={(homePage) =>
              this.fieldChangHandler.bind(this, "speaker_count", homePage)()
            }
            helperText={this.state.initialValues.speaker_count.errorMessage}
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.initialValues.panel_disc_count.error}
            id="panel_disc_count"
            name="panel_disc_count"
            label="Panel Discussions Count"
            type="number"
            value={this.state.initialValues.panel_disc_count.value}
            onChange={(homePage) =>
              this.fieldChangHandler.bind(this, "panel_disc_count", homePage)()
            }
            helperText={this.state.initialValues.panel_disc_count.errorMessage}
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.initialValues.mng_symp_count.error}
            id="mng_symp_count"
            name="mng_symp_count"
            label="Management Symposium Count"
            type="number"
            value={this.state.initialValues.mng_symp_count.value}
            onChange={(homePage) =>
              this.fieldChangHandler.bind(this, "mng_symp_count", homePage)()
            }
            helperText={this.state.initialValues.mng_symp_count.errorMessage}
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <FormControl fullWidth>
            <p className={classes.InputLabel}>About</p>
            <CKEditor
              editor={ClassicEditor}
              data={this.state.initialValues.about.value}
              onInit={(editor) => {}}
              onChange={(homePage, editor) =>
                this.ckEditorFieldChangHandler.bind(
                  this,
                  "about",
                  editor.getData()
                )()
              }
            ></CKEditor>
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
    onEditHomePage: (homePageData, cb) =>
      dispatch(actions.editHomePage(homePageData, cb)),
    onSendMessage: (message, messageType) =>
      dispatch(actions.sendMessage(message, messageType)),

    stopLoading: () => dispatch(actions.stopLoading()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EditHomePage)
);
