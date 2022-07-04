import { Button, Tooltip } from "@material-ui/core";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import parse from "html-react-parser";
import CustomImage from "../../../../../components/UI/CustomImage/CustomImage";
import * as actions from "../../../../../store/actions/index";
import * as classes from "./SpeakerSummary.module.css";

const columns = [
  { field: "id", headerName: "Speaker ID", width: 100 },
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

class SpeakerSummary extends Component {
  state = {
    rows: [],
    selectedRowId: null,
    rowSelected: false,
    doEdit: false,
    editRedirectionLink: null,
    noOfSelectedRows: 0,
  };

  componentDidMount() {
    this.props.onFetchSpeakers(
      "all_speakers",
      JSON.stringify({
        filters: [],
        filter_op: "",
        sort: [],
        selectionModel: [],
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
      this.props.onDeleteSpeaker(id);
    });
  }

  editHandler() {
    this.setState({
      doEdit: true,
      editRedirectionLink:
        "/dashboard/editSpeaker?speakerId=" + this.state.selectedRowId,
    });
  }

  render() {
    let speakers =
      this.props.speakers && this.props.speakers["all_speakers"]
        ? this.props.speakers["all_speakers"].map((speaker, index) => {
            return {
              id: speaker.speaker_id,
              name: speaker.name,
              introduction: speaker.introduction,
              slug: speaker.slug,
              image_url: speaker.image_url,
              designation: speaker.designation,
              topic: speaker.topic,
              time: speaker.time,
              date: speaker.date,
              biography: speaker.biography,
              registration: speaker.registration,
              duration: speaker.duration,
              venue: speaker.venue,
              view_order: speaker.view_order,
              is_active: speaker.is_active,
              price: speaker.price,
              show_in_home_page: speaker.show_in_home_page,
              created_at: speaker.created_at,
              updated_at: speaker.updated_at,
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
                Edit Speaker
              </Button>
              <Button
                onClick={() => this.deleteHandler.bind(this)()}
                variant="contained"
                color="primary"
                className={classes.ActionButton}
              >
                Delete Speaker
              </Button>
            </div>
          ) : this.state.rowSelected && this.state.noOfSelectedRows > 1 ? (
            <Button
              onClick={() => this.deleteHandler.bind(this)()}
              variant="contained"
              color="primary"
              className={classes.ActionButton}
            >
              Delete Speaker
            </Button>
          ) : null}
        </div>
        <DataGrid
          rows={speakers}
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
    speakers: state.speaker.speakers,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchSpeakers: (category, queryCriteria) =>
      dispatch(actions.fetchSpeakers(category, queryCriteria)),
    onDeleteSpeaker: (speakerId) => dispatch(actions.deleteSpeaker(speakerId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SpeakerSummary);
