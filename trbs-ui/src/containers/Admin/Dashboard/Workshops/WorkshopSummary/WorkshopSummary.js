import { Button, Tooltip } from "@material-ui/core";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import parse from "html-react-parser";
import CustomImage from "../../../../../components/UI/CustomImage/CustomImage";
import * as actions from "../../../../../store/actions/index";
import * as classes from "./WorkshopSummary.module.css";

const columns = [
  { field: "id", headerName: "Workshop ID", width: 100 },
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
  { field: "type", headerName: "Workshop Type", width: 200 },
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
    field: "workshop_time",
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
  { field: "workshop_date", headerName: "Start Date", width: 200 },
  { field: "workshop_end_date", headerName: "End Date", width: 200 },
  { field: "workshop_end_time", headerName: "End Time", width: 200 },
];

class WorkshopSummary extends Component {
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
    this.props.onFetchWorkshops(
      "all_workshops",
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
      this.props.onDeleteWorkshop(id);
    });
  }

  editHandler() {
    this.setState({
      doEdit: true,
      editRedirectionLink:
        "/dashboard/editWorkshop?workshopId=" + this.state.selectedRowId,
    });
  }

  render() {
    let workshops =
      this.props.workshops && this.props.workshops["all_workshops"]
        ? this.props.workshops["all_workshops"].map((workshop, index) => {
            return {
              id: workshop.workshop_id,
              title: workshop.title,
              type: workshop.type,
              slug: workshop.slug,
              image_url: workshop.image_url,
              short_description: workshop.short_description,
              full_description: workshop.full_description,
              workshop_time: workshop.workshop_time,
              workshop_date: workshop.workshop_date,
              workshop_end_date: workshop.workshop_end_date,
              workshop_end_time: workshop.workshop_end_time,
              contact: workshop.contact,
              organizer: workshop.organizer,
              venue: workshop.venue,
              duration: workshop.duration,
              view_order: workshop.view_order,
              background_info: workshop.background_info,
              is_active: workshop.is_active,
              terms_condition: workshop.terms_condition,
              faq: workshop.faq,
              conclave: workshop.conclave,
              price: workshop.price,
              show_in_home_page: workshop.show_in_home_page,
              created_at: workshop.created_at,
              updated_at: workshop.updated_at,
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
                Edit Workshop
              </Button>
              <Button
                onClick={() => this.deleteHandler.bind(this)()}
                variant="contained"
                color="primary"
                className={classes.ActionButton}
              >
                Delete Workshop
              </Button>
            </div>
          ) : this.state.rowSelected && this.state.noOfSelectedRows > 1 ? (
            <Button
              onClick={() => this.deleteHandler.bind(this)()}
              variant="contained"
              color="primary"
              className={classes.ActionButton}
            >
              Delete Workshop
            </Button>
          ) : null}
        </div>
        <DataGrid
          rows={workshops}
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
    workshops: state.workshop.workshops,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchWorkshops: (category, queryCriteria) =>
      dispatch(actions.fetchWorkshops(category, queryCriteria)),
    onDeleteWorkshop: (workshopId) =>
      dispatch(actions.deleteWorkshop(workshopId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkshopSummary);
