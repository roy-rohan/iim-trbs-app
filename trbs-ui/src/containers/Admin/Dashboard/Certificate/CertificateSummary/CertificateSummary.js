import { Button, Tooltip } from "@material-ui/core";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import React, { Component } from "react";
import { connect } from "react-redux";
import CustomImage from "../../../../../components/UI/CustomImage/CustomImage";
import * as actions from "../../../../../store/actions/index";
import * as classes from "./CertificateSummary.module.css";
import parse from "html-react-parser";
import { Redirect } from "react-router-dom";

const columns = [
  { field: "id", headerName: "ID", width: 100 },
  {
      field: "name",
      headerName: "Name",
      width: 200
  },
  {
    field: "image_url",
    headerName: "Background Image",
    width: 150,
    renderCell: (params) =>
      params.value ? (
        <CustomImage
          width="100%"
          height="100%"
          src={params.value}
          alt="No Image"
        />
      ) : (
        <p>No Image</p>
      ),
  }, {
    field: "content",
    headerName: "Content",
    width: 300,
    renderCell: (params) => {
      return (
        <Tooltip title={params.value} placement="bottom-start">
           <>{parse(params.value)}</>
        </Tooltip>
      );
    },
  },
  { field: "created_at", headerName: "Created At", width: 200 },
  { field: "updated_at", headerName: "Updated At", width: 200 },
];

class CertificateSummary extends Component {
  state = {
    rows: [],
    selectedRowId: null,
    rowSelected: false,
    noOfSelectedRows: 0,
  };

  componentDidMount() {
    this.props.onFetchCertificates(
        "all_certificates",
        JSON.stringify({
            filters: [],
            filter_op: "",
            sort: [],
        })
    );
  }

  onRowSelected(selectionModel) {
    let rowSelected = selectionModel.length === 0 ? false : true;
    this.setState({
      selectionModel: selectionModel,
      selectedRowId:
        selectionModel.length !== 0
          ? selectionModel[selectionModel.length - 1]
          : null,
      rowSelected: rowSelected,
      noOfSelectedRows: selectionModel.length,
    });
  }
  deleteHandler() {
    this.state.selectionModel.forEach((id) => {
      this.props.onDeleteEvent(id);
    });
  }

  editHandler() {
    this.setState({
      doEdit: true,
      editRedirectionLink:
        "/dashboard/editCertificate?certificateId=" + this.state.selectedRowId,
    });
  }

  render() {
    let certificates = this.props.certificates && this.props.certificates["all_certificates"]
      ? this.props.certificates["all_certificates"].map((certificate, index) => {
      return {
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
      <div style={{ height: 700, width: "100%" }}>
        <div className={classes.ActionRows}>
          {this.state.rowSelected && this.state.noOfSelectedRows === 1 ? (
            <div>
              <Button
                onClick={() => this.editHandler.bind(this)()}
                variant="contained"
                color="primary"
                className={classes.ActionButton}
              >
                Edit Certificate
              </Button>
              <Button
                onClick={() => this.deleteHandler.bind(this)()}
                variant="contained"
                color="primary"
                className={classes.ActionButton}
              >
                Delete Certificate
              </Button>
            </div>
          ) : this.state.rowSelected && this.state.noOfSelectedRows > 1 ? (
            <Button
              onClick={() => this.deleteHandler.bind(this)()}
              variant="contained"
              color="primary"
              className={classes.ActionButton}
            >
              Delete Certificate
            </Button>
          ) : null}
        </div>
        <DataGrid
          rows = {
            certificates
          }
          onSelectionModelChange = {
            this.onRowSelected.bind(this)
          }
          checkboxSelection
          columns={columns}
          pageSize={10}
          components={{
            Toolbar: GridToolbar,
          }}
        />
      </div>
    );
    return <>{content}</>;
  }
}

const mapStateToProps = (state) => {
  return {
    certificates: state.certificate.certificates,
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    onFetchCertificates: (category, queryCriteria) => dispatch(actions.fetchCertificates(category, queryCriteria)),
    onSendMessage: (message, messageType) =>
      dispatch(actions.sendMessage(message, messageType)),
    onDeleteEvent: (certificateId) => dispatch(actions.deleteCertificate(certificateId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CertificateSummary);
