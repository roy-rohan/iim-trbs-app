import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import MatBackdrop from "../../../../components/UI/Backdrop/MatBackdrop/MatBackdrop";
import CustomImage from "../../../../components/UI/CustomImage/CustomImage";
import * as actions from "../../../../store/actions/index";
import * as classes from "./Cart.module.css";

class Cart extends Component {
  state = {
    loading: false,
  };
  constructor(props) {
    super(props);
    this.couponCodeRef = React.createRef();
  }
  componentDidMount() {
    this.props.onCartLoad(this.props.cart.cart_id, this.loadBill);
  }

  loadBill() {
    let updatedState = {
      ...this.state,
      total: this.props.cart.total,
      discount: this.props.cart.coupon.coupon_id
        ? this.props.cart.coupon.discount
        : 0.0,
    };
    this.setState(updatedState);
  }

  handleCheckout() {
    this.props.onAddOrder(
      this.props.token,
      this.props.user,
      this.props.cart,
      this.props.onGetPaymentLink
    );
  }

  isCartValid() {
    let isCartEmpty = this.props.cart.cart_items.length > 0 ? false : true;
    let isTotalValid = this.props.cart.total < 0 ? false : true;
    return !isCartEmpty && isTotalValid;
  }

  removeCouponHandler() {
    if (this.props.loading) {
      return;
    }
    this.couponCodeRef.current
      .querySelector("input")
      .setAttribute("value", null);
    this.props.onCouponRemove(
      this.props.cart,
      this.updateButtonState.bind(this)
    );
  }

  removeCartItemHandler(cart_item_id, cart_item_price) {
    this.setState({ loading: true });
    if (this.props.loading) {
      return;
    }
    this.props.onCartItemRemove(
      this.props.cart,
      cart_item_id,
      cart_item_price,
      this.updateButtonState.bind(this)
    );
  }

  updateButtonState() {
    this.setState({ loading: false });
  }

  applyCouponHandler() {
    this.setState({ loading: true });
    let couponCode = this.couponCodeRef.current.querySelector("input").value;

    this.props.onCouponApply(
      this.props.cart,
      couponCode,
      this.updateButtonState.bind(this)
    );
  }

  clearCartHandler() {
    this.setState({ loading: true });
    if (this.props.loading) {
      return;
    }
    this.props.onClearCart(this.props.cart, this.updateButtonState.bind(this));
  }

  render() {
    return (
      <div>
        <MatBackdrop open={this.props.loading} />
        <div className={classes.PageHeader}>Cart</div>
        <div className={classes.PageContent}>
          <div className={classes.Cart}>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Product</TableCell>
                    <TableCell align="center">Registration Fee</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.props.cart.cart_items.map((row) => (
                    <TableRow key={row.product_name}>
                      <TableCell
                        align="center"
                        className={classes.ProductContainer}
                      >
                        <div className={classes.Product}>
                          <CustomImage src={row.product_image} alt="product" />
                          <div className={classes.ProductDesc}>
                            <NavLink
                              to={
                                "/" + row.product_type + "s/" + row.product_slug
                              }
                            >
                              <h2 className={classes.ProductName}>
                                {row.product_name}
                              </h2>
                              <p className={classes.ProductType}>
                                {row.product_type}
                              </p>
                            </NavLink>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell align="center">&#8377; {row.price}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          color="secondary"
                          disabled={this.state.loading}
                          onClick={() =>
                            this.removeCartItemHandler(
                              row.cart_item_id,
                              row.price
                            )
                          }
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div className={classes.CheckoutContainer}>
            <div className={classes.CartBill}>
              <p className={classes.SubTotal}>
                SUBTOTAL : &#8377; {this.props.cart.sub_total}
              </p>
              <div className={classes.CouponContainer}>
                <TextField
                  id="outlined-basic"
                  label="Enter Coupon Code"
                  className={classes.CouponField}
                  ref={this.couponCodeRef}
                  value={
                    this.props.cart.coupon.coupon_id
                      ? this.props.cart.coupon.coupon_code
                      : null
                  }
                />
                {this.props.cart.coupon.coupon_id ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    className={classes.CouponButton}
                    disabled={this.state.loading}
                    onClick={this.removeCouponHandler.bind(this)}
                  >
                    REMOVE COUPON
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.CouponButton}
                    disabled={this.state.loading}
                    onClick={this.applyCouponHandler.bind(this)}
                  >
                    APPLY COUPON
                  </Button>
                )}
              </div>
              <div className={classes.Discount}>
                <p>
                  DISCOUNT : &#8377;
                  {this.props.cart.coupon.coupon_id
                    ? this.props.cart.coupon.discount
                    : 0.0}
                </p>
              </div>
              <p className={classes.CartTotal}>
                CART TOTAL : &#8377; {this.props.cart.total}
              </p>
            </div>
            <Button
              variant="contained"
              color="primary"
              className={classes.ClearCartButton}
              disabled={this.state.loading}
              onClick={this.clearCartHandler.bind(this)}
            >
              Clear Cart
            </Button>
            <div className={classes.PaymentContainer}>
              <Button
                variant="contained"
                fullWidth
                color="primary"
                disabled={this.props.cart.cart_items.length <= 0}
                onClick={() => this.handleCheckout()}
              >
                Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    cart: state.auth.cart,
    user: state.auth.user,
    token: state.auth.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCartLoad: (cart_id) => dispatch(actions.fetchCartById(cart_id)),
    onCartItemRemove: (cart, cart_item_id, cart_item_price, cb) =>
      dispatch(actions.removeCartItem(cart, cart_item_id, cart_item_price, cb)),
    onCouponRemove: (cart, cb) => dispatch(actions.removeCoupon(cart, cb)),
    onCouponApply: (cart, coupon_code, cb) =>
      dispatch(actions.onCouponApply(cart, coupon_code, cb)),
    onAddOrder: (token, cart, userId, cb) =>
      dispatch(actions.addOrder(token, cart, userId, cb)),
    onGetPaymentLink: (token, user, cart, orderId) =>
      dispatch(actions.getPaymentLink(token, user, cart, orderId)),
    onClearCart: (cart, cb) => dispatch(actions.clearCart(cart, cb)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
