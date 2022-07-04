import axios from "../../../../../axios-iim";

export const fetchSponserById = async (sponserId) => {
  let response = await axios.get("/sponsers/read-single.php?id=" + sponserId);
  return response;
};
