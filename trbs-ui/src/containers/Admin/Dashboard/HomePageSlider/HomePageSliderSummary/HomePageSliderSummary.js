import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import React, { Component } from "react";
import CustomImage from "../../../../../components/UI/CustomImage/CustomImage";
import axios from "../../../../../axios-iim";
import { Redirect } from "react-router";
import { Button } from "@material-ui/core";
import * as classes from "./HomePageSliderSummary.module.css";

const columns = [
  { field: "id", headerName: "ID", width: 200 },
  { field: "image_id", headerName: "Image ID", width: 200 },
  {
    field: "path",
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
  { field: "order", headerName: "Order", width: 200 },
  { field: "created_at", headerName: "Created At", width: 200 },
  { field: "updated_at", headerName: "Updated At", width: 200 },
];

class HomePageSliderSummary extends Component {
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
        "/images/read.php",
        JSON.stringify({
          filters: [
            {
              field_name: "entity_type",
              value: "slider",
              op: "=",
            },
          ],
          filter_op: "AND",
          sort: [],
        })
      )
      .then((response) => {
        const fetchedSliderImages = [];
        for (let key in response.data) {
          fetchedSliderImages.push({
            ...response.data[key],
            id: key,
          });
        }
        this.setState({ rows: fetchedSliderImages });
      })
      .catch((error) => {});
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
        .post("/images/delete.php", JSON.stringify({ id: id }))
        .then((response) => {})
        .catch((error) => {});
    });
    setTimeout(() => {
      window.location.href = "/dashboard/sliderImageSummary";
    }, 2000);
  }

  editHandler() {
    this.setState({
      doEdit: true,
      editRedirectionLink:
        "/dashboard/editSliderImage?imageId=" + this.state.selectedRowId,
    });
  }

  render() {
    let events = this.state.rows.map((image, index) => {
      return {
        id: image.image_id,
        image_id: image.image_id,
        path: image.path,
        order: image.entity_id,
        created_at: image.created_at,
        updated_at: image.updated_at,
      };
    });
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
                Edit Image
              </Button>
              <Button
                onClick={() => this.deleteHandler.bind(this)()}
                variant="contained"
                color="primary"
                className={classes.ActionButton}
              >
                Delete Image
              </Button>
            </div>
          ) : this.state.rowSelected && this.state.noOfSelectedRows > 1 ? (
            <Button
              onClick={() => this.deleteHandler.bind(this)()}
              variant="contained"
              color="primary"
              className={classes.ActionButton}
            >
              Delete Image
            </Button>
          ) : null}
        </div>
        <DataGrid
          rows={events}
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

export default HomePageSliderSummary;
