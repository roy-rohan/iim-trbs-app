import axios from "../../../../../axios-iim";

export const fetchSpeakerById = async (speakerId) => {
  let response = await axios.get("/speakers/read-single.php?id=" + speakerId);
  return response;
};
