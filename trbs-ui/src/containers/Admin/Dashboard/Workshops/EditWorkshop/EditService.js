import axios from "../../../../../axios-iim";

export const fetchEventById = async (eventId) => {
  let response = await axios.get("/workshop/read-single.php?id=" + eventId);
  return response;
};
