import { Button, Tooltip } from "@material-ui/core";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import parse from "html-react-parser";
import CustomImage from "../../../../../components/UI/CustomImage/CustomImage";
import * as actions from "../../../../../store/actions/index";
import * as classes from "./ConnexionSummary.module.css";

const columns = [
  { field: "id", headerName: "Connexion ID", width: 100 },
  {
    field: "image_url",
    headerName: "Image",
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
  },
  { field: "name", headerName: "Name", width: 200 },
  { field: "topic", headerName: "topic", width: 200 },
  { field: "type", headerName: "type", width: 200 },
  { field: "slug", headerName: "Slug", width: 200 },
  {
    field: "introduction",
    headerName: "Introduction",
    width: 300,
    renderCell: (params) => {
      return (
        <Tooltip title={params.value} placement="bottom-start">
          <p> {params.value}</p>
        </Tooltip>
      );
    },
  },
  {
    field: "designation",
    headerName: "Designation",
    width: 300,
    renderCell: (params) => {
      return (
        <Tooltip title={params.value} placement="bottom-start">
          <p> {parse(params.value)}</p>
        </Tooltip>
      );
    },
  },
  {
    field: "biography",
    headerName: "Biography",
    width: 300,
    renderCell: (params) => {
      return (
        <Tooltip title={params.value} placement="bottom-start">
          <p> {parse(params.value)}</p>
        </Tooltip>
      );
    },
  },
  {
    field: "registration",
    headerName: "Registration",
    width: 300,
    renderCell: (params) => {
      return (
        <Tooltip title={params.value} placement="bottom-start">
          <p> {parse(params.value)}</p>
        </Tooltip>
      );
    },
  },
  { field: "duration", headerName: "Duration", width: 200 },
  { field: "date", headerName: "Date", width: 200 },
  { field: "time", headerName: "Time", width: 200 },
];

class ConnexionSummary extends Component {
  state = {
    rows: [],
    selectedRowId: null,
    rowSelected: false,
    doEdit: false,
    editRedirectionLink: null,
    noOfSelectedRows: 0,
    selectionModel: [],
  };

  componentDidMount() {
    this.props.onFetchConnexions(
      "all_connexions",
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
      this.props.onDeleteConnexion(id);
    });
  }

  editHandler() {
    this.setState({
      doEdit: true,
      editRedirectionLink:
        "/dashboard/editConnexion?connexionId=" + this.state.selectedRowId,
    });
  }

  render() {
    let connexions =
      this.props.connexions && this.props.connexions["all_connexions"]
        ? this.props.connexions["all_connexions"].map((connexion, index) => {
            return {
              id: connexion.connexion_id,
              name: connexion.name,
              introduction: connexion.introduction,
              slug: connexion.slug,
              image_url: connexion.image_url,
              type: connexion.type,
              designation: connexion.designation,
              topic: connexion.topic,
              time: connexion.time,
              date: connexion.date,
              biography: connexion.biography,
              registration: connexion.registration,
              duration: connexion.duration,
              venue: connexion.venue,
              view_order: connexion.view_order,
              is_active: connexion.is_active,
              price: connexion.price,
              show_in_home_page: connexion.show_in_home_page,
              created_at: connexion.created_at,
              updated_at: connexion.updated_at,
            };
          })
        : [];
    let content = this.state.doEdit ? (
      <Redirect to={this.state.editRedirectionLink} />
    ) : (
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
                Edit Connexion
              </Button>
              <Button
                onClick={() => this.deleteHandler.bind(this)()}
                variant="contained"
                color="primary"
                className={classes.ActionButton}
              >
                Delete Connexion
              </Button>
            </div>
          ) : this.state.rowSelected && this.state.noOfSelectedRows > 1 ? (
            <Button
              onClick={() => this.deleteHandler.bind(this)()}
              variant="contained"
              color="primary"
              className={classes.ActionButton}
            >
              Delete Connexion
            </Button>
          ) : null}
        </div>
        <DataGrid
          rows={connexions}
          columns={columns}
          pageSize={10}
          checkboxSelection
          onSelectionModelChange={this.onRowSelected.bind(this)}
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
    connexions: state.connexion.connexions,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchConnexions: (category, queryCriteria) =>
      dispatch(actions.fetchConnexions(category, queryCriteria)),
    onDeleteConnexion: (connexionId) =>
      dispatch(actions.deleteConnexion(connexionId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnexionSummary);
