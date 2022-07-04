import axios from "../../axios-iim";
import * as actionTypes from "./actionTypes";
import { startLoading, stopLoading } from "./common";
import { sendMessage } from "./messenger";

const fetchCartSuccess = (cartData) => {
  return {
    type: actionTypes.CART_FETCH_SUCCESS,
    cart: cartData,
  };
};

const fetchCartFailure = (error) => {
  return {
    type: actionTypes.CART_FETCH_FAILURE,
    error: error,
  };
};

const updateCartSuccess = (cartData) => {
  return {
    type: actionTypes.CART_FETCH_SUCCESS,
    cart: cartData,
  };
};

const updateCartFailure = (error) => {
  return {
    type: actionTypes.CART_FETCH_FAILURE,
    error: error,
  };
};

export const fetchCartById = (cartId, cb) => {
  return (dispatch) => {
    axios
      .get("/users/cart/read_single.php?id=" + cartId)
      .then((response) => {
        let cartData = response.data;
        localStorage.setItem("cart", JSON.stringify(cartData));
        dispatch(stopLoading());
        dispatch(fetchCartSuccess(cartData));
        cb();
      })
      .catch((error) => {
        dispatch(stopLoading());
        dispatch(fetchCartFailure(error));
      });
  };
};

export const updateCart = (cartData, cb) => {
  return (dispatch) => {
    axios
      .post("/users/cart/update.php", JSON.stringify(cartData))
      .then((response) => {
        dispatch(fetchCartById(cartData.cart_id, cb));
        dispatch(updateCartSuccess(cartData));
      })
      .catch((error) => {
        dispatch(stopLoading());
        cb();
        dispatch(updateCartFailure(error));
      });
  };
};

export const removeCartItem = (cartData, cart_item_id, cartItemPrice, cb) => {
  return (dispatch) => {
    var cartItems = cartData.cart_items?.map((cartItem) => {
      return {
        state: cartItem.cart_item_id === cart_item_id ? -1 : 0,
        cart_id: cartData.cart_id,
        cart_item_id: cartItem.cart_item_id,
        price: cartItem.price,
        quantity: cartItem.quantity,
        product_slug: cartItem.product_slug,
        product_id: cartItem.product_id,
        product_type: cartItem.product_type,
        product_name: cartItem.product_name,
        product_image: cartItem.product_image,
        venue: cartItem.venue,
        event_date: cartItem.event_date,
      };
    });

    let updatedCartData = {};

    if (cartItems.length <= 1) {
      updatedCartData = {
        ...cartData,
        sub_total: 0.0,
        total: 0.0,
        coupon_id: cartData.coupon.coupon_id,
        discount: cartData.coupon?.discount ? cartData.coupon?.discount : 0.0,
        cart_items: cartItems,
      };
    } else {
      updatedCartData = {
        ...cartData,
        sub_total:
          cartData.sub_total - cartItemPrice <= 0
            ? 0.0
            : cartData.sub_total - cartItemPrice,
        total:
          +(cartData.total - cartItemPrice) >= 0
            ? +(cartData.total - cartItemPrice)
            : 0.0,
        coupon_id: cartData.coupon.coupon_id,
        discount: cartData.coupon?.discount ? cartData.coupon?.discount : 0.0,
        cart_items: cartItems,
      };
    }
    dispatch(startLoading());
    dispatch(updateCart(updatedCartData, cb));
  };
};

export const clearCart = (cartData, cb) => {
  return (dispatch) => {
    var cartItems = cartData.cart_items?.map((cartItem) => {
      return {
        state: -1,
        cart_id: cartData.cart_id,
        cart_item_id: cartItem.cart_item_id,
        price: cartItem.price,
        quantity: cartItem.quantity,
        product_slug: cartItem.product_slug,
        product_id: cartItem.product_id,
        product_type: cartItem.product_type,
        product_name: cartItem.product_name,
        product_image: cartItem.product_image,
        venue: cartItem.venue,
        event_date: cartItem.event_date,
      };
    });

    let updatedCartData = {
      ...cartData,
      sub_total: 0.0,
      total: 0.0,
      coupon_id: -1,
      discount: 0.0,
      cart_items: cartItems,
    };
    dispatch(startLoading());
    dispatch(updateCart(updatedCartData, cb));
  };
};

export const addCartItem = (cartData, newCartItem) => {
  return (dispatch) => {
    var cartItems = cartData.cart_items?.map((cartItem) => {
      return {
        state: cartItem.cart_item_id,
        cart_id: cartData.cart_id,
        cart_item_id: cartItem.cart_item_id,
        price: cartItem.price,
        quantity: cartItem.quantity,
        product_id: cartItem.product_id,
        product_slug: cartItem.product_slug,
        product_type: cartItem.product_type,
        product_name: cartItem.product_name,
        product_image: cartItem.product_image,
        venue: cartItem.venue,
        event_date: cartItem.event_date,
      };
    });
    cartItems.push({
      state: 1,
      cart_id: cartData.cart_id,
      price: newCartItem.price,
      quantity: newCartItem.quantity,
      product_id: newCartItem.product_id,
      product_slug: newCartItem.product_slug,
      product_type: newCartItem.product_type,
      product_name: newCartItem.product_name,
      product_image: newCartItem.product_image,
      venue: newCartItem.venue,
      event_date: newCartItem.event_date,
    });

    var updatedCartData = {
      ...cartData,
      sub_total: +cartData.sub_total + +newCartItem.price,
      total: +cartData.total + +newCartItem.price,
      coupon_id: cartData.coupon.coupon_id,
      cart_items: cartItems,
    };
    dispatch(startLoading());
    dispatch(
      updateCart(updatedCartData, () => {
        dispatch(sendMessage("Added to cart.", "success"));
      })
    );
  };
};

export const removeCoupon = (cartData, cb) => {
  return (dispatch) => {
    var cartItems = cartData.cart_items?.map((cartItem) => {
      return {
        state: 0,
        cart_id: cartData.cart_id,
        cart_item_id: cartItem.cart_item_id,
        price: cartItem.price,
        quantity: cartItem.quantity,
        product_id: cartItem.product_id,
        product_slug: cartItem.product_slug,
        product_type: cartItem.product_type,
        product_name: cartItem.product_name,
        product_image: cartItem.product_image,
        venue: cartItem.venue,
        event_date: cartItem.event_date,
      };
    });
    var updatedCartData = {
      ...cartData,
      total: cartData.sub_total,
      discount: 0.0,
      coupon_id: null,
      cart_items: cartItems,
    };
    dispatch(startLoading());
    dispatch(updateCart(updatedCartData, cb));
  };
};

export const onCouponApply = (cartData, couponCode, cb) => {
  return (dispatch) => {
    let updatedCouponCode = couponCode.toUpperCase();
    let filterCriteria = {
      filters: [
        {
          field_name: "coupon_code",
          op: "=",
          value: updatedCouponCode,
        },
        {
          field_name: "status",
          op: "=",
          value: "0",
        },
        {
          field_name: "(year(created_at) - year(sysdate()))",
          op: "=",
          value: "0",
        },
      ],
      filter_op: "AND",
      sort: [],
    };
    dispatch(startLoading());
    axios
      .post("/admin/coupons/read.php", JSON.stringify(filterCriteria))
      .then((response) => {
        if (response.data.length <= 0) {
          dispatch(stopLoading());
          cb();
          dispatch(sendMessage("Coupon Code is not valid.", "error"));
        } else {
          let updatedCart = cartData;
          var cartItems = cartData.cart_items?.map((cartItem) => {
            return {
              state: 0,
              cart_id: cartData.cart_id,
              cart_item_id: cartItem.cart_item_id,
              price: cartItem.price,
              quantity: cartItem.quantity,
              product_id: cartItem.product_id,
              product_slug: cartItem.product_slug,
              product_type: cartItem.product_type,
              product_name: cartItem.product_name,
              product_image: cartItem.product_image,
              venue: cartItem.venue,
              event_date: cartItem.event_date,
            };
          });
          updatedCart.cart_items = cartItems;
          updatedCart.discount = response.data[0].discount;
          updatedCart.coupon_id = response.data[0].coupon_id;
          updatedCart.total =
            cartData.sub_total - response.data[0].discount <= 0
              ? 0.0
              : cartData.sub_total - response.data[0].discount;
          dispatch(updateCart(updatedCart, cb));
        }
      })
      .catch((error) => {
        cb();
        dispatch(stopLoading());
      });
  };
};
