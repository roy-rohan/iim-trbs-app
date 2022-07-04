import { Button, Tooltip } from "@material-ui/core";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import parse from "html-react-parser";
import CustomImage from "../../../../../components/UI/CustomImage/CustomImage";
import * as actions from "../../../../../store/actions/index";
import * as classes from "./EventSummary.module.css";

const columns = [
  { field: "id", headerName: "Event ID", width: 100 },
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
  { field: "type", headerName: "Event Type", width: 200 },
  { field: "slug", headerName: "Slug", width: 200 },
  {
    field: "short_description",
    headerName: "Short Description",
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
    field: "full_description",
    headerName: "Full Description",
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
    field: "remark_one",
    headerName: "Remark One",
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
    field: "remark_two",
    headerName: "Remark Two",
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
    field: "event_time",
    headerName: "Start Time",
    width: 200,
    renderCell: (params) => {
      return (
        <Tooltip title={params.value} placement="bottom-start">
          <p> {parse(params.value)}</p>
        </Tooltip>
      );
    },
  },
  { field: "event_date", headerName: "Start Date", width: 200 },
  { field: "event_end_date", headerName: "End Date", width: 200 },
  { field: "event_end_time", headerName: "End Time", width: 200 },
  {
    field: "rules",
    headerName: "Rules",
    width: 300,
    renderCell: (params) => {
      return (
        <Tooltip title={params.value} placement="bottom-start">
          <p> {parse(params.value)}</p>
        </Tooltip>
      );
    },
  },
];

class EventSummary extends Component {
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
    this.props.onFetchEvents(
      "all_events",
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
        "/dashboard/editEvent?eventId=" + this.state.selectedRowId,
    });
  }

  render() {
    let events =
      this.props.events && this.props.events["all_events"]
        ? this.props.events["all_events"].map((event, index) => {
            return {
              id: event.event_id,
              title: event.title,
              type: event.type,
              slug: event.slug,
              image_url: event.image_url,
              short_description: event.short_description,
              full_description: event.full_description,
              remark_one: event.remark_one,
              remark_two: event.remark_two,
              event_time: event.event_time,
              event_date: event.event_date,
              event_end_date: event.event_end_date,
              event_end_time: event.event_end_time,
              rules: event.rules,
              prizes: event.prizes,
              event_format: event.event_format,
              contact: event.contact,
              register: event.register,
              organising_club: event.organising_club,
              venue: event.venue,
              event_duration: event.event_duration,
              view_order: event.view_order,
              event_timeline: event.event_timeline,
              is_active: event.is_active,
              team_size: event.team_size,
              show_in_home_page: event.show_in_home_page,
              created_at: event.created_at,
              updated_at: event.updated_at,
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
                Edit Event
              </Button>
              <Button
                onClick={() => this.deleteHandler.bind(this)()}
                variant="contained"
                color="primary"
                className={classes.ActionButton}
              >
                Delete Event
              </Button>
            </div>
          ) : this.state.rowSelected && this.state.noOfSelectedRows > 1 ? (
            <Button
              onClick={() => this.deleteHandler.bind(this)()}
              variant="contained"
              color="primary"
              className={classes.ActionButton}
            >
              Delete Event
            </Button>
          ) : null}
        </div>
        <DataGrid
          rows={events}
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
    events: state.event.events,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchEvents: (category, queryCriteria) =>
      dispatch(actions.fetchEvents(category, queryCriteria)),
    onDeleteEvent: (eventId) => dispatch(actions.deleteEvent(eventId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventSummary);
