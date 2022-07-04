import { Chip } from "@material-ui/core";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import { Done, ErrorOutline, HourglassEmpty } from "@material-ui/icons";
import React, { Component } from "react";
import axios from "../../../../axios-iim";

const columns = [
  { field: "id", headerName: "Booking ID", width: 200 },
  {
    field: "status",
    headerName: "Status",
    width: 250,
    renderCell: (params) => {
      let status = params.value.toUpperCase();
      let html = <p>pending</p>;
      if (status === "SUCCESS") {
        html = (
          <Chip
            icon={<Done />}
            label={status}
            style={{ backgroundColor: "#39c16c" }}
          />
        );
      } else if (status === "PENDING") {
        html = (
          <Chip
            icon={<HourglassEmpty />}
            label={status}
            style={{ backgroundColor: "#f29339" }}
          />
        );
      } else if (status === "FAILED") {
        html = (
          <Chip
            icon={<ErrorOutline />}
            label={status}
            style={{ backgroundColor: "#d9512c" }}
          />
        );
      }

      return html;
    },
  },
  { field: "price", headerName: "Price", width: 200 },
  { field: "quantity", headerName: "QTY", width: 200 },
  {
    field: "product_type",
    headerName: "Booking Type",
    width: 300,
  },
  {
    field: "product_name",
    headerName: "Booking Name",
    width: 300,
  },
  {
    field: "ticket_no",
    headerName: "Ticket No.",
    width: 300,
  },
  {
    field: "venue",
    headerName: "Venue",
    width: 300,
  },
  {
    field: "time",
    headerName: "Time",
    width: 200,
  },
  { field: "user_id", headerName: "User ID", width: 200 },
  { field: "first_name", headerName: "User First Name", width: 200 },
  { field: "last_name", headerName: "User Last Name", width: 200 },
  { field: "email_id", headerName: "Email ID", width: 200 },
  { field: "mobile_no", headerName: "Mobile No", width: 200 },
  { field: "transaction_id", headerName: "Transaction ID", width: 200 },
  { field: "created_at", headerName: "Created At", width: 200 },
  { field: "updated_at", headerName: "Updated At", width: 200 },
];

class BookingsReport extends Component {
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
        "/reports/bookings.php",
        JSON.stringify({
          filters: [],
          filter_op: "",
          sort: [],
        })
      )
      .then((response) => {
        const fetchedBookings = [];
        for (let key in response.data) {
          fetchedBookings.push({
            ...response.data[key],
            id: key,
          });
        }
        this.setState({ rows: fetchedBookings });
      })
      .catch((error) => {});
  }

  render() {
    let events = this.state.rows.map((booking, index) => {
      return {
        id: booking.booking_id,
        product_id: booking.product_id,
        price: booking.price,
        quantity: booking.quantity,
        product_type: booking.product_type,
        product_name: booking.product_name,
        product_image: booking.product_image,
        status: booking.status,
        ticket_no: booking.ticket_no,
        venue: booking.venue,
        time: booking.time,
        user_id: booking.user_id,
        first_name: booking.first_name,
        last_name: booking.last_name,
        email_id: booking.email_id,
        mobile_no: booking.mobile_no,
        transaction_id: booking.transaction_id,
        created_at: booking.created_at,
        updated_at: booking.updated_at,
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

export default BookingsReport;
