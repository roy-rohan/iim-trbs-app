import { Button } from "@material-ui/core";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import * as actions from "../../../../../store/actions/index";
import * as classes from "./CollegeSummary.module.css";
import axios from "../../../../../axios-iim";

const columns = [
  { field: "college_id", headerName: "ID", width: 100 },
  { field: "name", headerName: "College Name", width: 600 },
  { field: "created_at", headerName: "Created At", width: 200 },
  { field: "updated_at", headerName: "Updated At", width: 200 },
];

class CollegeSummary extends Component {
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
    axios
      .post(
        "/colleges/read.php",
        JSON.stringify({
          filters: [],
          filter_op: "",
          sort: [],
        })
      )
      .then((res) => {
        const fetchedColleges = [];
        for (let key in res.data) {
          fetchedColleges.push({
            college_id: res.data[key].college_id,
            name: res.data[key].name,
            is_active: res.data[key].is_active,
            created_at: res.data[key].created_at,
            updated_at: res.data[key].updated_at,
          });
        }
        this.setState({
          rows: [...this.state.rows, ...fetchedColleges],
        });
      });
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
      axios
        .post("/colleges/delete.php", JSON.stringify({ id: id }))
        .then((response) => {
          this.props.onSendMessage("College Deleted", "success");
          setTimeout(() => {
            window.location.href = "/dashboard/collegesSummary";
          }, 1000);
        })
        .catch((error) => {
          this.props.onSendMessage("Something went wrong", "error");
        });
    });
  }

  editHandler() {
    this.setState({
      doEdit: true,
      editRedirectionLink:
        "/dashboard/editCollege?collegeId=" + this.state.selectedRowId,
    });
  }

  render() {
    let colleges = this.state.rows
      ? this.state.rows.map((college, index) => {
          return {
            id: college.college_id,
            college_id: college.college_id,
            name: college.name,
            is_active: college.is_active,
            created_at: college.created_at,
            updated_at: college.updated_at,
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
                Edit College
              </Button>
              <Button
                onClick={() => this.deleteHandler.bind(this)()}
                variant="contained"
                color="primary"
                className={classes.ActionButton}
              >
                Delete College
              </Button>
            </div>
          ) : this.state.rowSelected && this.state.noOfSelectedRows > 1 ? (
            <Button
              onClick={() => this.deleteHandler.bind(this)()}
              variant="contained"
              color="primary"
              className={classes.ActionButton}
            >
              Delete College
            </Button>
          ) : null}
        </div>
        <DataGrid
          rows={colleges}
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

const mapDispatchToProps = (dispatch) => {
  return {
    onSendMessage: (message, messageType) =>
      dispatch(actions.sendMessage(message, messageType)),
  };
};

export default connect(null, mapDispatchToProps)(CollegeSummary);
