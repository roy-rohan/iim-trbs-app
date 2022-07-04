import {
  Backdrop,
  Button,
  Chip,
  CircularProgress,
  Fade,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  withStyles,
} from "@material-ui/core";
import React, { Component } from "react";
import * as cssClasses from "./OrderDetail.module.css";
import axios from "../../../../axios-iim";
import * as actions from "../../../../store/actions/index";
import { connect } from "react-redux";

const styles = (theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(10, 10, 10),
  },
});

class OrderDetail extends Component {
  state = {
    data: null,
    showLoader: true,
    showStatusModal: false,
  };

  constructor(props) {
    super(props);
    this.transactionStatusCheckIdRef = React.createRef();
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    axios
      .get("/users/order/read_single.php?id=" + this.props.match.params.id)
      .then((response) => {
        this.setState({ data: response.data, showLoader: false });
      })
      .catch((error) => {
        this.props.onSendMessage(
          "Could not fetch transaction details.",
          "error"
        );
        this.setState({ showLoader: false });
      });
  }

  onCheckStatusHandler() {
    let txnId =
      this.transactionStatusCheckIdRef.current.querySelector("input").value;
    this.props.onCheckPaymentStatus(
      txnId,
      this.state.data.order_id,
      this.props.user.app_user_id,
      this.props.user.email_id
    );
    this.setState({ showStatusModal: false });
  }

  onCheckStatusModalHandler() {
    this.setState({ showStatusModal: true });
  }

  onCheckStatusClose() {
    this.setState({ showStatusModal: false });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={cssClasses.OrderDetail}>
        <h1 className={cssClasses.OrderHeader}>Transaction Details</h1>
        {this.state.data ? (
          <div className={cssClasses.TransactionDetail}>
            <div className={cssClasses.TrasactionHeader}>
              <div className={cssClasses.TransactionId}>
                <p>Transaction ID: </p>
                <p>{this.state.data.payment.transaction_id}</p>
              </div>
              <div className={cssClasses.TransactionStatus}>
                <p>Payment Status: </p>
                {this.state.data.status.toUpperCase() === "SUCCESS" ? (
                  <Chip
                    label={this.state.data.status}
                    style={{ backgroundColor: "#39c16c" }}
                  />
                ) : null}
                {this.state.data.status.toUpperCase() === "FAILED" ? (
                  <Chip
                    label={this.state.data.status}
                    style={{ backgroundColor: "#d9512c" }}
                  />
                ) : null}
                {this.state.data.status.toUpperCase() === "PENDING" ? (
                  <Chip
                    label={this.state.data.status}
                    style={{ backgroundColor: "#f29339" }}
                  />
                ) : null}
              </div>
            </div>
            <TableContainer component={Paper}>
              <Table className={cssClasses.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell align="left">Type</TableCell>
                    <TableCell align="left">Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.data.bookings.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell component="th" scope="row">
                        {row.product_name}
                      </TableCell>
                      <TableCell align="left">{row.product_type}</TableCell>
                      <TableCell align="left">&#8377; {row.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow
                    className={[
                      cssClasses.FooterRow,
                      cssClasses.FooterFirstRow,
                    ].join(" ")}
                  >
                    <TableCell
                      colSpan={1}
                      className={cssClasses.FooterBlankCell}
                    />
                    <TableCell
                      align="left"
                      colSpan={1}
                      className={cssClasses.FooterBillHead}
                    >
                      Subtotal
                    </TableCell>
                    <TableCell
                      align="left"
                      className={cssClasses.FooterBillValue}
                    >
                      &#8377;{" "}
                      {+this.state.data.total + +this.state.data.discount}
                    </TableCell>
                  </TableRow>
                  <TableRow className={cssClasses.FooterRow}>
                    <TableCell
                      colSpan={1}
                      className={cssClasses.FooterBlankCell}
                    />
                    <TableCell
                      align="left"
                      colSpan={1}
                      className={cssClasses.FooterBillHead}
                    >
                      Discount
                    </TableCell>
                    <TableCell
                      align="left"
                      className={cssClasses.FooterBillValue}
                    >
                      &#8377; {this.state.data.discount}
                    </TableCell>
                  </TableRow>
                  <TableRow className={cssClasses.FooterRow}>
                    <TableCell
                      colSpan={1}
                      className={cssClasses.FooterBlankCell}
                    />
                    <TableCell
                      align="left"
                      colSpan={1}
                      className={cssClasses.FooterBillHead}
                    >
                      Total
                    </TableCell>
                    <TableCell
                      align="left"
                      className={cssClasses.FooterBillValue}
                    >
                      &#8377; {this.state.data.total}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
            <div className={cssClasses.TransactionFooter}>
              <div className={cssClasses.TransactionDate}>
                Transaction Date:{" "}
                {new Date(this.state.data.created_at).toDateString()}
              </div>
              {this.state.data.status.toUpperCase() !== "SUCCESS" &&
              this.state.data.status.toUpperCase() !== "FAILED" ? (
                <div className={cssClasses.CheckStatus}>
                  <p>Have Made Payment ? </p>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => this.onCheckStatusModalHandler()}
                  >
                    Check Status
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        ) : this.state.showLoader ? (
          <CircularProgress className={cssClasses.NoData} />
        ) : (
          <p className={cssClasses.NoData}>No data</p>
        )}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={this.state.showStatusModal}
          onClose={() => this.onCheckStatusClose()}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={this.state.showStatusModal}>
            <div className={classes.paper}>
              <h2 id="transition-modal-title">Enter Transaction ID</h2>
              <TextField
                ref={this.transactionStatusCheckIdRef}
                className={cssClasses.TransactionIdInput}
                fullWidth
              />
              <Button
                variant="contained"
                color="primary"
                className={cssClasses.CheckStatusButton}
                onClick={() => this.onCheckStatusHandler()}
              >
                Submit
              </Button>
            </div>
          </Fade>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    user: state.auth.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSendMessage: (message, type) =>
      dispatch(actions.sendMessage(message, type)),
    onCheckPaymentStatus: (txnId, orderId, userId, emailId) =>
      dispatch(actions.checkPaymentStatus(txnId, orderId, userId, emailId)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles, { withTheme: true })(OrderDetail));
