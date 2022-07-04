import {
  faCalendar,
  faLocationArrow,
  faMailBulk,
  faMobile,
  faSchool,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import DefaultImage from "../../../assets/images/common/default.png";
import CustomImage from "../../../components/UI/CustomImage/CustomImage";
import * as actions from "../../../store/actions/index";
import { updateImage, uploadNewImage } from "../../../utils/imageUploadUtil";
import * as classes from "./Profile.module.css";
import Registrations from "./Registrations/Registration";
import UserCertificateSummary from "./UserCerificateSummary/UserCertificateSummary";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageInputRef: React.createRef(),
      activeHeadeTab: "Registrations",
      tabs: ["Registrations", "Certificates"],
    };
  }

  componentDidMount() {
    this.props.onFetchUser(this.props.token);
  }

  handleBasicHeaderTabClick(tab) {
    let updatedState = this.state;
    updatedState.activeHeadeTab = tab;
    this.setState({ updatedState });
  }

  changePictureHandler() {
    this.state.imageInputRef.current.click();
  }

  onImageFileChange(event) {
    let selectedFile = event.target.files[0];
    const formData = new FormData();
    formData.append("image_upload", selectedFile);
    formData.append("upload_type", "user");
    formData.append("entity_type", "user");
    formData.append("entity_id", this.props.user.app_user_id);
    if (this.props.user.profile_image) {
      formData.append("path", this.props.user.profile_image);
      updateImage(formData, () => this.props.onFetchUser(this.props.token));
    } else {
      uploadNewImage(formData, () => this.props.onFetchUser(this.props.token));
    }
  }

  render() {
    return (
      <div className={classes.Profile}>
        <div className={classes.ProfileInfo}>
          <div className={classes.ProfileImageSection}>
            <div className={classes.ProfileImage}>
              <CustomImage
                src={
                  this.props.user.profile_image
                    ? this.props.user.profile_image
                    : DefaultImage
                }
                useCustomSrc={this.props.user.profile_image ? false : true}
                alt="Profile"
              />
            </div>
            <input
              type="file"
              onChange={this.onImageFileChange.bind(this)}
              hidden
              ref={this.state.imageInputRef}
            />
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={this.changePictureHandler.bind(this)}
            >
              Change Picture
            </Button>
          </div>
          <div className={classes.ProfileDetails}>
            <p className={classes.ProfileName}>{this.props.user.first_name}</p>
            <div className={classes.ProfileAttributes}>
              <div className={classes.ProfileDetailAtr}>
                <div className={classes.ProfileDetailAtrIcon}>
                    <FontAwesomeIcon size="1x" icon={faLocationArrow} />
                </div>
                <div className={classes.ProfileDetailAtrValue}>
                    <p>{this.props.user.address}</p>
                </div>
              </div>
              <div className={classes.ProfileDetailAtr}>
                <div className={classes.ProfileDetailAtrIcon}>
                    <FontAwesomeIcon icon={faMailBulk} />
                </div>
                <div className={classes.ProfileDetailAtrValue}>
                    <p>{this.props.user.email_id}</p>
                </div>
              </div>
              <div className={classes.ProfileDetailAtr}>
                <div className={classes.ProfileDetailAtrIcon}>
                    <FontAwesomeIcon icon={faMobile} />
                </div>
                <div className={classes.ProfileDetailAtrValue}>
                    <p>{this.props.user.mobile_no}</p>
                </div>
              </div>
              <div className={classes.ProfileDetailAtr}>
                <div className={classes.ProfileDetailAtrIcon}>
                    <FontAwesomeIcon icon={faSchool} />
                </div>
                <div className={classes.ProfileDetailAtrValue}>
                    <p>{this.props.user.college}</p>
                </div>
              </div>
              <div className={classes.ProfileDetailAtr}>
                <div className={classes.ProfileDetailAtrIcon}>
                    <FontAwesomeIcon icon={faCalendar} />
                </div>
                <div className={classes.ProfileDetailAtrValue}>
                    <p>{this.props.user.year}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={classes.OtherDetails}>
          <div className={classes.TabHeader}>
            {this.state.tabs.map((tab, i) => {
              return (
                <div
                  key={i}
                  className={[
                    classes.Tab,
                    this.state.activeHeadeTab === tab
                      ? classes.ActiveTabItem
                      : null,
                  ].join(" ")}
                  onClick={() => this.handleBasicHeaderTabClick(tab)}
                >
                  {tab}
                </div>
              );
            })}
          </div>
          <div className={classes.TabContentContainer}>
            <div
              className={classes.Registrations}
              style={{
                display:
                  this.state.activeHeadeTab === "Registrations"
                    ? "block"
                    : "none",
              }}
            >
              <Registrations />
            </div>
            {/* <div
              className={classes.Accomodations}
              style={{
                display:
                  this.state.activeHeadeTab === "My Accomodations"
                    ? "block"
                    : "none",
              }}
            >
              Accomodations
            </div> */}
            <div
              className={classes.Certificates}
              style={{
                display:
                  this.state.activeHeadeTab === "Certificates"
                    ? "block"
                    : "none",
              }}
            >
              {/* <Certificate /> */}
              <UserCertificateSummary/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    user: state.auth.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchUser: (token) => dispatch(actions.fetchUser(token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
