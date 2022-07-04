import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Button, FormControl, TextField } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import axios from "../../../../axios-iim";
import MatBackdrop from "../../../../components/UI/Backdrop/MatBackdrop/MatBackdrop";
import * as actions from "../../../../store/actions/index";
import * as classes from "./EditAboutPage.module.css";
import { initalValues } from "./InitialData";

class EditAboutPage extends Component {
  state = {
    initialValues: initalValues,
    aboutPageTypesDropdown: [{ key: "Select an option", value: null }],
    aboutPageImage: null,
    aboutPageTimelineImage: null,
    aboutPageImageFormData: new FormData(),
    aboutPageTimelineImageFormData: new FormData(),
    isFormValid: true,
    aboutPageImageUploadSuccess: false,
    aboutPageTimelineImageUploadSuccess: false,
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
      .post("/content/about-page/read-single.php")
      .then((response) => {
        let aboutPageData = response.data;
        let updatedValues = { ...this.state.initialValues };
        for (let attr in updatedValues) {
          updatedValues[attr].value = aboutPageData[attr];
        }
        this.setState({ initalValues: updatedValues });
        this.props.stopLoading();
      })
      .catch((error) => {
        this.props.onSendMessage("Something went wrong. ", "error");
        // window.location.href = "/dashboard/aboutPageSummary";
      });
  }

  onFormSubmit(event) {
    event.preventDefault();
    // this.submitBtnRef.current.textContent = "Please wait...";
    let isValid = this.validate();
    if (isValid) {
      // make a request
      let aboutPageData = {};
      if (this.state.initialValues) {
        Object.keys(this.state.initialValues).forEach((key) => {
          aboutPageData[key] = this.state.initialValues[key].value;
        });
        this.submitBtnRef.current.textContent = "Submit";
        this.props.onEditAboutPage(
          aboutPageData,
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

  uploadImages() {
    // if (this.state.aboutPageImage !== null) {
    //   let aboutPageImageformData = this.state.aboutPageImageFormData;
    //   aboutPageImageformData.append(
    //     "entity_id",
    //     this.state.initialValues.home_page_id.value
    //   );
    //   if (aboutPageImageformData.get("path") === "null") {
    //     uploadNewImage(aboutPageImageformData, () => {
    //       this.setState({
    //         ...this.state,
    //         aboutPageImageUploadSuccess: true,
    //       });
    //     });
    //   } else {
    //     updateImage(aboutPageImageformData, () =>
    //       this.setState({ ...this.state, aboutPageImageUploadSuccess: true })
    //     );
    //   }
    // } else {
    //   this.setState({ ...this.state, aboutPageImageUploadSuccess: true });
    // }
    // if (this.state.aboutPageTimelineImage !== null) {
    //   let timelineEventImageformData = this.state.aboutPageTimelineImageFormData;
    //   timelineEventImageformData.append(
    //     "entity_id",
    //     this.state.initialValues.aboutPage_id.value
    //   );
    //   if (timelineEventImageformData.get("path") === "null") {
    //     // image was not presentaboutPage when added, now being added first time
    //     uploadNewImage(timelineEventImageformData, () => {
    //       this.setState({
    //         ...this.state,
    //         aboutPageTimelineImageUploadSuccess: true,
    //       });
    //     });
    //   } else {
    //     updateImage(timelineEventImageformData, () =>
    //       this.setState({
    //         ...this.state,
    //         aboutPageTimelineImageUploadSuccess: true,
    //       })
    //     );
    //   }
    // } else {
    // this.setState({
    //   ...this.state,
    //   aboutPageTimelineImageUploadSuccess: true,
    // });
    // }
  }

  successHandler() {
    this.props.onSendMessage("About Page Content Edited Successfully", "info");
    this.formRef.current.reset();
    window.location.href = "/about";
  }

  fieldChangHandler(key, aboutPage) {
    let updatedValues = this.state.initialValues;
    Object.keys(updatedValues).forEach((fieldKey) => {
      if (fieldKey === key) {
        updatedValues[fieldKey].value = aboutPage.target.value;
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

  onEventImageChange(aboutPage, uploadType) {
    let selectedFile = aboutPage.target.files[0];
    const formData = new FormData();
    formData.append("image_upload", selectedFile);
    let path =
      uploadType === "aboutPage"
        ? this.state.initialValues.image_url.value
        : uploadType === "aboutPage-timeline"
        ? this.state.initialValues.timeline_image_url.value
        : null;
    formData.append("path", path);
    formData.append("upload_type", uploadType);
    formData.append("entity_type", "aboutPage");
    let updatedValues = this.state.initialValues;
    Object.keys(updatedValues).forEach((fieldKey) => {
      if (fieldKey === "image_upload") {
        updatedValues[fieldKey].value = selectedFile;
      }
    });
    var reader = new FileReader();
    reader.onloadend = this.loadImage.bind(this, reader, uploadType);
    reader.readAsDataURL(selectedFile);
    if (uploadType === "aboutPage-timeline") {
      this.setState({
        initalValues: updatedValues,
        aboutPageTimelineImageFormData: formData,
      });
    } else {
      this.setState({
        initalValues: updatedValues,
        aboutPageImageFormData: formData,
      });
    }
  }
  changePictureHandler(type) {
    if (type === "aboutPage-timeline") {
      this.timelineImageInputRef.current.click();
    } else {
      this.imageInputRef.current.click();
    }
  }

  loadImage(reader, uploadType) {
    let src = reader.result;
    if (uploadType === "aboutPage-timeline") {
      this.setState({ aboutPageTimelineImage: src });
    } else {
      this.setState({ aboutPageImage: src });
    }
  }

  render() {
    return (
      <div className={classes.EditAboutPage}>
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
            onChange={(aboutPage) =>
              this.fieldChangHandler.bind(this, "video_link", aboutPage)()
            }
            helperText={this.state.initialValues.video_link.errorMessage}
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
              onChange={(aboutPage, editor) =>
                this.ckEditorFieldChangHandler.bind(
                  this,
                  "about",
                  editor.getData()
                )()
              }
            ></CKEditor>
          </FormControl>
          <div className={classes.Spacer}></div>
          <FormControl fullWidth>
            <p className={classes.InputLabel}>Event Description</p>
            <CKEditor
              editor={ClassicEditor}
              data={this.state.initialValues.event_desc.value}
              onInit={(editor) => {}}
              onChange={(aboutPage, editor) =>
                this.ckEditorFieldChangHandler.bind(
                  this,
                  "event_desc",
                  editor.getData()
                )()
              }
            ></CKEditor>
          </FormControl>
          <div className={classes.Spacer}></div>
          <FormControl fullWidth>
            <p className={classes.InputLabel}>Speaker Description</p>
            <CKEditor
              editor={ClassicEditor}
              data={this.state.initialValues.speaker_desc.value}
              onInit={(editor) => {}}
              onChange={(aboutPage, editor) =>
                this.ckEditorFieldChangHandler.bind(
                  this,
                  "speaker_desc",
                  editor.getData()
                )()
              }
            ></CKEditor>
          </FormControl>
          <div className={classes.Spacer}></div>
          <FormControl fullWidth>
            <p className={classes.InputLabel}>Workshop Description</p>
            <CKEditor
              editor={ClassicEditor}
              data={this.state.initialValues.workshop_desc.value}
              onInit={(editor) => {}}
              onChange={(aboutPage, editor) =>
                this.ckEditorFieldChangHandler.bind(
                  this,
                  "workshop_desc",
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
    onEditAboutPage: (aboutPageData, cb) =>
      dispatch(actions.editAboutPage(aboutPageData, cb)),
    onSendMessage: (message, messageType) =>
      dispatch(actions.sendMessage(message, messageType)),

    stopLoading: () => dispatch(actions.stopLoading()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EditAboutPage)
);
