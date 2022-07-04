import {
  Backdrop,
  Button,
  Fade,
  FormControl,
  FormControlLabel,
  FormLabel, InputLabel, Modal, Radio,
  RadioGroup, Select, TextField
} from "@material-ui/core";
import {
  convertToRaw,
  EditorState
} from 'draft-js';
import draftToHtml from "draftjs-to-html";
import ColorPicker from "material-ui-color-picker";
import React, { Component } from "react";
import {
  Editor
} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { connect } from "react-redux";
import DefaultImage from "../../../../../assets/images/common/default.png";
import Certificate from "../../../../../components/Certificate/Certificate";
import MatBackdrop from "../../../../../components/UI/Backdrop/MatBackdrop/MatBackdrop";
import CustomImage from "../../../../../components/UI/CustomImage/CustomImage";
import * as actions from "../../../../../store/actions/index";
import { certificateTypes } from "../../../../../utils/certificateTypes";
import { uploadNewImage } from "../../../../../utils/imageUploadUtil";
import * as classes from "./AddCertificate.module.css";
import { initalValues } from "./InitialData";

class AddCertificate extends Component {
  state = {
    backgroundColor: "",
    initialValues: initalValues,
    certificateTypesDropdown: [{
      key: null,
      value: "Select an option"
    }],
    editorState: EditorState.createEmpty(),
    certificateImage: null,
    certificateTimelineImage: null,
    certificateImageFormData: new FormData(),
    certificateTimelineImageFormData: new FormData(),
    isFormValid: true,
    certificateImageUploadSuccess: false,
    certificateTimelineImageUploadSuccess: false,
    showCertificatePreview: false
  };

  constructor() {
    super();
    this.submitBtnRef = React.createRef();
    this.imageInputRef = React.createRef();
    this.timelineImageInputRef = React.createRef();
    this.formRef = React.createRef();
    this.certificateComp = React.createRef()
  }
  componentDidMount() {
    let modifiedCertificateTypeDropdown = [...this.state.certificateTypesDropdown];
    for(let key in certificateTypes){
      modifiedCertificateTypeDropdown.push({
          key: key,
          value: certificateTypes[key]
        })
    }

    this.setState({
      certificateTypesDropdown: modifiedCertificateTypeDropdown
    });
    
    this.props.stopLoading();
  }
  
  onFormSubmit(certificate) {
    certificate.preventDefault();
    this.submitBtnRef.current.textContent = "Please wait...";
    let isValid = this.validate();
    if (isValid) {
      // make a request
      let certificateData = {};
      if (this.state.initalValues) {
        Object.keys(this.state.initalValues).forEach((key) => {
          certificateData[key] = this.state.initialValues[key].value;
        });
        this.submitBtnRef.current.textContent = "Submit";
        this.props.onAddCertificate(certificateData, this.uploadImages.bind(this));
      } else {
        this.submitBtnRef.current.textContent = "Submit";
      }
    } else {
      console.log(this.state.initialValues)
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
  
  showPreview (event) {
    this.setState({
      showCertificatePreview: true
    });
  }

  closePreview (event) {
    this.setState({
      showCertificatePreview: false
    });
  }


  uploadImages(certificateId) {
    if (this.state.certificateImage !== null) {
      let certificateImageformData = this.state.certificateImageFormData;
      certificateImageformData.append("entity_id", certificateId);
      uploadNewImage(certificateImageformData, () =>
        this.setState({ ...this.state, certificateImageUploadSuccess: true })
      );
    } else {
      this.setState({ ...this.state, certificateImageUploadSuccess: true });
    }
    if (this.state.certificateTimelineImage !== null) {
      let timelineCertificateImageformData =
        this.state.certificateTimelineImageFormData;
      timelineCertificateImageformData.append("entity_id", certificateId);
      uploadNewImage(timelineCertificateImageformData, () =>
        this.setState({
          ...this.state,
          certificateTimelineImageUploadSuccess: true,
        })
      );
    } else {
      this.setState({
        ...this.state,
        certificateTimelineImageUploadSuccess: true,
      });
    }
  }

  successHandler() {
    this.props.onSendMessage("Certificate Added Successfully", "info");
    this.formRef.current.reset();
    window.location.href = "/dashboard/certificateSummary";
  }

  fieldChangHandler(key, certificate) {
    let updatedValues = this.state.initialValues;
    Object.keys(updatedValues).forEach((fieldKey) => {
      if (fieldKey === key) {
        updatedValues[fieldKey].value = certificate.target.value;
      }
    });
    this.setState({ initalValues: updatedValues });
  }

  onBackgroundColorChange (color) {
    let updatedValues = this.state.initialValues;
    Object.keys(updatedValues).forEach((fieldKey) => {
      if (fieldKey === "content_background_color") {
        updatedValues[fieldKey].value = color;
      }
    });
    this.setState({
      initalValues: updatedValues,
      backgroundColor: color
    });
  }

  editorFieldChangHandler(key, data) {
    let updatedValues = this.state.initialValues;
    let htmlData = draftToHtml(convertToRaw(data.getCurrentContent()));
    Object.keys(updatedValues).forEach((fieldKey) => {
      if (fieldKey === key) {
        updatedValues[fieldKey].value = htmlData;
      }
    });
    this.setState({
      initalValues: updatedValues,
      editorState: data
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

  onCertificateImageChange(certificate, uploadType) {
    let selectedFile = certificate.target.files[0];
    const formData = new FormData();
    formData.append("image_upload", selectedFile);
    formData.append("upload_type", uploadType);
    formData.append("entity_type", "certificate");
    let updatedValues = this.state.initialValues;
    Object.keys(updatedValues).forEach((fieldKey) => {
      if (fieldKey === "image_upload") {
        updatedValues[fieldKey].value = selectedFile;
      }
    });
    var reader = new FileReader();
    reader.onloadend = this.loadImage.bind(this, reader, uploadType);
    reader.readAsDataURL(selectedFile);
    if (uploadType === "certificate-timeline") {
      this.setState({
        initalValues: updatedValues,
        certificateTimelineImageFormData: formData,
      });
    } else {
      this.setState({
        initalValues: updatedValues,
        certificateImageFormData: formData,
      });
    }
  }
  changePictureHandler(type) {
    if (type === "certificate-timeline") {
      this.timelineImageInputRef.current.click();
    } else {
      this.imageInputRef.current.click();
    }
  }

  loadImage(reader, uploadType) {
    let src = reader.result;
    if (uploadType === "certificate-timeline") {
      this.setState({ certificateTimelineImage: src });
    } else {
      this.setState({ certificateImage: src });
    }
  }

  render() {
    if (
      this.state.certificateImageUploadSuccess &&
      this.state.certificateTimelineImageUploadSuccess
    ) {
      this.successHandler();
    }
    return (
      <div className={classes.AddCertificate}>
        <MatBackdrop open={this.props.loading}></MatBackdrop>
        <div className={classes.PageHeader}>
          <h2>Add Certificate</h2>
        </div>
        <form
          ref={this.formRef}
          className={classes.Form}
          onChange={() => this.validate.bind(this)()}
        >
          <div className={classes.CertificateImageSection}>
            <div className={classes.CertificateImage}>
              <CustomImage
                src={
                  this.state.certificateImage
                    ? this.state.certificateImage
                    : DefaultImage
                }
                useCustomSrc={true}
                alt="Certificate"
              />
            </div>
            <input
              type="file"
              onChange={(certificate) =>
                this.onCertificateImageChange.bind(this, certificate, "certificate")()
              }
              hidden
              ref={this.imageInputRef}
            />
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={this.changePictureHandler.bind(this, "certificate")}
            >
              Change Background Picture
            </Button>
          </div>
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.initialValues.name.error}
            id="name"
            name="name"
            label="Name"
            onChange={(certificate) =>
              this.fieldChangHandler.bind(this, "name", certificate)()
            }
            helperText={this.state.initialValues.name.errorMessage}
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <FormControl fullWidth>
            <p className={classes.InputLabel}>Content</p>
          <Editor editorState = {
            this.state.editorState
          }
          wrapperClassName = "demo-wrapper"
          editorClassName = "demo-editor"
          onEditorStateChange = {
            (editorState) => this.editorFieldChangHandler("content", editorState)
          }
          editorStyle={{
            border: "1px solid rgb(205 202 202)"
          }}
          />
          </FormControl>
          <div className={classes.Spacer}></div>
          <ColorPicker
            fullWidth
            defaultValue = "Content Background Color: Click to select the color"
            variant="outlined"
            name='color'
            disabled
            value={this.state.backgroundColor}
            onChange = {(color) =>this.onBackgroundColorChange(color)}
          />
          <div className={classes.Spacer}></div>
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-age-native-simple">
              Content Position
            </InputLabel>
            <Select
              native
              label = "Content Position"
              inputProps={{
                name: "content_position_absolute",
                id: "outlined-age-native-simple",
              }}
              onChange={(event) =>
                this.fieldChangHandler.bind(this, "content_position_absolute", event)()
              }
              fullWidth
            >
              [
                {
                  this.state.certificateTypesDropdown.map((option, i) => {
                    return ( <option key={i} value={option.value}>{option.value}</option> );
                  })
                }
              ]
            </Select>
          </FormControl>
          {this.state.initialValues.content_position_absolute.value === certificateTypes.CUSTOM_POSITION ? <>
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.initialValues.content_position_x.error}
            id = "content_position_x"
            name = "content_position_x"
            label = "Percentage from top"
            type="number"
            onChange={(certificate) =>
              this.fieldChangHandler.bind(this, "content_position_x", certificate)()
            }
            helperText=""
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <TextField
            error = {
              this.state.initialValues.content_position_y.error
            }
            id = "content_position_y"
            name = "content_position_y"
            label = "Percentage from right"
            type="number"
            onChange={(certificate) =>
              this.fieldChangHandler.bind(this, "content_position_y", certificate)()
            }
            helperText=""
            variant="outlined"
            fullWidth
          />
          </> : null}
          <div className={classes.Spacer}></div>
          <FormControl component="fieldset">
            <FormLabel component="legend">Visible ?</FormLabel>
            <RadioGroup
              aria-label="visible"
              name="visible"
              style={{ display: "flex", flexDirection: "row" }}
              onChange={(certificate) =>
                this.fieldChangHandler.bind(this, "visible", certificate)()
              }
            >
              <FormControlLabel value="1" control={<Radio />} label="Yes" />
              <FormControlLabel value="0" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
          <div className={classes.Spacer}></div>
            <Button
              variant="contained"
              color="primary"
              onClick={this.showPreview.bind(this)}
            >
              Preview Certificate
            </Button>
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
          <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.CertificateModal}
          open={this.state.showCertificatePreview}
          onClose={() => this.closePreview()}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500
          }}
        >
          <Fade in = {
            this.state.showCertificatePreview
          } >
            <div className = {
              classes.CertificateModalInner
            } >
              <Certificate
                ref={this.certificateComp}
                // showPrintBtn={true}
                documentTitle = {this.state.initialValues.name.value}
                imageUrl={this.state.certificateImage}
                contentText={this.state.initialValues.content.value}
                contentPosition={this.state.initialValues.content_position_absolute.value}
                contentBackgroundColor = {
                  this.state.initialValues.content_background_color.value
                }
                contentPositionX = {
                  this.state.initialValues.content_position_x.value
                }
                 contentPositionY = {
                  this.state.initialValues.content_position_y.value
                }
              />
            </div>
          </Fade>
        </Modal>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.certificate.error,
    loading: state.auth.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAddCertificate: (certificateData, cb) =>
      dispatch(actions.addCertificate(certificateData, cb)),
    onSendMessage: (message, messageType) =>
      dispatch(actions.sendMessage(message, messageType)),
    stopLoading: () => dispatch(actions.stopLoading()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddCertificate);
