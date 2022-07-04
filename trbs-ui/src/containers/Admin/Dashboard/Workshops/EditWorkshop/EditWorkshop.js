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
import * as classes from "./EditWorkshop.module.css";
import { initalValues } from "./InitialData";

class EditWorkshop extends Component {
  state = {
    initialValues: initalValues,
    workshopTypesDropdown: [{ key: "Select an option", value: null }],
    workshopImage: null,
    workshopTimelineImage: null,
    workshopImageFormData: new FormData(),
    workshopTimelineImageFormData: new FormData(),
    isFormValid: true,
    workshopImageUploadSuccess: false,
    workshopTimelineImageUploadSuccess: false,
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
      .get("/workshops/read-single.php?id=" + queryParams.workshopId)
      .then((response) => {
        let workshopData = response.data;
        let updatedValues = { ...this.state.initialValues };
        for (let attr in updatedValues) {
          updatedValues[attr].value = workshopData[attr];
        }
        this.setState({ initalValues: updatedValues });
        this.props.stopLoading();
      })
      .catch((error) => {
        this.props.onSendMessage("Something went wrong. ", "error");
        window.location.href = "/dashboard/workshopSummary";
      });
  }

  onFormSubmit(workshop) {
    workshop.preventDefault();
    // this.submitBtnRef.current.textContent = "Please wait...";
    let isValid = this.validate();
    if (isValid) {
      // make a request
      let workshopData = {};
      if (this.state.initalValues) {
        Object.keys(this.state.initalValues).forEach((key) => {
          workshopData[key] = this.state.initialValues[key].value;
        });
        this.submitBtnRef.current.textContent = "Submit";
        this.props.onEditWorkshop(workshopData, this.uploadImages.bind(this));
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
    if (this.state.workshopImage !== null) {
      let workshopImageformData = this.state.workshopImageFormData;
      workshopImageformData.append(
        "entity_id",
        this.state.initialValues.workshop_id.value
      );
      if (workshopImageformData.get("path") === "null") {
        uploadNewImage(workshopImageformData, () => {
          this.setState({
            ...this.state,
            workshopImageUploadSuccess: true,
          });
        });
      } else {
        updateImage(workshopImageformData, () =>
          this.setState({ ...this.state, workshopImageUploadSuccess: true })
        );
      }
    } else {
      this.setState({ ...this.state, workshopImageUploadSuccess: true });
    }

    if (this.state.workshopTimelineImage !== null) {
      let timelineWorkshopImageformData =
        this.state.workshopTimelineImageFormData;
      timelineWorkshopImageformData.append(
        "entity_id",
        this.state.initialValues.workshop_id.value
      );
      if (timelineWorkshopImageformData.get("path") === "null") {
        // image was not present workshop when added, now being added first time
        uploadNewImage(timelineWorkshopImageformData, () => {
          this.setState({
            ...this.state,
            workshopTimelineImageUploadSuccess: true,
          });
        });
      } else {
        updateImage(timelineWorkshopImageformData, () =>
          this.setState({
            ...this.state,
            workshopTimelineImageUploadSuccess: true,
          })
        );
      }
    } else {
      this.setState({
        ...this.state,
        workshopTimelineImageUploadSuccess: true,
      });
    }
  }

  successHandler() {
    this.props.onSendMessage("Workshop Edited Successfully", "info");
    this.formRef.current.reset();
    window.location.href = "/dashboard/workshopSummary";
  }

  fieldChangHandler(key, workshop) {
    let updatedValues = this.state.initialValues;
    Object.keys(updatedValues).forEach((fieldKey) => {
      if (fieldKey === key) {
        updatedValues[fieldKey].value = workshop.target.value;
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

  onWorkshopImageChange(workshop, uploadType) {
    let selectedFile = workshop.target.files[0];
    const formData = new FormData();
    formData.append("image_upload", selectedFile);
    let path =
      uploadType === "workshop"
        ? this.state.initialValues.image_url.value
        : uploadType === "workshop-timeline"
        ? this.state.initialValues.timeline_image_url.value
        : null;
    formData.append("path", path);
    formData.append("upload_type", uploadType);
    formData.append("entity_type", "workshop");
    let updatedValues = this.state.initialValues;
    Object.keys(updatedValues).forEach((fieldKey) => {
      if (fieldKey === "image_upload") {
        updatedValues[fieldKey].value = selectedFile;
      }
    });
    var reader = new FileReader();
    reader.onloadend = this.loadImage.bind(this, reader, uploadType);
    reader.readAsDataURL(selectedFile);
    if (uploadType === "workshop-timeline") {
      this.setState({
        initalValues: updatedValues,
        workshopTimelineImageFormData: formData,
      });
    } else {
      this.setState({
        initalValues: updatedValues,
        workshopImageFormData: formData,
      });
    }
  }
  changePictureHandler(type) {
    if (type === "workshop-timeline") {
      this.timelineImageInputRef.current.click();
    } else {
      this.imageInputRef.current.click();
    }
  }

  loadImage(reader, uploadType) {
    let src = reader.result;
    if (uploadType === "workshop-timeline") {
      this.setState({ workshopTimelineImage: src });
    } else {
      this.setState({ workshopImage: src });
    }
  }

  render() {
    if (
      this.state.workshopImageUploadSuccess &&
      this.state.workshopTimelineImageUploadSuccess
    ) {
      this.successHandler();
    }
    return (
      <div className={classes.EditWorkshop}>
        <MatBackdrop open={this.props.loading}></MatBackdrop>
        <div className={classes.PageHeader}>
          <h2>Edit Workshop</h2>
        </div>
        <form
          ref={this.formRef}
          className={classes.Form}
          // onChange={() => this.validate.bind(this)()}
        >
          <div className={classes.WorkshopImageSection}>
            <div className={classes.WorkshopImage}>
              <CustomImage
                src={
                  this.state.workshopImage
                    ? this.state.workshopImage
                    : this.state.initialValues.image_url.value
                    ? this.state.initialValues.image_url.value
                    : DefaultImage
                }
                useCustomSrc={
                  this.state.workshopImage
                    ? true
                    : this.state.initialValues.image_url.value
                    ? false
                    : true
                }
                alt="Workshop"
              />
            </div>
            <input
              type="file"
              onChange={(workshop) =>
                this.onWorkshopImageChange.bind(this, workshop, "workshop")()
              }
              hidden
              ref={this.imageInputRef}
            />
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={this.changePictureHandler.bind(this, "workshop")}
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
            onChange={(workshop) =>
              this.fieldChangHandler.bind(this, "title", workshop)()
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
            onChange={(workshop) =>
              this.fieldChangHandler.bind(this, "slug", workshop)()
            }
            helperText={this.state.initialValues.slug.errorMessage}
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-age-native-simple">
              Workshop Type
            </InputLabel>
            <Select
              native
              label="Workshop Type"
              value={this.state.initialValues.type.value}
              inputProps={{
                name: "workshop_type",
                id: "outlined-age-native-simple",
              }}
              onChange={(workshop) =>
                this.fieldChangHandler.bind(this, "type", workshop)()
              }
              fullWidth
            >
              {this.props.categories ? (
                [
                  <option value="" selected></option>,
                  this.props.categories.map((option, i) => {
                    return (
                      <option key={i} value={option}>
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
              label="New Workshop Type"
              onChange={(workshop) =>
                this.fieldChangHandler.bind(this, "new_type", workshop)()
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
                label="Workshop Start Dsate"
                name="workshop_date"
                format="DD/MM/yyyy"
                value={this.state.initialValues.workshop_date.value}
                onChange={(date, value) => {
                  this.dateFieldChangeHandler.bind(
                    this,
                    "workshop_date",
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
                label="Workshop Start Time"
                value={this.state.initialValues.workshop_time.value}
                onChange={(date, value) => {
                  this.dateFieldChangeHandler.bind(
                    this,
                    "workshop_time",
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
                label="Workshop End Date"
                name="workshop_date"
                format="DD/MM/yyyy"
                value={this.state.initialValues.workshop_end_date.value}
                onChange={(date, value) => {
                  this.dateFieldChangeHandler.bind(
                    this,
                    "workshop_end_date",
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
                label="Workshop End Time"
                value={this.state.initialValues.workshop_end_time.value}
                onChange={(date, value) => {
                  this.dateFieldChangeHandler.bind(
                    this,
                    "workshop_end_time",
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
            label="Workshop Venue"
            value={this.state.initialValues.venue.value}
            onChange={(workshop) =>
              this.fieldChangHandler.bind(this, "venue", workshop)()
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
            value={this.state.initialValues.organizer.value}
            onChange={(workshop) =>
              this.fieldChangHandler.bind(this, "organizer", workshop)()
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
            onChange={(workshop) =>
              this.fieldChangHandler.bind(this, "conclave", workshop)()
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
            onChange={(workshop) =>
              this.fieldChangHandler.bind(this, "price", workshop)()
            }
            helperText=""
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <FormControl fullWidth>
            <p className={classes.InputLabel}>Workshop Contact Details</p>
            <CKEditor
              editor={ClassicEditor}
              onInit={(editor) => {}}
              data={this.state.initialValues.contact.value}
              onChange={(workshop, editor) =>
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
              onChange={(workshop, editor) =>
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
              onChange={(workshop, editor) =>
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
              data={this.state.initialValues.background_info.value}
              onInit={(editor) => {}}
              onChange={(workshop, editor) =>
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
            <p className={classes.InputLabel}>Terms Condition</p>
            <CKEditor
              editor={ClassicEditor}
              data={this.state.initialValues.terms_condition.value}
              onInit={(editor) => {}}
              onChange={(workshop, editor) =>
                this.ckEditorFieldChangHandler.bind(
                  this,
                  "terms_condition",
                  editor.getData()
                )()
              }
            ></CKEditor>
          </FormControl>
          <div className={classes.Spacer}></div>
          <div className={classes.WorkshopTimelineImageSection}>
            <h3 className={classes.TimelineImageHeader}>Timeline Image</h3>
            <div className={classes.WorkshopTimelineImage}>
              <CustomImage
                src={
                  this.state.workshopTimelineImage
                    ? this.state.workshopTimelineImage
                    : this.state.initialValues.timeline_image_url.value
                    ? this.state.initialValues.timeline_image_url.value
                    : DefaultImage
                }
                useCustomSrc={
                  this.state.workshopTimelineImage
                    ? true
                    : this.state.initialValues.timeline_image_url.value
                    ? false
                    : true
                }
                alt="Workshop"
              />
            </div>
            <input
              type="file"
              onChange={(workshop) =>
                this.onWorkshopImageChange.bind(
                  this,
                  workshop,
                  "workshop-timeline"
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
                "workshop-timeline"
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
            value={this.state.initialValues.view_order.value}
            type="number"
            onChange={(workshop) =>
              this.fieldChangHandler.bind(this, "view_order", workshop)()
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
              onChange={(workshop) =>
                this.fieldChangHandler.bind(
                  this,
                  "show_in_home_page",
                  workshop
                )()
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
              value={this.state.initialValues.visible.value}
              style={{ display: "flex", flexDirection: "row" }}
              onChange={(workshop) =>
                this.fieldChangHandler.bind(this, "visible", workshop)()
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
    error: state.workshop.error,
    categories: state.workshop.categories,
    loading: state.auth.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchWorkshops: () => dispatch(actions.fetchWorkshops()),
    onEditWorkshop: (workshopData, cb) =>
      dispatch(actions.editWorkshop(workshopData, cb)),
    onSendMessage: (message, messageType) =>
      dispatch(actions.sendMessage(message, messageType)),

    stopLoading: () => dispatch(actions.stopLoading()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EditWorkshop)
);
