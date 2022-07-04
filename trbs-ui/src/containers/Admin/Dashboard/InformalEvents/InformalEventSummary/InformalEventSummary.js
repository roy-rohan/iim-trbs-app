import { Button, Tooltip } from "@material-ui/core";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import parse from "html-react-parser";
import CustomImage from "../../../../../components/UI/CustomImage/CustomImage";
import * as actions from "../../../../../store/actions/index";
import * as classes from "./InformalEventSummary.module.css";

const columns = [
  { field: "id", headerName: "InformalEvent ID", width: 100 },
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
  { field: "title", headerName: "Title", width: 200 },
  { field: "type", headerName: "InformalEvent Type", width: 200 },
  { field: "organizer", headerName: "organizer", width: 200 },
  { field: "conclave", headerName: "conclave", width: 200 },
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
    field: "background_info",
    headerName: "Background Info",
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
    field: "faq",
    headerName: "faq",
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
];

class InformalEventSummary extends Component {
  state = {
    rows: [],
    selectedRowId: null,
    rowSelected: false,
    doEdit: false,
    editRedirectionLink: null,
    noOfSelectedRows: 0,
  };

  componentDidMount() {
    this.props.onFetchInformalEvents(
      "all_informalEvents",
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
      this.props.onDeleteInformalEvent(id);
    });
  }

  editHandler() {
    this.setState({
      doEdit: true,
      editRedirectionLink:
        "/dashboard/editInformalEvent?informalEventId=" +
        this.state.selectedRowId,
    });
  }

  render() {
    let informalEvents =
      this.props.informalEvents &&
      this.props.informalEvents["all_informalEvents"]
        ? this.props.informalEvents["all_informalEvents"].map(
            (informalEvent, index) => {
              return {
                id: informalEvent.informal_event_id,
                title: informalEvent.title,
                type: informalEvent.type,
                slug: informalEvent.slug,
                image_url: informalEvent.image_url,
                short_description: informalEvent.short_description,
                full_description: informalEvent.full_description,
                event_time: informalEvent.event_time,
                event_date: informalEvent.event_date,
                event_end_date: informalEvent.event_end_date,
                event_end_time: informalEvent.event_end_time,
                contact: informalEvent.contact,
                organizer: informalEvent.organizer,
                venue: informalEvent.venue,
                duration: informalEvent.duration,
                view_order: informalEvent.view_order,
                background_info: informalEvent.background_info,
                is_active: informalEvent.is_active,
                terms_condition: informalEvent.terms_condition,
                faq: informalEvent.faq,
                conclave: informalEvent.conclave,
                price: informalEvent.price,
                show_in_home_page: informalEvent.show_in_home_page,
                created_at: informalEvent.created_at,
                updated_at: informalEvent.updated_at,
              };
            }
          )
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
                Edit Informal Event
              </Button>
              <Button
                onClick={() => this.deleteHandler.bind(this)()}
                variant="contained"
                color="primary"
                className={classes.ActionButton}
              >
                Delete Informal Event
              </Button>
            </div>
          ) : this.state.rowSelected && this.state.noOfSelectedRows > 1 ? (
            <Button
              onClick={() => this.deleteHandler.bind(this)()}
              variant="contained"
              color="primary"
              className={classes.ActionButton}
            >
              Delete Informal Event
            </Button>
          ) : null}
        </div>
        <DataGrid
          rows={informalEvents}
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
    informalEvents: state.informalEvent.informalEvents,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchInformalEvents: (category, queryCriteria) =>
      dispatch(actions.fetchInformalEvents(category, queryCriteria)),
    onDeleteInformalEvent: (workshopId) =>
      dispatch(actions.deleteInformalEvent(workshopId)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InformalEventSummary);
