import { Button } from "@material-ui/core";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import CustomImage from "../../../../../components/UI/CustomImage/CustomImage";
import * as actions from "../../../../../store/actions/index";
import * as classes from "./MemberSummary.module.css";

const columns = [
  { field: "id", headerName: "Member ID", width: 100 },
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
  { field: "designation", headerName: "Designation", width: 200 },
  { field: "more_info", headerName: "More Info", width: 200 },
  { field: "visible", headerName: "Visible", width: 200 },
  { field: "created_at", headerName: "Created At", width: 200 },
  { field: "updated_at", headerName: "Updated At", width: 200 },
];

class MemberSummary extends Component {
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
    this.props.onFetchMembers(
      "all_members",
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
      this.props.onDeleteMember(id);
    });
  }

  editHandler() {
    this.setState({
      doEdit: true,
      editRedirectionLink:
        "/dashboard/editMember?memberId=" + this.state.selectedRowId,
    });
  }

  render() {
    let members =
      this.props.members && this.props.members["all_members"]
        ? this.props.members["all_members"].map((member, index) => {
            return {
              id: member.member_id,
              name: member.name,
              designation: member.designation,
              more_info: member.more_info,
              visible: member.visible,
              image_url: member.image_url,
              created_at: member.created_at,
              updated_at: member.updated_at,
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
                Edit Member
              </Button>
              <Button
                onClick={() => this.deleteHandler.bind(this)()}
                variant="contained"
                color="primary"
                className={classes.ActionButton}
              >
                Delete Member
              </Button>
            </div>
          ) : this.state.rowSelected && this.state.noOfSelectedRows > 1 ? (
            <Button
              onClick={() => this.deleteHandler.bind(this)()}
              variant="contained"
              color="primary"
              className={classes.ActionButton}
            >
              Delete Member
            </Button>
          ) : null}
        </div>
        <DataGrid
          rows={members}
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
    members: state.member.members,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchMembers: (category, queryCriteria) =>
      dispatch(actions.fetchMembers(category, queryCriteria)),
    onDeleteMember: (memberId) => dispatch(actions.deleteMember(memberId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MemberSummary);
