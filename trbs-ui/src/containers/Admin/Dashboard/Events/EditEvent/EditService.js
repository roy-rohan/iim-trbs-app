import axios from "../../../../../axios-iim";

export const fetchEventById = async (eventId) => {
  let response = await axios.get("/events/read-single.php?id=" + eventId);
  return response;
};
