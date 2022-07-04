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
import DefaultImage from "../../../../../assets/images/common/default.png";
import MatBackdrop from "../../../../../components/UI/Backdrop/MatBackdrop/MatBackdrop";
import CustomImage from "../../../../../components/UI/CustomImage/CustomImage";
import * as actions from "../../../../../store/actions/index";
import { uploadNewImage } from "../../../../../utils/imageUploadUtil";
import * as classes from "./AddInformalEvent.module.css";
import { informalEventTypes, initalValues } from "./InitialData";

class AddInformalEvent extends Component {
  state = {
    initialValues: initalValues,
    informalEventTypesDropdown: [{ key: "Select an option", value: null }],
    informalEventImage: null,
    informalEventTimelineImage: null,
    informalEventImageFormData: new FormData(),
    informalEventTimelineImageFormData: new FormData(),
    isFormValid: true,
    informalEventImageUploadSuccess: false,
    informalEventTimelineImageUploadSuccess: false,
  };

  constructor() {
    super();
    this.submitBtnRef = React.createRef();
    this.imageInputRef = React.createRef();
    this.timelineImageInputRef = React.createRef();
    this.formRef = React.createRef();
  }

  componentDidMount() {
    this.props.onFetchCategories(
      JSON.stringify({
        filters: [
          { field_name: "e.type", value: this.props.category, op: "=" },
          { field_name: "e.visible", value: 1, op: "=" },
        ],
        filter_op: "AND",
        sort: [],
      })
    );
    this.props.stopLoading();
  }

  onFormSubmit(informalEvent) {
    informalEvent.preventDefault();
    this.submitBtnRef.current.textContent = "Please wait...";
    let isValid = this.validate();
    if (isValid) {
      // make a request
      let informalEventData = {};
      if (this.state.initalValues) {
        Object.keys(this.state.initalValues).forEach((key) => {
          informalEventData[key] = this.state.initialValues[key].value;
        });
        this.submitBtnRef.current.textContent = "Submit";
        this.props.onAddInformalEvent(
          informalEventData,
          this.uploadImages.bind(this)
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

  uploadImages(informalEventId) {
    if (this.state.informalEventImage !== null) {
      let informalEventImageformData = this.state.informalEventImageFormData;
      informalEventImageformData.append("entity_id", informalEventId);
      uploadNewImage(informalEventImageformData, () =>
        this.setState({ ...this.state, informalEventImageUploadSuccess: true })
      );
    } else {
      this.setState({ ...this.state, informalEventImageUploadSuccess: true });
    }
    if (this.state.informalEventTimelineImage !== null) {
      let timelineInformalEventImageformData =
        this.state.informalEventTimelineImageFormData;
      timelineInformalEventImageformData.append("entity_id", informalEventId);
      uploadNewImage(timelineInformalEventImageformData, () =>
        this.setState({
          ...this.state,
          informalEventTimelineImageUploadSuccess: true,
        })
      );
    } else {
      this.setState({
        ...this.state,
        informalEventTimelineImageUploadSuccess: true,
      });
    }
  }

  successHandler() {
    this.props.onSendMessage("InformalEvent Added Successfully", "info");
    this.formRef.current.reset();
    window.location.href = "/dashboard/informalEventSummary";
  }

  fieldChangHandler(key, informalEvent) {
    let updatedValues = this.state.initialValues;
    Object.keys(updatedValues).forEach((fieldKey) => {
      if (fieldKey === key) {
        updatedValues[fieldKey].value = informalEvent.target.value;
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

  onInformalEventImageChange(informalEvent, uploadType) {
    let selectedFile = informalEvent.target.files[0];
    const formData = new FormData();
    formData.append("image_upload", selectedFile);
    formData.append("upload_type", uploadType);
    formData.append("entity_type", "informal_event");
    let updatedValues = this.state.initialValues;
    Object.keys(updatedValues).forEach((fieldKey) => {
      if (fieldKey === "image_upload") {
        updatedValues[fieldKey].value = selectedFile;
      }
    });
    var reader = new FileReader();
    reader.onloadend = this.loadImage.bind(this, reader, uploadType);
    reader.readAsDataURL(selectedFile);
    if (uploadType === "informal_event-timeline") {
      this.setState({
        initalValues: updatedValues,
        informalEventTimelineImageFormData: formData,
      });
    } else {
      this.setState({
        initalValues: updatedValues,
        informalEventImageFormData: formData,
      });
    }
  }
  changePictureHandler(type) {
    if (type === "informal_event-timeline") {
      this.timelineImageInputRef.current.click();
    } else {
      this.imageInputRef.current.click();
    }
  }

  loadImage(reader, uploadType) {
    let src = reader.result;
    if (uploadType === "informal_event-timeline") {
      this.setState({ informalEventTimelineImage: src });
    } else {
      this.setState({ informalEventImage: src });
    }
  }

  render() {
    if (
      this.state.informalEventImageUploadSuccess &&
      this.state.informalEventTimelineImageUploadSuccess
    ) {
      this.successHandler();
    }
    return (
      <div className={classes.AddInformalEvent}>
        <MatBackdrop open={this.props.loading}></MatBackdrop>
        <div className={classes.PageHeader}>
          <h2>Add Informal Event</h2>
        </div>
        <form
          ref={this.formRef}
          className={classes.Form}
          onChange={() => this.validate.bind(this)()}
        >
          <div className={classes.InformalEventImageSection}>
            <div className={classes.InformalEventImage}>
              <CustomImage
                src={
                  this.state.informalEventImage
                    ? this.state.informalEventImage
                    : DefaultImage
                }
                useCustomSrc={true}
                alt="InformalEvent"
              />
            </div>
            <input
              type="file"
              onChange={(informalEvent) =>
                this.onInformalEventImageChange.bind(
                  this,
                  informalEvent,
                  "informal_event"
                )()
              }
              hidden
              ref={this.imageInputRef}
            />
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={this.changePictureHandler.bind(this, "informalEvent")}
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
            onChange={(informalEvent) =>
              this.fieldChangHandler.bind(this, "title", informalEvent)()
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
            onChange={(informalEvent) =>
              this.fieldChangHandler.bind(this, "slug", informalEvent)()
            }
            helperText={this.state.initialValues.slug.errorMessage}
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-age-native-simple">
              Informal Event Type
            </InputLabel>
            <Select
              native
              label="InformalEvent Type"
              inputProps={{
                name: "informalEvent_type",
                id: "outlined-age-native-simple",
              }}
              onChange={(informalEvent) =>
                this.fieldChangHandler.bind(this, "type", informalEvent)()
              }
              fullWidth
            >
              {this.props.categories ? (
                [
                  ...informalEventTypes.map((option, i) => {
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
              label="New InformalEvent Type"
              onChange={(informalEvent) =>
                this.fieldChangHandler.bind(this, "new_type", informalEvent)()
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
                label="InformalEvent Start Dsate"
                name="informal_event_date"
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
                label="Informal Event Start Time"
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
                label="Informal Event End Date"
                name="informalEvent_date"
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
                label="Informal Event End Time"
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
            label="Informal Event Venue"
            onChange={(informalEvent) =>
              this.fieldChangHandler.bind(this, "venue", informalEvent)()
            }
            helperText=""
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.initialValues.organizer.error}
            id="organizer"
            name="organizer"
            label="Organizer"
            onChange={(informalEvent) =>
              this.fieldChangHandler.bind(this, "organizer", informalEvent)()
            }
            helperText=""
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.initialValues.conclave.error}
            id="conclave"
            name="conclave"
            label="Conclave"
            onChange={(informalEvent) =>
              this.fieldChangHandler.bind(this, "conclave", informalEvent)()
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
            onChange={(informalEvent) =>
              this.fieldChangHandler.bind(this, "price", informalEvent)()
            }
            helperText=""
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <FormControl fullWidth>
            <p className={classes.InputLabel}>Informal Event Contact Details</p>
            <CKEditor
              editor={ClassicEditor}
              onChange={(informalEvent, editor) =>
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
              onChange={(informalEvent, editor) =>
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
              onChange={(informalEvent, editor) =>
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
            <p className={classes.InputLabel}>Background Info</p>
            <CKEditor
              editor={ClassicEditor}
              onChange={(informalEvent, editor) =>
                this.ckEditorFieldChangHandler.bind(
                  this,
                  "background_info",
                  editor.getData()
                )()
              }
            ></CKEditor>
          </FormControl>
          <div className={classes.Spacer}></div>
          <FormControl fullWidth>
            <p className={classes.InputLabel}>FAQ</p>
            <CKEditor
              editor={ClassicEditor}
              onChange={(informalEvent, editor) =>
                this.ckEditorFieldChangHandler.bind(
                  this,
                  "faq",
                  editor.getData()
                )()
              }
            ></CKEditor>
          </FormControl>
          <div className={classes.Spacer}></div>
          <FormControl fullWidth>
            <p className={classes.InputLabel}>Terms Condition</p>
            <CKEditor
              editor={ClassicEditor}
              onChange={(informalEvent, editor) =>
                this.ckEditorFieldChangHandler.bind(
                  this,
                  "terms_condition",
                  editor.getData()
                )()
              }
            ></CKEditor>
          </FormControl>
          <div className={classes.Spacer}></div>
          <div className={classes.InformalEventTimelineImageSection}>
            <h3 className={classes.TimelineImageHeader}>Timeline Image</h3>
            <div className={classes.InformalEventTimelineImage}>
              <CustomImage
                src={
                  this.state.informalEventTimelineImage
                    ? this.state.informalEventTimelineImage
                    : DefaultImage
                }
                useCustomSrc={true}
                alt="InformalEvent"
              />
            </div>
            <input
              type="file"
              onChange={(informalEvent) =>
                this.onInformalEventImageChange.bind(
                  this,
                  informalEvent,
                  "informal_event-timeline"
                )()
              }
              hidden
              ref={this.timelineImageInputRef}
            />
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={this.changePictureHandler.bind(
                this,
                "informal_event-timeline"
              )}
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
            type="number"
            onChange={(informalEvent) =>
              this.fieldChangHandler.bind(this, "view_order", informalEvent)()
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
              style={{ display: "flex", flexDirection: "row" }}
              onChange={(informalEvent) =>
                this.fieldChangHandler.bind(
                  this,
                  "show_in_home_page",
                  informalEvent
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
              style={{ display: "flex", flexDirection: "row" }}
              onChange={(informalEvent) =>
                this.fieldChangHandler.bind(this, "visible", informalEvent)()
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
    error: state.informalEvent.error,
    categories: state.informalEvent.categories,
    loading: state.auth.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchCategories: () => dispatch(actions.fetchInformalEventCategories()),
    onAddInformalEvent: (informalEventData, cb) =>
      dispatch(actions.addInformalEvent(informalEventData, cb)),
    onSendMessage: (message, messageType) =>
      dispatch(actions.sendMessage(message, messageType)),
    stopLoading: () => dispatch(actions.stopLoading()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddInformalEvent);
