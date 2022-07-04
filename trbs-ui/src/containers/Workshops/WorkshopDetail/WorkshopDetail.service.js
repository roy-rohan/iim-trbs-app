import axios from "../../../axios-iim";

export const fetchWorkshopDetail = async (workshopSlug) => {
  const response = await axios.post(
    "/workshops/read.php",
    JSON.stringify({
      filters: [
        {
          field_name: "slug",
          value: workshopSlug,
          op: "=",
        },
      ],
      filter_op: "",
      sort: [],
    })
  );

  return response;
};

export const fetchImages = async (workshopId) => {
  const response = await axios.post(
    "/images/read.php",
    JSON.stringify({
      filters: [
        {
          field_name: "entity_id",
          value: workshopId,
          op: "=",
        },
        {
          field_name: "entity_type",
          value: "workshop",
          op: "=",
        },
      ],
      filter_op: "AND",
      sort: [],
    })
  );

  return response;
};
