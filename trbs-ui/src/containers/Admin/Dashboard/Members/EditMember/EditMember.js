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
import * as classes from "./EditMember.module.css";
import { initalValues } from "./InitialData";

class EditMember extends Component {
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
    let queryParams = extractQueryParams(
      this.props.location.search.substring(1)
    );
    axios
      .get("/member/read-single.php?id=" + queryParams.memberId)
      .then((response) => {
        let memberData = response.data;
        let updatedValues = { ...this.state.initialValues };
        for (let attr in updatedValues) {
          updatedValues[attr].value = memberData[attr];
        }
        this.setState({ initalValues: updatedValues });
        this.props.stopLoading();
      })
      .catch((error) => {
        this.props.onSendMessage("Something went wrong. ", "error");
        window.location.href = "/dashboard/memberSummary";
      });
  }

  onFormSubmit(member) {
    member.preventDefault();
    // this.submitBtnRef.current.textContent = "Please wait...";
    let isValid = this.validate();
    if (isValid) {
      // make a request
      let memberData = {};
      if (this.state.initialValues) {
        Object.keys(this.state.initalValues).forEach((key) => {
          memberData[key] = this.state.initialValues[key].value;
        });
        this.submitBtnRef.current.textContent = "Submit";
        this.props.onEditMember(memberData, this.uploadImages.bind(this));
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
    if (this.state.memberImage !== null) {
      let memberImageformData = this.state.memberImageFormData;
      memberImageformData.append(
        "entity_id",
        this.state.initialValues.member_id.value
      );
      if (memberImageformData.get("path") === "null") {
        uploadNewImage(memberImageformData, () => {
          this.setState({
            ...this.state,
            memberImageUploadSuccess: true,
          });
        });
      } else {
        updateImage(memberImageformData, () =>
          this.setState({ ...this.state, memberImageUploadSuccess: true })
        );
      }
    } else {
      this.setState({ ...this.state, memberImageUploadSuccess: true });
    }

    if (this.state.memberTimelineImage !== null) {
      let timelineMemberImageformData = this.state.memberTimelineImageFormData;
      timelineMemberImageformData.append(
        "entity_id",
        this.state.initialValues.member_id.value
      );
      if (timelineMemberImageformData.get("path") === "null") {
        // image was not present member when added, now being added first time
        uploadNewImage(timelineMemberImageformData, () => {
          this.setState({
            ...this.state,
            memberTimelineImageUploadSuccess: true,
          });
        });
      } else {
        updateImage(timelineMemberImageformData, () =>
          this.setState({
            ...this.state,
            memberTimelineImageUploadSuccess: true,
          })
        );
      }
    } else {
      this.setState({
        ...this.state,
        memberTimelineImageUploadSuccess: true,
      });
    }
  }

  successHandler() {
    this.props.onSendMessage("Member Edited Successfully", "info");
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
    let path =
      uploadType === "member"
        ? this.state.initialValues.image_url.value
        : uploadType === "member-timeline"
        ? this.state.initialValues.timeline_image_url.value
        : null;
    formData.append("path", path);
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
    if (
      this.state.memberImageUploadSuccess &&
      this.state.memberTimelineImageUploadSuccess
    ) {
      this.successHandler();
    }
    return (
      <div className={classes.EditMember}>
        <MatBackdrop open={this.props.loading}></MatBackdrop>
        <div className={classes.PageHeader}>
          <h2>Edit Member</h2>
        </div>
        <form ref={this.formRef} className={classes.Form}>
          <div className={classes.MemberImageSection}>
            <div className={classes.MemberImage}>
              <CustomImage
                src={
                  this.state.memberImage
                    ? this.state.memberImage
                    : this.state.initialValues.image_url.value
                    ? this.state.initialValues.image_url.value
                    : DefaultImage
                }
                useCustomSrc={
                  this.state.memberImage
                    ? true
                    : this.state.initialValues.image_url.value
                    ? false
                    : true
                }
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
            value={this.state.initialValues.name.value}
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
            value={this.state.initialValues.designation.value}
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
            value={this.state.initialValues.more_info.value}
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
              value={this.state.initialValues.visible.value}
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
    onFetchMembers: () => dispatch(actions.fetchMembers()),
    onEditMember: (memberData, cb) =>
      dispatch(actions.editMember(memberData, cb)),
    onSendMessage: (message, messageType) =>
      dispatch(actions.sendMessage(message, messageType)),

    stopLoading: () => dispatch(actions.stopLoading()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EditMember)
);
