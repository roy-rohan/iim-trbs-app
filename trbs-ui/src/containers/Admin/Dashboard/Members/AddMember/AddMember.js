import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import DefaultImage from "../../../../../assets/images/common/default.png";
import MatBackdrop from "../../../../../components/UI/Backdrop/MatBackdrop/MatBackdrop";
import CustomImage from "../../../../../components/UI/CustomImage/CustomImage";
import * as actions from "../../../../../store/actions/index";
import { uploadNewImage } from "../../../../../utils/imageUploadUtil";
import * as classes from "./AddMember.module.css";
import { initalValues } from "./InitialData";

class AddMember extends Component {
  state = {
    initialValues: initalValues,
    memberTypesDropdown: [{ key: "Select an option", value: null }],
    memberImage: null,
    memberTimelineImage: null,
    memberImageFormData: new FormData(),
    memberTimelineImageFormData: new FormData(),
    isFormValid: true,
    memberImageUploadSuccess: false,
    memberTimelineImageUploadSuccess: false,
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

  onFormSubmit(member) {
    member.preventDefault();
    this.submitBtnRef.current.textContent = "Please wait...";
    let isValid = this.validate();
    if (isValid) {
      // make a request
      let memberData = {};
      if (this.state.initalValues) {
        Object.keys(this.state.initalValues).forEach((key) => {
          memberData[key] = this.state.initialValues[key].value;
        });
        this.submitBtnRef.current.textContent = "Submit";
        this.props.onAddMember(memberData, this.uploadImages.bind(this));
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

  uploadImages(memberId) {
    if (this.state.memberImage !== null) {
      let memberImageformData = this.state.memberImageFormData;
      memberImageformData.append("entity_id", memberId);
      uploadNewImage(memberImageformData, () =>
        this.setState({ ...this.state, memberImageUploadSuccess: true })
      );
    } else {
      this.setState({ ...this.state, memberImageUploadSuccess: true });
    }
    if (this.state.memberTimelineImage !== null) {
      let timelineMemberImageformData = this.state.memberTimelineImageFormData;
      timelineMemberImageformData.append("entity_id", memberId);
      uploadNewImage(timelineMemberImageformData, () =>
        this.setState({
          ...this.state,
          memberTimelineImageUploadSuccess: true,
        })
      );
    } else {
      this.setState({
        ...this.state,
        memberTimelineImageUploadSuccess: true,
      });
    }
  }

  successHandler() {
    this.props.onSendMessage("Member Added Successfully", "info");
    this.formRef.current.reset();
    window.location.href = "/dashboard/memberSummary";
  }

  fieldChangHandler(key, member) {
    let updatedValues = this.state.initialValues;
    Object.keys(updatedValues).forEach((fieldKey) => {
      if (fieldKey === key) {
        updatedValues[fieldKey].value = member.target.value;
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

  onMemberImageChange(member, uploadType) {
    let selectedFile = member.target.files[0];
    const formData = new FormData();
    formData.append("image_upload", selectedFile);
    formData.append("upload_type", uploadType);
    formData.append("entity_type", "member");
    let updatedValues = this.state.initialValues;
    Object.keys(updatedValues).forEach((fieldKey) => {
      if (fieldKey === "image_upload") {
        updatedValues[fieldKey].value = selectedFile;
      }
    });
    var reader = new FileReader();
    reader.onloadend = this.loadImage.bind(this, reader, uploadType);
    reader.readAsDataURL(selectedFile);
    if (uploadType === "member-timeline") {
      this.setState({
        initalValues: updatedValues,
        memberTimelineImageFormData: formData,
      });
    } else {
      this.setState({
        initalValues: updatedValues,
        memberImageFormData: formData,
      });
    }
  }
  changePictureHandler(type) {
    if (type === "member-timeline") {
      this.timelineImageInputRef.current.click();
    } else {
      this.imageInputRef.current.click();
    }
  }

  loadImage(reader, uploadType) {
    let src = reader.result;
    if (uploadType === "member-timeline") {
      this.setState({ memberTimelineImage: src });
    } else {
      this.setState({ memberImage: src });
    }
  }

  render() {
    if (this.state.memberImageUploadSuccess) {
      this.successHandler();
    }
    return (
      <div className={classes.AddMember}>
        <MatBackdrop open={this.props.loading}></MatBackdrop>
        <div className={classes.PageHeader}>
          <h2>Add Member</h2>
        </div>
        <form
          ref={this.formRef}
          className={classes.Form}
          onChange={() => this.validate.bind(this)()}
        >
          <div className={classes.MemberImageSection}>
            <div className={classes.MemberImage}>
              <CustomImage
                src={
                  this.state.memberImage ? this.state.memberImage : DefaultImage
                }
                useCustomSrc={true}
                alt="Member"
              />
            </div>
            <input
              type="file"
              onChange={(member) =>
                this.onMemberImageChange.bind(this, member, "member")()
              }
              hidden
              ref={this.imageInputRef}
            />
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={this.changePictureHandler.bind(this, "member")}
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
            onChange={(member) =>
              this.fieldChangHandler.bind(this, "name", member)()
            }
            helperText={this.state.initialValues.name.errorMessage}
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.initialValues.designation.error}
            id="designation"
            name="designation"
            label="Designation"
            onChange={(member) =>
              this.fieldChangHandler.bind(this, "designation", member)()
            }
            helperText={this.state.initialValues.designation.errorMessage}
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.initialValues.more_info.error}
            id="more_info"
            name="more_info"
            label="More Info"
            onChange={(member) =>
              this.fieldChangHandler.bind(this, "more_info", member)()
            }
            helperText={this.state.initialValues.more_info.errorMessage}
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <FormControl component="fieldset">
            <FormLabel component="legend">Visible</FormLabel>
            <RadioGroup
              aria-label="visible"
              name="visible"
              style={{ display: "flex", flexDirection: "row" }}
              onChange={(member) =>
                this.fieldChangHandler.bind(this, "visible", member)()
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
    error: state.member.error,
    categories: state.member.categories,
    loading: state.auth.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAddMember: (memberData, cb) =>
      dispatch(actions.addMember(memberData, cb)),
    onSendMessage: (message, messageType) =>
      dispatch(actions.sendMessage(message, messageType)),
    stopLoading: () => dispatch(actions.stopLoading()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddMember);
