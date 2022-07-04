import React from "react";
import { DataGrid } from "@material-ui/data-grid";
import { Component } from "react";
import CustomImage from "../../../../../components/UI/CustomImage/CustomImage";
import { NavLink } from "react-router-dom";
import {
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@material-ui/core";
import { Done, ErrorOutline, HourglassEmpty } from "@material-ui/icons";
import * as classes from "./InformalEventBookings.module.css";

const columns = [
  { field: "id", headerName: "ID", width: 100 },
  {
    field: "productImage",
    headerName: " ",
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
  {
    field: "productName",
    headerName: "Title",
    width: 200,
    renderCell: (params) => {
      let html = <div className={classes.DataCell}>{params.value}</div>;
      if (params.value?.split("").length > 25) {
        html = (
          <Tooltip title={[params.value]} arrow>
            <div className={classes.DataCell}>{params.value}</div>
          </Tooltip>
        );
      }
      return html;
    },
  },
  {
    field: "ticketNo",
    headerName: "Ticket No",
    width: 200,
    valueGetter: (params) => {
      return params.value === "" || params.value == null ? "-" : params.value;
    },
  },
  {
    field: "time",
    headerName: "Time",
    type: "dateTime",
    width: 150,
    valueGetter: (params) => {
      return params.value === "" || params.value == null
        ? "-"
        : new Date(params.value).toDateString();
    },
  },
  {
    field: "venue",
    headerName: "Venue",
    width: 200,
    valueGetter: (params) => {
      return params.value === "" || params.value === null ? "-" : params.value;
    },
  },
  {
    field: "status",
    headerName: "Status",
    width: 150,
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
            className={classes.Pending}
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
  {
    field: "orderId",
    headerName: "Transaction Details",
    width: 200,
    renderCell: (params) => {
      let message = "NA";
      if (params.value != null) {
        message = (
          <Button variant="contained" color="primary">
            <NavLink
              to={"/orderdetail/" + params.value}
              style={{ textDecoration: "none", color: "#ffffff" }}
            >
              Show Details
            </NavLink>
          </Button>
        );
      }
      return message;
    },
  },
];

class InformalEventBookings extends Component {
  state = {
    rows: [],
    customGridFilters: {
      status: "success",
    },
  };

  handleChange = (event, key) => {
    this.setState({
      customGridFilters: {
        ...this.state.customGridFilters,
        [key]: event.target.value,
      },
    });
  };

  render() {
    let informalEvents = this.props.data
      .filter((d) => d.product_type === "informal_event")
      .filter((d) => {
        for (let key in this.state.customGridFilters) {
          console.log(this.state.customGridFilters[key]);
          return d[key] && d[key] === this.state.customGridFilters[key];
        }
        return false;
      })
      .map((informalEvent, index) => {
        return {
          id: index + 1,
          productImage: informalEvent.product_image,
          productName: informalEvent.product_name,
          ticketNo: informalEvent.ticket_no,
          time: informalEvent.ticket_no ? informalEvent.time : null,
          venue: informalEvent.ticket_no ? informalEvent.venue : null,
          status: informalEvent.status,
          orderId: informalEvent.order_id,
        };
      });
    return (
      <div>
        <div className={classes.CustomFilterContainer}>
          {/* <h3 className={classes.CustomFilterHeader}>Custom Filter(s)</h3> */}
          <div className={classes.CustomFilters}>
            <FormControl size="medium">
              <InputLabel id="filer-value-label">Status</InputLabel>
              <Select
                labelId="filer-value"
                id="filter-value"
                value={this.state.customGridFilters["status"]}
                label="Filter Value"
                onChange={(e) => this.handleChange(e, "status")}
              >
                <MenuItem value="success">Success</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <DataGrid
          rows={informalEvents}
          columns={columns}
          pageSize={5}
          autoHeight
          disableSelectionOnClick
        />
      </div>
    );
  }
}
export default InformalEventBookings;
