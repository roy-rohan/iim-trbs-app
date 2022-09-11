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
import * as classes from "./WorkshopBookings.module.css";

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

class WorkshopBookings extends Component {
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
    let workshops = this.props.data
      .filter((d) => d.product_type === "workshop")
      .filter((d) => {
        for (let key in this.state.customGridFilters) {
          return d[key] && d[key].toLowerCase() === this.state.customGridFilters[key].toLowerCase();
        }
        return false;
      })
      .map((workshop, index) => {
        return {
          id: index + 1,
          productImage: workshop.product_image,
          productName: workshop.product_name,
          ticketNo: workshop.ticket_no,
          time: workshop.ticket_no ? workshop.time : null,
          venue: workshop.ticket_no ? workshop.venue : null,
          status: workshop.status,
          orderId: workshop.order_id,
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
        <div style={{height: "300px"}}>
          <DataGrid
            rows={workshops}
            columns={columns}
            rowHeight="60"
            disableSelectionOnClick
          />
        </div>
      </div>
    );
  }
}
export default WorkshopBookings;
