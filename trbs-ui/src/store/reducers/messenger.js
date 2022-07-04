import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  message: {},
  messageType: "",
  newMessage: false,
};

const sendMessage = (state, action) => {
  return updateObject(state, {
    message: action.message,
    messageType: action.messageType,
    newMessage: true,
  });
};

const removeMessage = (state, action) => {
  return updateObject(state, {
    message: {},
    type: "",
    newMessage: false,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SEND_MESSAGE:
      return sendMessage(state, action);
    case actionTypes.REMOVE_MESSAGE:
      return removeMessage(state, action);
    default:
      return state;
  }
};

export default reducer;
