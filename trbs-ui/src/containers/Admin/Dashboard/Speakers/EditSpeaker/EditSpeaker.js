import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import MomentUtils from "@date-io/moment";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";
import {
  KeyboardDatePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import DefaultImage from "../../../../../assets/images/common/default.png";
import axios from "../../../../../axios-iim";
import MatBackdrop from "../../../../../components/UI/Backdrop/MatBackdrop/MatBackdrop";
import CustomImage from "../../../../../components/UI/CustomImage/CustomImage";
import * as actions from "../../../../../store/actions/index";
import {
  updateImage,
  uploadNewImage,
} from "../../../../../utils/imageUploadUtil";
import { extractQueryParams } from "../../../../../utils/queryUtil";
import * as classes from "./EditSpeaker.module.css";
import { initalValues } from "./InitialData";

class EditSpeaker extends Component {
  state = {
    initialValues: initalValues,
    speakerTypesDropdown: [{ key: "Select an option", value: null }],
    speakerImage: null,
    speakerTimelineImage: null,
    speakerImageFormData: new FormData(),
    speakerTimelineImageFormData: new FormData(),
    isFormValid: true,
    speakerImageUploadSuccess: false,
    speakerTimelineImageUploadSuccess: false,
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
      .get("/speakers/read-single.php?id=" + queryParams.speakerId)
      .then((response) => {
        let speakerData = response.data;
        let updatedValues = { ...this.state.initialValues };
        for (let attr in updatedValues) {
          updatedValues[attr].value = speakerData[attr];
        }
        this.setState({ initalValues: updatedValues });
        this.props.stopLoading();
      })
      .catch((error) => {
        this.props.onSendMessage("Something went wrong. ", "error");
        window.location.href = "/dashboard/speakerSummary";
      });
  }

  onFormSubmit(speaker) {
    speaker.preventDefault();
    // this.submitBtnRef.current.textContent = "Please wait...";
    let isValid = this.validate();
    if (isValid) {
      // make a request
      let speakerData = {};
      if (this.state.initalValues) {
        Object.keys(this.state.initalValues).forEach((key) => {
          speakerData[key] = this.state.initialValues[key].value;
        });
        this.submitBtnRef.current.textContent = "Submit";
        this.props.onEditSpeaker(speakerData, this.uploadImages.bind(this));
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
    if (this.state.speakerImage !== null) {
      let speakerImageformData = this.state.speakerImageFormData;
      speakerImageformData.append(
        "entity_id",
        this.state.initialValues.speaker_id.value
      );
      if (speakerImageformData.get("path") === "null") {
        uploadNewImage(speakerImageformData, () => {
          this.setState({
            ...this.state,
            speakerImageUploadSuccess: true,
          });
        });
      } else {
        updateImage(speakerImageformData, () =>
          this.setState({ ...this.state, speakerImageUploadSuccess: true })
        );
      }
    } else {
      this.setState({ ...this.state, speakerImageUploadSuccess: true });
    }

    if (this.state.speakerTimelineImage !== null) {
      let timelineSpeakerImageformData =
        this.state.speakerTimelineImageFormData;
      timelineSpeakerImageformData.append(
        "entity_id",
        this.state.initialValues.speaker_id.value
      );
      if (timelineSpeakerImageformData.get("path") === "null") {
        // image was not present speaker when added, now being added first time
        uploadNewImage(timelineSpeakerImageformData, () => {
          this.setState({
            ...this.state,
            speakerTimelineImageUploadSuccess: true,
          });
        });
      } else {
        updateImage(timelineSpeakerImageformData, () =>
          this.setState({
            ...this.state,
            speakerTimelineImageUploadSuccess: true,
          })
        );
      }
    } else {
      this.setState({
        ...this.state,
        speakerTimelineImageUploadSuccess: true,
      });
    }
  }

  successHandler() {
    this.props.onSendMessage("Speaker Edited Successfully", "info");
    this.formRef.current.reset();
    window.location.href = "/dashboard/speakerSummary";
  }

  fieldChangHandler(key, speaker) {
    let updatedValues = this.state.initialValues;
    Object.keys(updatedValues).forEach((fieldKey) => {
      if (fieldKey === key) {
        updatedValues[fieldKey].value = speaker.target.value;
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

  onSpeakerImageChange(speaker, uploadType) {
    let selectedFile = speaker.target.files[0];
    const formData = new FormData();
    formData.append("image_upload", selectedFile);
    let path =
      uploadType === "speaker"
        ? this.state.initialValues.image_url.value
        : uploadType === "speaker-timeline"
        ? this.state.initialValues.timeline_image_url.value
        : null;
    formData.append("path", path);
    formData.append("upload_type", uploadType);
    formData.append("entity_type", "speaker");
    let updatedValues = this.state.initialValues;
    Object.keys(updatedValues).forEach((fieldKey) => {
      if (fieldKey === "image_upload") {
        updatedValues[fieldKey].value = selectedFile;
      }
    });
    var reader = new FileReader();
    reader.onloadend = this.loadImage.bind(this, reader, uploadType);
    reader.readAsDataURL(selectedFile);
    if (uploadType === "speaker-timeline") {
      this.setState({
        initalValues: updatedValues,
        speakerTimelineImageFormData: formData,
      });
    } else {
      this.setState({
        initalValues: updatedValues,
        speakerImageFormData: formData,
      });
    }
  }
  changePictureHandler(type) {
    if (type === "speaker-timeline") {
      this.timelineImageInputRef.current.click();
    } else {
      this.imageInputRef.current.click();
    }
  }

  loadImage(reader, uploadType) {
    let src = reader.result;
    if (uploadType === "speaker-timeline") {
      this.setState({ speakerTimelineImage: src });
    } else {
      this.setState({ speakerImage: src });
    }
  }

  render() {
    if (
      this.state.speakerImageUploadSuccess &&
      this.state.speakerTimelineImageUploadSuccess
    ) {
      this.successHandler();
    }
    return (
      <div className={classes.EditSpeaker}>
        <MatBackdrop open={this.props.loading}></MatBackdrop>
        <div className={classes.PageHeader}>
          <h2>Edit Speaker</h2>
        </div>
        <form
          ref={this.formRef}
          className={classes.Form}
          // onChange={() => this.validate.bind(this)()}
        >
          <div className={classes.SpeakerImageSection}>
            <div className={classes.SpeakerImage}>
              <CustomImage
                src={
                  this.state.speakerImage
                    ? this.state.speakerImage
                    : this.state.initialValues.image_url.value
                    ? this.state.initialValues.image_url.value
                    : DefaultImage
                }
                useCustomSrc={
                  this.state.speakerImage
                    ? true
                    : this.state.initialValues.image_url.value
                    ? false
                    : true
                }
                alt="Speaker"
              />
            </div>
            <input
              type="file"
              onChange={(speaker) =>
                this.onSpeakerImageChange.bind(this, speaker, "speaker")()
              }
              hidden
              ref={this.imageInputRef}
            />
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={this.changePictureHandler.bind(this, "speaker")}
            >
              Change Picture
            </Button>
          </div>
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.initialValues.name.error}
            id="name"
            name="name"
            label="Name"
            value={this.state.initialValues.name.value}
            onChange={(speaker) =>
              this.fieldChangHandler.bind(this, "name", speaker)()
            }
            helperText={this.state.initialValues.name.errorMessage}
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.initialValues.slug.error}
            id="slug"
            name="slug"
            label="Slug"
            value={this.state.initialValues.slug.value}
            onChange={(speaker) =>
              this.fieldChangHandler.bind(this, "slug", speaker)()
            }
            helperText={this.state.initialValues.slug.errorMessage}
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <Grid container justifyContent="space-around">
              <KeyboardDatePicker
                margin="normal"
                id="date-picker-dialog"
                label="Date"
                name="date"
                format="DD/MM/yyyy"
                value={this.state.initialValues.date.value}
                onChange={(date, value) => {
                  this.dateFieldChangeHandler.bind(this, "date", date, value)();
                }}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
              <KeyboardTimePicker
                margin="normal"
                id="time-picker"
                label="Time"
                value={this.state.initialValues.time.value}
                onChange={(date, value) => {
                  this.dateFieldChangeHandler.bind(this, "time", date, value)();
                }}
                KeyboardButtonProps={{
                  "aria-label": "change time",
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.initialValues.topic.error}
            id="topic"
            name="topic"
            label="Topic"
            value={this.state.initialValues.topic.value}
            onChange={(speaker) =>
              this.fieldChangHandler.bind(this, "topic", speaker)()
            }
            helperText=""
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.initialValues.designation.error}
            id="designation"
            name="designation"
            label="Designation"
            value={this.state.initialValues.designation.value}
            onChange={(speaker) =>
              this.fieldChangHandler.bind(this, "designation", speaker)()
            }
            helperText=""
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.initialValues.venue.error}
            id="venue"
            name="venue"
            label="Speaker Venue"
            value={this.state.initialValues.venue.value}
            onChange={(speaker) =>
              this.fieldChangHandler.bind(this, "venue", speaker)()
            }
            helperText=""
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.initialValues.duration.error}
            id="duration"
            name="duration"
            label="Duration"
            value={this.state.initialValues.duration.value}
            onChange={(speaker) =>
              this.fieldChangHandler.bind(this, "duration", speaker)()
            }
            helperText=""
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.initialValues.price.error}
            id="price"
            name="price"
            label="Price"
            type="number"
            value={this.state.initialValues.price.value}
            onChange={(speaker) =>
              this.fieldChangHandler.bind(this, "price", speaker)()
            }
            helperText=""
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <FormControl fullWidth>
            <p className={classes.InputLabel}>Introduction</p>
            <CKEditor
              editor={ClassicEditor}
              onInit={(editor) => {}}
              data={this.state.initialValues.introduction.value}
              onChange={(speaker, editor) =>
                this.ckEditorFieldChangHandler.bind(
                  this,
                  "introduction",
                  editor.getData()
                )()
              }
            ></CKEditor>
          </FormControl>
          <div className={classes.Spacer}></div>
          <FormControl fullWidth>
            <p className={classes.InputLabel}>Biography</p>
            <CKEditor
              editor={ClassicEditor}
              data={this.state.initialValues.biography.value}
              onInit={(editor) => {}}
              onChange={(speaker, editor) =>
                this.ckEditorFieldChangHandler.bind(
                  this,
                  "biography",
                  editor.getData()
                )()
              }
            ></CKEditor>
          </FormControl>
          <div className={classes.Spacer}></div>
          <FormControl fullWidth>
            <p className={classes.InputLabel}>Registration</p>
            <CKEditor
              editor={ClassicEditor}
              onInit={(editor) => {}}
              data={this.state.initialValues.registration.value}
              onChange={(speaker, editor) =>
                this.ckEditorFieldChangHandler.bind(
                  this,
                  "registration",
                  editor.getData()
                )()
              }
            ></CKEditor>
          </FormControl>
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.initialValues.price.error}
            id="view_order"
            name="view_order"
            label="View Order"
            value={this.state.initialValues.view_order.value}
            type="number"
            onChange={(speaker) =>
              this.fieldChangHandler.bind(this, "view_order", speaker)()
            }
            helperText=""
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <FormControl component="fieldset">
            <FormLabel component="legend">Show in Home Page ?</FormLabel>
            <RadioGroup
              aria-label="show_in_home_page"
              name="show_in_home_page"
              value={this.state.initialValues.show_in_home_page.value}
              style={{ display: "flex", flexDirection: "row" }}
              onChange={(speaker) =>
                this.fieldChangHandler.bind(
                  this,
                  "show_in_home_page",
                  speaker
                )()
              }
            >
              <FormControlLabel value="1" control={<Radio />} label="Yes" />
              <FormControlLabel value="0" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>{" "}
          <div className={classes.Spacer}></div>
          <FormControl component="fieldset">
            <FormLabel component="legend">Visible ?</FormLabel>
            <RadioGroup
              aria-label="visible"
              name="visible"
              value={this.state.initialValues.visible.value}
              style={{ display: "flex", flexDirection: "row" }}
              onChange={(speaker) =>
                this.fieldChangHandler.bind(this, "visible", speaker)()
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
    error: state.speaker.error,
    categories: state.speaker.categories,
    loading: state.auth.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchSpeakers: () => dispatch(actions.fetchSpeakers()),
    onEditSpeaker: (speakerData, cb) =>
      dispatch(actions.editSpeaker(speakerData, cb)),
    onSendMessage: (message, messageType) =>
      dispatch(actions.sendMessage(message, messageType)),

    stopLoading: () => dispatch(actions.stopLoading()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EditSpeaker)
);
