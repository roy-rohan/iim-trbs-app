import { Button } from "@material-ui/core";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import CustomImage from "../../../../../components/UI/CustomImage/CustomImage";
import * as actions from "../../../../../store/actions/index";
import * as classes from "./SponserSummary.module.css";

const columns = [
  { field: "id", headerName: "Sponser ID", width: 100 },
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
  { field: "type", headerName: "Type", width: 200 },
  { field: "link", headerName: "Link", width: 200 },
  { field: "size", headerName: "Size", width: 200 },
  { field: "view_order", headerName: "Order", width: 200 },
  { field: "show_in_home_page", headerName: "Show In Home Page", width: 200 },
  { field: "created_at", headerName: "Created At", width: 200 },
  { field: "updated_at", headerName: "Updated At", width: 200 },
];

class SponserSummary extends Component {
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
    this.props.onFetchSponsers(
      "all_sponsers",
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
      this.props.onDeleteSponser(id);
    });
  }

  editHandler() {
    this.setState({
      doEdit: true,
      editRedirectionLink:
        "/dashboard/editSponser?sponserId=" + this.state.selectedRowId,
    });
  }

  render() {
    let sponsers =
      this.props.sponsers && this.props.sponsers["all_sponsers"]
        ? this.props.sponsers["all_sponsers"].map((sponser, index) => {
            return {
              id: sponser.sponser_id,
              title: sponser.title,
              type: sponser.type,
              link: sponser.link,
              size: sponser.size,
              view_order: sponser.view_order,
              show_in_home_page: sponser.show_in_home_page,
              image_url: sponser.image_url,
              created_at: sponser.created_at,
              updated_at: sponser.updated_at,
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
                Edit Sponser
              </Button>
              <Button
                onClick={() => this.deleteHandler.bind(this)()}
                variant="contained"
                color="primary"
                className={classes.ActionButton}
              >
                Delete Sponser
              </Button>
            </div>
          ) : this.state.rowSelected && this.state.noOfSelectedRows > 1 ? (
            <Button
              onClick={() => this.deleteHandler.bind(this)()}
              variant="contained"
              color="primary"
              className={classes.ActionButton}
            >
              Delete Sponser
            </Button>
          ) : null}
        </div>
        <DataGrid
          rows={sponsers}
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
    sponsers: state.sponser.sponsers,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchSponsers: (category, queryCriteria) =>
      dispatch(actions.fetchSponsers(category, queryCriteria)),
    onDeleteSponser: (sponserId) => dispatch(actions.deleteSponser(sponserId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SponserSummary);
