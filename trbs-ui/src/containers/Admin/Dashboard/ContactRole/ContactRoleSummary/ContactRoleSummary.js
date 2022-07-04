import { Button } from "@material-ui/core";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import * as actions from "../../../../../store/actions/index";
import * as classes from "./ContactRoleSummary.module.css";
import axios from "../../../../../axios-iim";

const columns = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "contact_people_count", headerName: "POC Count", width: 200 },
  { field: "designation", headerName: "Role", width: 500 },
];

class ContactRoleSummary extends Component {
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
        "/contact-role/read.php",
        JSON.stringify({
          filters: [],
          filter_op: "",
          sort: [],
        })
      )
      .then((res) => {
        const fetchedRoles = [];
        for (let key in res.data) {
          fetchedRoles.push({
            contact_role_id: res.data[key].contact_role_id,
            designation: res.data[key].designation,
            priority: res.data[key].priority,
            contact_people_count: res.data[key].contact_people.length,
          });
        }
        this.setState({
          rows: [...this.state.rows, ...fetchedRoles],
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
      this.props.onDeleteContactRole(id);
    });
  }

  editHandler() {
    this.setState({
      doEdit: true,
      editRedirectionLink:
        "/dashboard/editContactRole?contactRoleId=" + this.state.selectedRowId,
    });
  }

  render() {
    let contactRoles = this.state.rows
      ? this.state.rows.map((contactRole, index) => {
          return {
            id: contactRole.contact_role_id,
            contact_people_count: contactRole.contact_people_count,
            contact_role_id: contactRole.contact_role_id,
            designation: contactRole.designation,
            priority: contactRole.priority,
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
                Edit Role
              </Button>
              <Button
                onClick={() => this.deleteHandler.bind(this)()}
                variant="contained"
                color="primary"
                className={classes.ActionButton}
              >
                Delete Role
              </Button>
            </div>
          ) : this.state.rowSelected && this.state.noOfSelectedRows > 1 ? (
            <Button
              onClick={() => this.deleteHandler.bind(this)()}
              variant="contained"
              color="primary"
              className={classes.ActionButton}
            >
              Delete Role
            </Button>
          ) : null}
        </div>
        <DataGrid
          rows={contactRoles}
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
    onDeleteContactRole: (contactRoleId) =>
      dispatch(actions.deleteContactRole(contactRoleId)),
  };
};

export default connect(null, mapDispatchToProps)(ContactRoleSummary);
