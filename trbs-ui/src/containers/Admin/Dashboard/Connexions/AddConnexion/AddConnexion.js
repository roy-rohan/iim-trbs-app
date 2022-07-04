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
import * as classes from "./AddConnexion.module.css";
import { initalValues } from "./InitialData";

class AddConnexion extends Component {
  state = {
    initialValues: initalValues,
    connexionTypesDropdown: [{ key: "Select an option", value: null }],
    connexionImage: null,
    connexionTimelineImage: null,
    connexionImageFormData: new FormData(),
    connexionTimelineImageFormData: new FormData(),
    isFormValid: true,
    connexionImageUploadSuccess: false,
    connexionTimelineImageUploadSuccess: false,
  };

  constructor() {
    super();
    this.submitBtnRef = React.createRef();
    this.imageInputRef = React.createRef();
    this.timelineImageInputRef = React.createRef();
    this.formRef = React.createRef();
  }
  s;
  componentDidMount() {
    this.props.onFetchCategories(
      JSON.stringify({
        filters: [
          { field_name: "e.type", value: this.props.category, op: "=" },
        ],
        filter_op: "",
        sort: [],
      })
    );
    this.props.stopLoading();
  }

  onFormSubmit(connexion) {
    connexion.preventDefault();
    this.submitBtnRef.current.textContent = "Please wait...";
    let isValid = this.validate();
    if (isValid) {
      // make a request
      let connexionData = {};
      if (this.state.initalValues) {
        Object.keys(this.state.initalValues).forEach((key) => {
          connexionData[key] = this.state.initialValues[key].value;
        });
        this.submitBtnRef.current.textContent = "Submit";
        this.props.onAddConnexion(connexionData, this.uploadImages.bind(this));
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

  uploadImages(connexionId) {
    if (this.state.connexionImage !== null) {
      let connexionImageformData = this.state.connexionImageFormData;
      connexionImageformData.append("entity_id", connexionId);
      uploadNewImage(connexionImageformData, () =>
        this.setState({ ...this.state, connexionImageUploadSuccess: true })
      );
    } else {
      this.setState({ ...this.state, connexionImageUploadSuccess: true });
    }
    if (this.state.connexionTimelineImage !== null) {
      let timelineConnexionImageformData =
        this.state.connexionTimelineImageFormData;
      timelineConnexionImageformData.append("entity_id", connexionId);
      uploadNewImage(timelineConnexionImageformData, () =>
        this.setState({
          ...this.state,
          connexionTimelineImageUploadSuccess: true,
        })
      );
    } else {
      this.setState({
        ...this.state,
        connexionTimelineImageUploadSuccess: true,
      });
    }
  }

  successHandler() {
    this.props.onSendMessage("Connexion Added Successfully", "info");
    this.formRef.current.reset();
    window.location.href = "/dashboard/connexionSummary";
  }

  fieldChangHandler(key, connexion) {
    let updatedValues = this.state.initialValues;
    Object.keys(updatedValues).forEach((fieldKey) => {
      if (fieldKey === key) {
        updatedValues[fieldKey].value = connexion.target.value;
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

  onConnexionImageChange(connexion, uploadType) {
    let selectedFile = connexion.target.files[0];
    const formData = new FormData();
    formData.append("image_upload", selectedFile);
    formData.append("upload_type", uploadType);
    formData.append("entity_type", "connexion");
    let updatedValues = this.state.initialValues;
    Object.keys(updatedValues).forEach((fieldKey) => {
      if (fieldKey === "image_upload") {
        updatedValues[fieldKey].value = selectedFile;
      }
    });
    var reader = new FileReader();
    reader.onloadend = this.loadImage.bind(this, reader, uploadType);
    reader.readAsDataURL(selectedFile);
    if (uploadType === "connexion-timeline") {
      this.setState({
        initalValues: updatedValues,
        connexionTimelineImageFormData: formData,
      });
    } else {
      this.setState({
        initalValues: updatedValues,
        connexionImageFormData: formData,
      });
    }
  }
  changePictureHandler(type) {
    if (type === "connexion-timeline") {
      this.timelineImageInputRef.current.click();
    } else {
      this.imageInputRef.current.click();
    }
  }

  loadImage(reader, uploadType) {
    let src = reader.result;
    if (uploadType === "connexion-timeline") {
      this.setState({ connexionTimelineImage: src });
    } else {
      this.setState({ connexionImage: src });
    }
  }

  render() {
    if (
      this.state.connexionImageUploadSuccess &&
      this.state.connexionTimelineImageUploadSuccess
    ) {
      this.successHandler();
    }
    return (
      <div className={classes.AddConnexion}>
        <MatBackdrop open={this.props.loading}></MatBackdrop>
        <div className={classes.PageHeader}>
          <h2>Add Connexion</h2>
        </div>
        <form
          ref={this.formRef}
          className={classes.Form}
          onChange={() => this.validate.bind(this)()}
        >
          <div className={classes.ConnexionImageSection}>
            <div className={classes.ConnexionImage}>
              <CustomImage
                src={
                  this.state.connexionImage
                    ? this.state.connexionImage
                    : DefaultImage
                }
                useCustomSrc={true}
                alt="Connexion"
              />
            </div>
            <input
              type="file"
              onChange={(connexion) =>
                this.onConnexionImageChange.bind(this, connexion, "connexion")()
              }
              hidden
              ref={this.imageInputRef}
            />
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={this.changePictureHandler.bind(this, "connexion")}
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
            onChange={(connexion) =>
              this.fieldChangHandler.bind(this, "name", connexion)()
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
            onChange={(connexion) =>
              this.fieldChangHandler.bind(this, "slug", connexion)()
            }
            helperText={this.state.initialValues.slug.errorMessage}
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-age-native-simple">
              Connexion Type
            </InputLabel>
            <Select
              native
              label="Connexion Type"
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
                  <option value="" selected></option>,
                  this.props.categories.map((option, i) => {
                    return (
                      <option selected key={i} value={option}>
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
              label="New Connexion Type"
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
                label="Date"
                name="Date"
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
            onChange={(connexion) =>
              this.fieldChangHandler.bind(this, "topic", connexion)()
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
            onChange={(connexion) =>
              this.fieldChangHandler.bind(this, "designation", connexion)()
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
            label="Connexion Venue"
            onChange={(connexion) =>
              this.fieldChangHandler.bind(this, "venue", connexion)()
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
            onChange={(connexion) =>
              this.fieldChangHandler.bind(this, "duration", connexion)()
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
            onChange={(connexion) =>
              this.fieldChangHandler.bind(this, "price", connexion)()
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
              onChange={(connexion, editor) =>
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
              onChange={(connexion, editor) =>
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
              onChange={(connexion, editor) =>
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
            error={this.state.initialValues.view_order.error}
            id="view_order"
            name="view_order"
            label="View Order"
            type="number"
            onChange={(connexion) =>
              this.fieldChangHandler.bind(this, "view_order", connexion)()
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
              onChange={(connexion) =>
                this.fieldChangHandler.bind(
                  this,
                  "show_in_home_page",
                  connexion
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
              onChange={(connexion) =>
                this.fieldChangHandler.bind(this, "visible", connexion)()
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
    error: state.connexion.error,
    categories: state.connexion.categories,
    loading: state.auth.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchCategories: () => dispatch(actions.fetchConnexionCategories()),
    onAddConnexion: (connexionData, cb) =>
      dispatch(actions.addConnexion(connexionData, cb)),
    onSendMessage: (message, messageType) =>
      dispatch(actions.sendMessage(message, messageType)),
    stopLoading: () => dispatch(actions.stopLoading()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddConnexion);
