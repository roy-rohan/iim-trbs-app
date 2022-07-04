import { Button } from "@material-ui/core";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import * as actions from "../../../../../store/actions/index";
import * as classes from "./StrategizerSummary.module.css";

const columns = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "name", headerName: "Name", width: 200 },
  { field: "type", headerName: "Strategizer Type", width: 200 },
  { field: "score", headerName: "Score", width: 200 },
  { field: "college", headerName: "College", width: 500 },
  { field: "created_at", headerName: "Created At", width: 200 },
  { field: "updated_at", headerName: "Updated At", width: 200 },
];

class StrategizerSummary extends Component {
  state = {
    rows: [],
    selectedRowId: null,
    rowSelected: false,
    doEdit: false,
    editRedirectionLink: null,
    noOfSelectedRows: 0,
  };

  componentDidMount() {
    this.props.onFetchStrategizers(
      "all_strategizers",
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
      this.props.onDeleteStrategizer(id);
    });
  }

  editHandler() {
    this.setState({
      doEdit: true,
      editRedirectionLink:
        "/dashboard/editStrategizer?strategizerId=" + this.state.selectedRowId,
    });
  }

  render() {
    let strategizers =
      this.props.strategizers && this.props.strategizers["all_strategizers"]
        ? this.props.strategizers["all_strategizers"].map(
            (strategizer, index) => {
              return {
                id: strategizer.leaderboard_id,
                name: strategizer.name,
                type: strategizer.type,
                score: strategizer.score,
                college: strategizer.college,
                created_at: strategizer.created_at,
                updated_at: strategizer.updated_at,
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
                Edit Record
              </Button>
              <Button
                onClick={() => this.deleteHandler.bind(this)()}
                variant="contained"
                color="primary"
                className={classes.ActionButton}
              >
                Delete Record
              </Button>
            </div>
          ) : this.state.rowSelected && this.state.noOfSelectedRows > 1 ? (
            <Button
              onClick={() => this.deleteHandler.bind(this)()}
              variant="contained"
              color="primary"
              className={classes.ActionButton}
            >
              Delete Record
            </Button>
          ) : null}
        </div>
        <DataGrid
          rows={strategizers}
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
    strategizers: state.strategizer.strategizers,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchStrategizers: (category, queryCriteria) =>
      dispatch(actions.fetchStrategizers(category, queryCriteria)),
    onDeleteStrategizer: (strategizerId) =>
      dispatch(actions.deleteStrategizer(strategizerId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StrategizerSummary);
