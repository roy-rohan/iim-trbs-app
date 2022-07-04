import axios from "../../../../../axios-iim";

export const fetchConnexionById = async (connexionId) => {
  let response = await axios.get(
    "/connexions/read-single.php?id=" + connexionId
  );
  return response;
};
