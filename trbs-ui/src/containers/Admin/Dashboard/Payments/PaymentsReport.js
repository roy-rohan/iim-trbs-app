import { Chip } from "@material-ui/core";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import { Done, ErrorOutline } from "@material-ui/icons";
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import axios from "../../../../axios-iim";

const columns = [
  { field: "id", headerName: "Booking ID", width: 200 },
  { field: "transaction_id", headerName: "Transaction ID", width: 200 },
  { field: "amount", headerName: "Amount", width: 200 },
  {
    field: "description",
    headerName: "Description",
    width: 300,
  },
  {
    field: "status",
    headerName: "Status",
    width: 250,
    renderCell: (params) => {
      let status = params.value.toUpperCase();
      let html = <p>pending</p>;
      if (status === "1") {
        html = (
          <Chip
            icon={<Done />}
            label={"Success"}
            style={{ backgroundColor: "#39c16c" }}
          />
        );
      } else if (status === "0") {
        html = (
          <Chip
            icon={<ErrorOutline />}
            label={"Failed"}
            style={{ backgroundColor: "#d9512c" }}
          />
        );
      }

      return html;
    },
  },
  {
    field: "order_id",
    headerName: "Order Id",
    width: 300,
    renderCell: (params) => {
      return <NavLink to={`/orderdetail/${params.value}`}>{params.value}</NavLink>
    }
  },
  { field: "user_id", headerName: "User ID", width: 200 },
  { field: "first_name", headerName: "User First Name", width: 200 },
  { field: "last_name", headerName: "User Last Name", width: 200 },
  { field: "email_id", headerName: "Email ID", width: 200 },
  { field: "mobile_no", headerName: "Mobile No", width: 200 },
  { field: "created_at", headerName: "Created At", width: 200 },
  { field: "updated_at", headerName: "Updated At", width: 200 },
];

class PaymentsReport extends Component {
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
        "/reports/payments.php",
        JSON.stringify({
          filters: [],
          filter_op: "",
          sort: [],
        })
      )
      .then((response) => {
        const fetchedPayments = [];
        for (let key in response.data) {
          fetchedPayments.push({
            ...response.data[key],
            id: key,
          });
        }
        this.setState({ rows: fetchedPayments });
      })
      .catch((error) => {});
  }

  render() {
    let events = this.state.rows.map((payment, index) => {
      return {
        id: payment.payment_id,
        transaction_id: payment.transaction_id,
        amount: payment.amount,
        created_at: payment.created_at,
        updated_at: payment.updated_at,
        user_id: payment.user_id,
        description: payment.description,
        order_id: payment.order_id,
        first_name: payment.first_name,
        last_name: payment.last_name,
        status: payment.status,
        email_id: payment.email_id,
        mobile_no: payment.mobile_no,
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

export default PaymentsReport;
