import { Button } from "@material-ui/core";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import * as actions from "../../../../../store/actions/index";
import * as classes from "./ContactPersonSummary.module.css";

const columns = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "poc", headerName: "POC", width: 200 },
  { field: "email", headerName: "Email", width: 200 },
  { field: "designation", headerName: "Role", width: 500 },
];

class ContactPersonSummary extends Component {
  state = {
    rows: [],
    selectedRowId: null,
    rowSelected: false,
    doEdit: false,
    editRedirectionLink: null,
    noOfSelectedRows: 0,
  };

  componentDidMount() {
    this.props.onFetchContactPersons(
      "all_contact_persons",
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
      this.props.onDeleteContactPerson(id);
    });
  }

  editHandler() {
    this.setState({
      doEdit: true,
      editRedirectionLink:
        "/dashboard/editContactPerson?contactPersonId=" +
        this.state.selectedRowId,
    });
  }

  render() {
    let contactPersons =
      this.props.contactPersons &&
      this.props.contactPersons["all_contact_persons"]
        ? this.props.contactPersons["all_contact_persons"].map(
            (contactPerson, index) => {
              return {
                id: contactPerson.contact_person_id,
                contact_person_id: contactPerson.contact_person_id,
                poc: contactPerson.poc,
                email: contactPerson.email,
                contact_role_id: contactPerson.contact_role_id,
                designation: contactPerson.designation,
                priority: contactPerson.priority,
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
                Edit Person
              </Button>
              <Button
                onClick={() => this.deleteHandler.bind(this)()}
                variant="contained"
                color="primary"
                className={classes.ActionButton}
              >
                Delete Person
              </Button>
            </div>
          ) : this.state.rowSelected && this.state.noOfSelectedRows > 1 ? (
            <Button
              onClick={() => this.deleteHandler.bind(this)()}
              variant="contained"
              color="primary"
              className={classes.ActionButton}
            >
              Delete Person
            </Button>
          ) : null}
        </div>
        <DataGrid
          rows={contactPersons}
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
    contactPersons: state.contactPerson.contactPersons,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchContactPersons: (category, queryCriteria) =>
      dispatch(actions.fetchContactPersons(category, queryCriteria)),
    onDeleteContactPerson: (contactPersonId) =>
      dispatch(actions.deleteContactPerson(contactPersonId)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactPersonSummary);
