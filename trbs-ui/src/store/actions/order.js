import moment from "moment";
import axios from "../../axios-iim";
import { updateCart } from "./cart";

import { startLoading, stopLoading } from "./common";
import { sendMessage } from "./messenger";

export const addOrder = (token, user, cartData, cb) => {
  return (dispatch) => {
    let bookingsTotal = 0;
    let bookings = cartData.cart_items.map((cartItem) => {
      bookingsTotal += +cartItem.price;
      return {
        price: cartItem.price,
        quantity: cartItem.quantity,
        product_id: cartItem.product_id,
        product_type: cartItem.product_type,
        product_name: cartItem.product_name,
        product_image: cartItem.product_image,
        venue: cartItem.venue,
        time: cartItem.event_date
          ? moment(cartItem.event_date).format("YYYY-MM-DD HH:mm:ss")
          : null,
        user_id: user.app_userid,
        status: "initiated",
      };
    });
    let order = {
      total: +cartData.total,
      taxes: 0,
      discount: +cartData.coupon.discount,
      user_id: user.app_user_id,
      coupon_id: cartData.coupon.coupon_id,
      bookings: bookings,
      status: "pending",
    };

    if (cartData.cart_items.length > 0 && order.total <= 0) {
      if (order.discount) {
        if (order.discount < bookingsTotal) {
          alert("Something went wrong. Please clear the cart and try again.");
          return;
        }
      } else {
        return;
      }
    }

    dispatch(startLoading(cartData, () => {}));
    axios
      .post("/users/order/create.php", JSON.stringify(order))
      .then((response) => {
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

        var updatedCartData = {
          ...cartData,
          sub_total: 0.0,
          total: 0.0,
          coupon_id: null,
          discount: 0.0,
          cart_items: cartItems,
        };

        if (+cartData.total > 0) {
          dispatch(updateCart(updatedCartData, () => {}));
          cb(token, user, cartData, response.data.order_id);
        } else {
          dispatch(
            updateCart(updatedCartData, () => {
              window.location.href = "/profile";
            })
          );
        }
      })
      .catch((error) => {
        dispatch(stopLoading());
        dispatch(sendMessage("Something went wrong.", "error"));
      });
  };
};
