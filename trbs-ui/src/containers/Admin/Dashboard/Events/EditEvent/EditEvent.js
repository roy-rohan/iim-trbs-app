import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import MomentUtils from "@date-io/moment";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  Radio,
  RadioGroup,
  Select,
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
import * as classes from "./EditEvent.module.css";
import { eventTypes, initalValues } from "./InitialData";

class EditEvent extends Component {
  state = {
    initialValues: initalValues,
    eventTypesDropdown: [{ key: "Select an option", value: null }],
    eventImage: null,
    eventTimelineImage: null,
    eventImageFormData: new FormData(),
    eventTimelineImageFormData: new FormData(),
    isFormValid: true,
    eventImageUploadSuccess: false,
    eventTimelineImageUploadSuccess: false,
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
      .get("/events/read-single.php?id=" + queryParams.eventId)
      .then((response) => {
        let eventData = response.data;
        let updatedValues = { ...this.state.initialValues };
        for (let attr in updatedValues) {
          updatedValues[attr].value = eventData[attr];
        }
        this.setState({ initalValues: updatedValues });
        this.props.stopLoading();
      })
      .catch((error) => {
        console.log(error);
        this.props.onSendMessage("Something went wrong. ", "error");
        window.location.href = "/dashboard/eventSummary";
      });
  }

  onFormSubmit(event) {
    event.preventDefault();
    // this.submitBtnRef.current.textContent = "Please wait...";
    let isValid = this.validate();
    if (isValid) {
      // make a request
      let eventData = {};
      if (this.state.initalValues) {
        Object.keys(this.state.initalValues).forEach((key) => {
          eventData[key] = this.state.initialValues[key].value;
        });
        this.submitBtnRef.current.textContent = "Submit";
        this.props.onEditEvent(eventData, this.uploadImages.bind(this));
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
    if (this.state.eventImage !== null) {
      let eventImageformData = this.state.eventImageFormData;
      eventImageformData.append(
        "entity_id",
        this.state.initialValues.event_id.value
      );
      if (eventImageformData.get("path") === "null") {
        uploadNewImage(eventImageformData, () => {
          this.setState({
            ...this.state,
            eventImageUploadSuccess: true,
          });
        });
      } else {
        updateImage(eventImageformData, () =>
          this.setState({ ...this.state, eventImageUploadSuccess: true })
        );
      }
    } else {
      this.setState({ ...this.state, eventImageUploadSuccess: true });
    }

    if (this.state.eventTimelineImage !== null) {
      let timelineEventImageformData = this.state.eventTimelineImageFormData;
      timelineEventImageformData.append(
        "entity_id",
        this.state.initialValues.event_id.value
      );
      if (timelineEventImageformData.get("path") === "null") {
        // image was not present event when added, now being added first time
        uploadNewImage(timelineEventImageformData, () => {
          this.setState({
            ...this.state,
            eventTimelineImageUploadSuccess: true,
          });
        });
      } else {
        updateImage(timelineEventImageformData, () =>
          this.setState({
            ...this.state,
            eventTimelineImageUploadSuccess: true,
          })
        );
      }
    } else {
      this.setState({ ...this.state, eventTimelineImageUploadSuccess: true });
    }
  }

  successHandler() {
    this.props.onSendMessage("Event Edited Successfully", "info");
    this.formRef.current.reset();
    window.location.href = "/dashboard/eventSummary";
  }

  fieldChangHandler(key, event) {
    let updatedValues = this.state.initialValues;
    Object.keys(updatedValues).forEach((fieldKey) => {
      if (fieldKey === key) {
        updatedValues[fieldKey].value = event.target.value;
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

  onEventImageChange(event, uploadType) {
    let selectedFile = event.target.files[0];
    const formData = new FormData();
    formData.append("image_upload", selectedFile);
    let path =
      uploadType === "event"
        ? this.state.initialValues.image_url.value
        : uploadType === "event-timeline"
        ? this.state.initialValues.timeline_image_url.value
        : null;
    formData.append("path", path);
    formData.append("upload_type", uploadType);
    formData.append("entity_type", "event");
    let updatedValues = this.state.initialValues;
    Object.keys(updatedValues).forEach((fieldKey) => {
      if (fieldKey === "image_upload") {
        updatedValues[fieldKey].value = selectedFile;
      }
    });
    var reader = new FileReader();
    reader.onloadend = this.loadImage.bind(this, reader, uploadType);
    reader.readAsDataURL(selectedFile);
    if (uploadType === "event-timeline") {
      this.setState({
        initalValues: updatedValues,
        eventTimelineImageFormData: formData,
      });
    } else {
      this.setState({
        initalValues: updatedValues,
        eventImageFormData: formData,
      });
    }
  }
  changePictureHandler(type) {
    if (type === "event-timeline") {
      this.timelineImageInputRef.current.click();
    } else {
      this.imageInputRef.current.click();
    }
  }

  loadImage(reader, uploadType) {
    let src = reader.result;
    if (uploadType === "event-timeline") {
      this.setState({ eventTimelineImage: src });
    } else {
      this.setState({ eventImage: src });
    }
  }

  render() {
    if (
      this.state.eventImageUploadSuccess &&
      this.state.eventTimelineImageUploadSuccess
    ) {
      this.successHandler();
    }
    return (
      <div className={classes.EditEvent}>
        <MatBackdrop open={this.props.loading}></MatBackdrop>
        <div className={classes.PageHeader}>
          <h2>Edit Event</h2>
        </div>
        <form
          ref={this.formRef}
          className={classes.Form}
          // onChange={() => this.validate.bind(this)()}
        >
          <div className={classes.EventImageSection}>
            <div className={classes.EventImage}>
              <CustomImage
                src={
                  this.state.eventImage
                    ? this.state.eventImage
                    : this.state.initialValues.image_url.value
                    ? this.state.initialValues.image_url.value
                    : DefaultImage
                }
                useCustomSrc={
                  this.state.eventImage
                    ? true
                    : this.state.initialValues.image_url.value
                    ? false
                    : true
                }
                alt="Event"
              />
            </div>
            <input
              type="file"
              onChange={(event) =>
                this.onEventImageChange.bind(this, event, "event")()
              }
              hidden
              ref={this.imageInputRef}
            />
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={this.changePictureHandler.bind(this, "event")}
            >
              Change Picture
            </Button>
          </div>
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.initialValues.title.error}
            id="title"
            name="title"
            label="Title"
            value={this.state.initialValues.title.value}
            onChange={(event) =>
              this.fieldChangHandler.bind(this, "title", event)()
            }
            helperText={this.state.initialValues.title.errorMessage}
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
            onChange={(event) =>
              this.fieldChangHandler.bind(this, "slug", event)()
            }
            helperText={this.state.initialValues.slug.errorMessage}
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-age-native-simple">
              Event Type
            </InputLabel>
            <Select
              native
              label="Event Type"
              value={this.state.initialValues.type.value}
              inputProps={{
                name: "event_type",
                id: "outlined-age-native-simple",
              }}
              onChange={(event) =>
                this.fieldChangHandler.bind(this, "type", event)()
              }
              fullWidth
            >
              {this.props.categories ? (
                [
                  ...eventTypes.map((option, i) => {
                    return (
                      <option selected={i === 0} key={i} value={option}>
                        {option}
                      </option>
                    );
                  }),
                  <option value="NEW">ADD NEW TYPE</option>,
                ]
              ) : (
                <option value="NEW">Add New Type</option>
              )}
            </Select>
          </FormControl>
          <div className={classes.Spacer}></div>
          {this.state.initialValues.type.value === "NEW" ? (
            <TextField
              error={this.state.initialValues.slug.error}
              id="new_type"
              name="new_type"
              label="New Event Type"
              onChange={(event) =>
                this.fieldChangHandler.bind(this, "new_type", event)()
              }
              helperText=""
              variant="outlined"
              fullWidth
            />
          ) : null}
          <div className={classes.Spacer}></div>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <Grid container justifyContent="space-around">
              <KeyboardDatePicker
                margin="normal"
                id="date-picker-dialog"
                label="Event Start Dsate"
                name="event_date"
                format="DD/MM/yyyy"
                value={this.state.initialValues.event_date.value}
                onChange={(date, value) => {
                  this.dateFieldChangeHandler.bind(
                    this,
                    "event_date",
                    date,
                    value
                  )();
                }}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
              <KeyboardTimePicker
                margin="normal"
                id="time-picker"
                label="Event Start Time"
                value={this.state.initialValues.event_time.value}
                onChange={(date, value) => {
                  this.dateFieldChangeHandler.bind(
                    this,
                    "event_time",
                    date,
                    value
                  )();
                }}
                KeyboardButtonProps={{
                  "aria-label": "change time",
                }}
              />
            </Grid>
            <Grid container justifyContent="space-around">
              <KeyboardDatePicker
                margin="normal"
                id="date-picker-dialog"
                label="Event End Date"
                name="event_date"
                format="DD/MM/yyyy"
                value={this.state.initialValues.event_end_date.value}
                onChange={(date, value) => {
                  this.dateFieldChangeHandler.bind(
                    this,
                    "event_end_date",
                    date,
                    value
                  )();
                }}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
              <KeyboardTimePicker
                margin="normal"
                id="time-picker"
                label="Event End Time"
                value={this.state.initialValues.event_end_time.value}
                onChange={(date, value) => {
                  this.dateFieldChangeHandler.bind(
                    this,
                    "event_end_time",
                    date,
                    value
                  )();
                }}
                KeyboardButtonProps={{
                  "aria-label": "change time",
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.initialValues.venue.error}
            id="venue"
            name="venue"
            label="Event Venue"
            value={this.state.initialValues.venue.value}
            onChange={(event) =>
              this.fieldChangHandler.bind(this, "venue", event)()
            }
            helperText=""
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.initialValues.organising_club.error}
            id="organising_club"
            name="organising_club"
            label="Organising Club (s)"
            value={this.state.initialValues.organising_club.value}
            onChange={(event) =>
              this.fieldChangHandler.bind(this, "organising_club", event)()
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
            onChange={(event) =>
              this.fieldChangHandler.bind(this, "price", event)()
            }
            helperText=""
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <FormControl fullWidth>
            <p className={classes.InputLabel}>Event Contact Details</p>
            <CKEditor
              editor={ClassicEditor}
              onInit={(editor) => {}}
              data={this.state.initialValues.contact.value}
              onChange={(event, editor) =>
                this.ckEditorFieldChangHandler.bind(
                  this,
                  "contact",
                  editor.getData()
                )()
              }
            ></CKEditor>
          </FormControl>
          <div className={classes.Spacer}></div>
          <FormControl fullWidth>
            <p className={classes.InputLabel}>Short Description</p>
            <CKEditor
              editor={ClassicEditor}
              data={this.state.initialValues.short_description.value}
              onInit={(editor) => {}}
              onChange={(event, editor) =>
                this.ckEditorFieldChangHandler.bind(
                  this,
                  "short_description",
                  editor.getData()
                )()
              }
            ></CKEditor>
          </FormControl>
          <div className={classes.Spacer}></div>
          <FormControl fullWidth>
            <p className={classes.InputLabel}>Full Description</p>
            <CKEditor
              editor={ClassicEditor}
              onInit={(editor) => {}}
              data={this.state.initialValues.full_description.value}
              onChange={(event, editor) =>
                this.ckEditorFieldChangHandler.bind(
                  this,
                  "full_description",
                  editor.getData()
                )()
              }
            ></CKEditor>
          </FormControl>
          <div className={classes.Spacer}></div>
          <FormControl fullWidth>
            <p className={classes.InputLabel}>Rules</p>
            <CKEditor
              editor={ClassicEditor}
              data={this.state.initialValues.rules.value}
              onInit={(editor) => {}}
              onChange={(event, editor) =>
                this.ckEditorFieldChangHandler.bind(
                  this,
                  "rules",
                  editor.getData()
                )()
              }
            ></CKEditor>
          </FormControl>
          <div className={classes.Spacer}></div>
          <FormControl fullWidth>
            <p className={classes.InputLabel}>Event Format</p>
            <CKEditor
              editor={ClassicEditor}
              data={this.state.initialValues.event_format.value}
              onInit={(editor) => {}}
              onChange={(event, editor) =>
                this.ckEditorFieldChangHandler.bind(
                  this,
                  "event_format",
                  editor.getData()
                )()
              }
            ></CKEditor>
          </FormControl>
          <div className={classes.Spacer}></div>
          <FormControl fullWidth>
            <p className={classes.InputLabel}>Event Timeline</p>
            <CKEditor
              editor={ClassicEditor}
              onInit={(editor) => {}}
              data={this.state.initialValues.event_timeline.value}
              onChange={(event, editor) =>
                this.ckEditorFieldChangHandler.bind(
                  this,
                  "event_timeline",
                  editor.getData()
                )()
              }
            ></CKEditor>
          </FormControl>
          <div className={classes.Spacer}></div>
          <FormControl fullWidth>
            <p className={classes.InputLabel}>Prizes</p>
            <CKEditor
              editor={ClassicEditor}
              onInit={(editor) => {}}
              data={this.state.initialValues.prizes.value}
              onChange={(event, editor) =>
                this.ckEditorFieldChangHandler.bind(
                  this,
                  "prizes",
                  editor.getData()
                )()
              }
            ></CKEditor>
          </FormControl>
          <div className={classes.Spacer}></div>
          <FormControl fullWidth>
            <p className={classes.InputLabel}>Remark One</p>
            <CKEditor
              editor={ClassicEditor}
              onInit={(editor) => {}}
              data={this.state.initialValues.remark_one.value}
              onChange={(event, editor) =>
                this.ckEditorFieldChangHandler.bind(
                  this,
                  "remark_one",
                  editor.getData()
                )()
              }
            ></CKEditor>
          </FormControl>
          <div className={classes.Spacer}></div>
          <FormControl fullWidth>
            <p className={classes.InputLabel}>
              Remark Two ( will be added inside Date & Time)
            </p>
            <CKEditor
              editor={ClassicEditor}
              onInit={(editor) => {}}
              data={this.state.initialValues.remark_two.value}
              onChange={(event, editor) =>
                this.ckEditorFieldChangHandler.bind(
                  this,
                  "remark_two",
                  editor.getData()
                )()
              }
            ></CKEditor>
          </FormControl>
          <div className={classes.Spacer}></div>
          <div className={classes.Spacer}></div>
          <FormControl fullWidth>
            <p className={classes.InputLabel}>
              Registration Info ( will be shown in Register tab){" "}
            </p>
            <CKEditor
              editor={ClassicEditor}
              onInit={(editor) => {}}
              data={this.state.initialValues.register.value}
              onChange={(event, editor) =>
                this.ckEditorFieldChangHandler.bind(
                  this,
                  "register",
                  editor.getData()
                )()
              }
            ></CKEditor>
          </FormControl>
          <div className={classes.Spacer}></div>
          <div className={classes.EventTimelineImageSection}>
            <h3 className={classes.TimelineImageHeader}>Timeline Image</h3>
            <div className={classes.EventTimelineImage}>
              <CustomImage
                src={
                  this.state.eventTimelineImage
                    ? this.state.eventTimelineImage
                    : this.state.initialValues.timeline_image_url.value
                    ? this.state.initialValues.timeline_image_url.value
                    : DefaultImage
                }
                useCustomSrc={
                  this.state.eventTimelineImage
                    ? true
                    : this.state.initialValues.timeline_image_url.value
                    ? false
                    : true
                }
                alt="Event"
              />
            </div>
            <input
              type="file"
              onChange={(event) =>
                this.onEventImageChange.bind(this, event, "event-timeline")()
              }
              hidden
              ref={this.timelineImageInputRef}
            />
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={this.changePictureHandler.bind(this, "event-timeline")}
            >
              Change Picture
            </Button>
          </div>
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.initialValues.price.error}
            id="view_order"
            name="view_order"
            label="View Order"
            value={this.state.initialValues.view_order.value}
            type="number"
            onChange={(event) =>
              this.fieldChangHandler.bind(this, "view_order", event)()
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
              onChange={(event) =>
                this.fieldChangHandler.bind(this, "show_in_home_page", event)()
              }
            >
              <FormControlLabel value="1" control={<Radio />} label="Yes" />
              <FormControlLabel value="0" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
          <div className={classes.Spacer}></div>
          <FormControl component="fieldset">
            <FormLabel component="legend">Visible ?</FormLabel>
            <RadioGroup
              aria-label="visible"
              name="visible"
              style={{ display: "flex", flexDirection: "row" }}
              value={this.state.initialValues.visible.value}
              onChange={(event) =>
                this.fieldChangHandler.bind(this, "visible", event)()
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
    error: state.event.error,
    categories: state.event.categories,
    loading: state.auth.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchEvents: () => dispatch(actions.fetchEvents()),
    onEditEvent: (eventData, cb) => dispatch(actions.editEvent(eventData, cb)),
    onSendMessage: (message, messageType) =>
      dispatch(actions.sendMessage(message, messageType)),

    stopLoading: () => dispatch(actions.stopLoading()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EditEvent)
);
