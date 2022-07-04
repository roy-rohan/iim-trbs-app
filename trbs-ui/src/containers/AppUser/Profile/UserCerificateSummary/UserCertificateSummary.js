import { Backdrop, Button, Fade, Modal } from "@material-ui/core";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import axios from "../../../../axios-iim";
import Certificate from "../../../../components/Certificate/Certificate";
import * as config from "../../../../config.json";
import * as actions from "../../../../store/actions/index";
import * as classes from "./UserCertificateSummary.module.css";

class UserCertificateSummary extends Component {
  state = {
    rows: [],
    selectedRowId: null,
    rowSelected: false,
    noOfSelectedRows: 0,
    certificates: [],
    showCertificatePreview: false,
    selectedCertificate: null
  };

  columns = [
    {
        field: "sl",
        headerName: "Index",
        width: 100
    },
    {
        field: "name",
        headerName: "Name",
        width: 600
    },{
      field: "id",
      headerName: "Show Preview",
      width: 300,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.showPreview(params.value)}
          >
            View Certificate
          </Button>
        );
      },
    }
  ];

  showPreview(certificateId) {
    let certificate = this.state.certificates.find(x => +x.certificate_id === +certificateId);
    this.setState({
      selectedCertificate: certificate,
      showCertificatePreview: true
    });
  }

  closePreview (event) {
    this.setState({
      showCertificatePreview: false
    });
  }


  componentDidMount() {
    let userId = this.props.user?.app_user_id;
    axios.get("/certificates/get_certificates_by_user_id.php?id=" + userId).then( res => {
        const fetchedCertificates = [];
        for (let key in res.data) {
          let cert = res.data[key];
          cert.content = this.processCertificateContent(cert.content);
          fetchedCertificates.push({
            ...res.data[key],
            id: key,
          });
        }

        this.setState({
            certificates: fetchedCertificates
        });
    })
  }

  processCertificateContent(content){
    if(content !== null && content !== undefined){
       content = content.replaceAll("{{userFirstName}}", this.props.user.first_name);
       content = content.replaceAll("{{userLastName}}", this.props.user.last_name);
       content = content.replaceAll("{{userFullName}}", this.props.user.first_name + " " + this.props.user.last_name);
       content = content.replaceAll("{{userCollege}}", this.props.user.college);
       content = content.replaceAll("{{userCollegeYear}}", this.props.user.year);
       content = content.replaceAll("{{userAddress}}", this.props.user.address);
       content = content.replaceAll("{{userEmail}}", this.props.user.email_id);
    }

    return content;
  }

  render() {
    let certificates = this.state.certificates ? this.state.certificates.map((certificate, index) => {
      return {
        sl: ++index,
        id: certificate.certificate_id,
        name: certificate.name,
        image_url: certificate.image_url,
        content: certificate.content,
        visible: +certificate.visible,
        contentBackgroundColor: certificate.contentBackgroundColor,
        content_position_absolute: certificate.content_position_absolute,
        content_position_x: +certificate.content_position_x,
        content_position_y: +certificate.content_position_y,
        created_at: certificate.created_at,
        updated_at: certificate.updated_at,
      }}):[];

      let content = this.state.doEdit ? ( <Redirect to={this.state.editRedirectionLink}/>) : (
      <div>
          <div style={{ height: 700, width: "100%" }}>
            <div className={classes.ActionRows}>
            </div>
            <DataGrid
              rows = {
                certificates
              }
              // checkboxSelection
              columns={this.columns}
              pageSize={10}
              components={{
                Toolbar: GridToolbar,
              }}
            />
          </div>
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
              {this.state.selectedCertificate ? (<Certificate
                showPrintBtn={true}
                documentTitle = {this.state.selectedCertificate.name}
                imageUrl={this.state.selectedCertificate.image_url ? config.serverUrl + this.state.selectedCertificate.image_url : null}
                contentText={this.state.selectedCertificate.content}
                contentPosition={this.state.selectedCertificate.content_position_absolute}
                contentBackgroundColor = {
                  this.state.selectedCertificate.content_background_color
                }
                contentPositionX = {
                  this.state.selectedCertificate.content_position_x
                }
                 contentPositionY = {
                  this.state.selectedCertificate.content_position_y
                }
              />): null}
            </div>
          </Fade>
        </Modal>
      </div>
    );
    return <>{content}</>;
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    onSendMessage: (message, messageType) =>
      dispatch(actions.sendMessage(message, messageType)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserCertificateSummary);
