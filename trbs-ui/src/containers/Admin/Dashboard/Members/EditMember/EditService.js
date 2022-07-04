import axios from "../../../../../axios-iim";

export const fetchMemberById = async (memberId) => {
  let response = await axios.get("/member/read-single.php?id=" + memberId);
  return response;
};
