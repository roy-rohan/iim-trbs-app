import { Button, Chip } from "@material-ui/core";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import { Done, ErrorOutline } from "@material-ui/icons";
import React, { Component } from "react";
import axios from "../../../../../axios-iim";
import * as classes from "./CouponSummary.module.css";
import * as actions from "../../../../../store/actions/index";
import { connect } from "react-redux";

const columns = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "coupon_id", headerName: "Coupon ID", width: 200 },
  { field: "coupon_code", headerName: "Coupon Code", width: 200 },
  {
    field: "status",
    headerName: "Status",
    width: 200,
    renderCell: (params) => {
      let status = params.value.toUpperCase();
      let html = <p>pending</p>;
      if (status === "0") {
        html = (
          <Chip
            icon={<Done />}
            label="Available"
            style={{ backgroundColor: "#39c16c" }}
          />
        );
      } else if (status === "-1") {
        html = (
          <Chip
            icon={<ErrorOutline />}
            label="Expired"
            style={{ backgroundColor: "#d9512c" }}
          />
        );
      } else {
        html = (
          <Chip
            icon={<ErrorOutline />}
            label="Used"
            style={{ backgroundColor: "#d9512c" }}
          />
        );
      }

      return html;
    },
  },
  { field: "discount", headerName: "Discount", width: 200 },
  { field: "applied_on", headerName: "Applied On", width: 500 },
  { field: "created_at", headerName: "Created At", width: 200 },
  { field: "updated_at", headerName: "Updated At", width: 200 },
];

class CouponSummary extends Component {
  state = {
    rows: [],
    selectedRowId: null,
    rowSelected: false,
    noOfSelectedRows: 0,
  };

  componentDidMount() {
    axios
      .post(
        "/admin/coupons/read.php",
        JSON.stringify({
          filters: [],
          filter_op: "",
          sort: [
            {
              field_name: "coupon_id",
              op: "desc",
            },
          ],
        })
      )
      .then((response) => {
        const fetchedCoupons = [];
        for (let key in response.data) {
          fetchedCoupons.push({
            ...response.data[key],
            id: key,
          });
        }
        this.setState({ rows: fetchedCoupons });
      })
      .catch((error) => {});
  }

  invalidatePreviousYearCoupons() {
    axios
      .post("/admin/coupons/invalidate.php")
      .then((response) => {
        this.props.onSendMessage(
          "Coupon(s) invalidated successfully",
          "success"
        );
      })
      .catch((error) => {
        this.props.onSendMessage("Something went wrong.", "error");
      });
  }

  render() {
    let events = this.state.rows.map((coupon, index) => {
      return {
        id: coupon.coupon_id,
        coupon_id: coupon.coupon_id,
        coupon_code: coupon.coupon_code,
        status: coupon.status,
        discount: coupon.discount,
        product_name: coupon.product_name,
        product_image: coupon.product_image,
        applied_on: coupon.applied_on,
        created_at: coupon.created_at,
        updated_at: coupon.updated_at,
      };
    });
    let content = (
      <div style={{ height: 700, width: "100%" }}>
        <div className={classes.ActionRows}>
          <div>
            <Button
              onClick={() => this.invalidatePreviousYearCoupons.bind(this)()}
              variant="contained"
              color="primary"
              className={classes.ActionButton}
            >
              Invalidate Previous Year Coupons
            </Button>
          </div>
        </div>
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

const mapDispatchToProps = (dispatch) => {
  return {
    onSendMessage: (message, messageType) =>
      dispatch(actions.sendMessage(message, messageType)),
  };
};

export default connect(null, mapDispatchToProps)(CouponSummary);
