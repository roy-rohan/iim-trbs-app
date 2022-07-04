import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import React, { Component } from "react";
import axios from "../../../../axios-iim";

const columns = [
  { field: "id", headerName: "Booking ID", width: 200 },
  { field: "first_name", headerName: "User First Name", width: 200 },
  { field: "last_name", headerName: "User Last Name", width: 200 },
  { field: "email_id", headerName: "Email ID", width: 200 },
  { field: "mobile_no", headerName: "Mobile No", width: 200 },
  { field: "college", headerName: "College", width: 200 },
  { field: "state", headerName: "State", width: 200 },
  {
    field: "address",
    headerName: "Address",
    width: 300,
  },
  {
    field: "year",
    headerName: "Year",
    width: 300,
  },
  { field: "email_validated", headerName: "Is Email validated", width: 200 },
  { field: "role", headerName: "Role", width: 200 },
  { field: "created_at", headerName: "Created At", width: 200 },
  { field: "updated_at", headerName: "Updated At", width: 200 },
];

class RegistrationsReport extends Component {
  state = {
    rows: [],
    selectedRowId: null,
    rowSelected: false,
    doEdit: false,
    editRedirectionLink: null,
    noOfSelectedRows: 0,
  };

  componentDidMount() {
    axios
      .post(
        "/users/read.php",
        JSON.stringify({
          filters: [],
          filter_op: "",
          sort: [],
        })
      )
      .then((response) => {
        const fetchedUsers = [];
        for (let key in response.data) {
          fetchedUsers.push({
            ...response.data[key],
            id: key,
          });
        }
        this.setState({ rows: fetchedUsers });
      })
      .catch((error) => {});
  }

  render() {
    let events = this.state.rows.map((payment, index) => {
      return {
        id: payment.app_user_id,
        first_name: payment.first_name,
        last_name: payment.last_name,
        email_id: payment.email_id,
        mobile_no: payment.mobile_no,
        college: payment.college,
        state: payment.state,
        address: payment.address,
        year: payment.year,
        email_validated: payment.email_validated,
        role: payment.role,
        created_at: payment.created_at,
        updated_at: payment.updated_at,
      };
    });
    let content = (
      <div style={{ height: 700, width: "100%" }}>
        <DataGrid
          rows={events}
          columns={columns}
          pageSize={10}
          components={{
            Toolbar: GridToolbar,
          }}
        />
      </div>
    );
    return <>{content}</>;
  }
}

export default RegistrationsReport;
